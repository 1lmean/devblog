# Notion CMS 데이터 흐름

---

## 전체 흐름 요약

```
Notion DB
  └─ @notionhq/client (REST API 호출)
       └─ notion-to-md (블록 → 마크다운 변환)
            └─ 커스텀 트랜스포머 (컬러 텍스트 처리)
                 └─ PostMeta / 마크다운 문자열
                      └─ Next.js 서버 컴포넌트에서 props로 전달
                           └─ <Markdown> 클라이언트 컴포넌트에서 렌더링
```

---

## Notion DB 구조

Notion 데이터베이스의 각 row가 하나의 포스트다. 사용 중인 property:

| Property 이름 | Notion 타입 | 설명 |
|---|---|---|
| `Slug` | Title | URL 경로 (`/posts/js-hiddenclass`) |
| `Title` | Rich Text | 포스트 제목 |
| `Date` | Date | 작성일 |
| `Description` | Rich Text | 요약문 |
| `Tags` | Multi-select | 태그 목록 |
| `Category` | Select | 카테고리 (단일) |
| `Published` | Checkbox | 발행 여부 (체크된 것만 노출) |

`Published` 체크박스로 드래프트를 관리한다. Notion 안에서 작성 중인 글은 체크 안 해두면 블로그에 안 뜬다.

---

## getAllPosts() — 목록 가져오기

```typescript
// src/lib/posts.ts
export async function getAllPosts(): Promise<PostMeta[]> {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Date", direction: "descending" }],
  });
  // ...
}
```

**왜 서버에서만 실행되는가**: `NOTION_DATABASE_ID`, `NOTION_TOKEN`은 서버 사이드 환경변수(`NEXT_PUBLIC_` 접두사 없음)다. 브라우저에서 이 코드가 실행되면 환경변수가 `undefined`가 된다. 서버 컴포넌트(`async function Posts()`)에서만 호출하고, 결과를 props로 클라이언트 컴포넌트에 내려준다.

**정렬**: Notion API 레벨에서 날짜 내림차순으로 정렬해서 받는다. JS에서 다시 정렬할 필요 없다.

---

## getPostBySlug() — 본문 가져오기

포스트 목록은 DB property만 읽으면 되지만, 본문은 **블록(Block)** 을 읽어야 한다. Notion에서 문단, 코드블록, 이미지, 표 등이 전부 블록이다.

```typescript
export async function getPostBySlug(slug: string) {
  // 1. DB에서 slug로 해당 row 찾기
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: { property: "Slug", title: { equals: slug } },
  });

  // 2. notion-to-md로 블록 → 마크다운 변환
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const { parent: markdown } = n2m.toMarkdownString(mdBlocks);

  return { meta, markdown };
}
```

`notion-to-md`의 `pageToMarkdown()`이 내부적으로 Notion API를 여러 번 호출해서 모든 블록을 읽는다. 재귀적으로 중첩 블록(토글 안의 내용 등)도 처리한다.

---

## 커스텀 트랜스포머 — Notion 컬러 처리

Notion에서 텍스트에 색을 입히면 rich_text 배열의 각 item에 `annotations.color`가 붙는다. notion-to-md 기본 동작은 이 컬러 정보를 버린다.

**해결책**: `paragraph` 블록에 커스텀 트랜스포머를 등록해서 컬러 어노테이션이 있으면 직접 HTML을 만들어 반환한다.

```typescript
n2m.setCustomTransformer("paragraph", async (block) => {
  const { rich_text, color: blockColor } = block.paragraph;

  // 컬러 어노테이션이 없으면 false → 기본 notion-to-md 처리
  if (!needsColorHtml(rich_text, blockColor)) return false;

  // 있으면 <p><span style="color:...">텍스트</span></p> 형태 HTML 반환
  const content = processRichText(rich_text);
  return `<p>${content}</p>`;
});
```

`false`를 반환하면 notion-to-md가 자체 처리를 한다. HTML을 반환하면 그게 마크다운에 그대로 들어간다.

이 HTML이 나중에 `react-markdown`에서 `rehype-raw` 플러그인 덕분에 실제 DOM 요소로 렌더링된다.

**NOTION_COLORS 매핑**:

```typescript
const NOTION_COLORS: Record<string, string> = {
  red: "#eb3b3b",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  // ...background 색상도 포함
};
```

Notion 컬러 이름(`red`, `blue_background` 등)을 CSS 색상값으로 매핑한다.

---

## generateStaticParams() — SSG 처리

```typescript
// src/app/posts/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
```

빌드 타임에 이 함수가 실행되어 모든 slug 목록을 만들고, 각 slug에 대해 `getPostBySlug()`를 호출해서 정적 HTML을 생성한다.

**결과**: 배포된 블로그에서 포스트 페이지를 열면 Notion API 호출이 **없다**. 이미 빌드 때 만들어진 HTML을 그냥 서빙한다. 빠르고 API rate limit과 무관하다.

**단점**: 새 글을 Notion에 작성해도 재배포하기 전까지는 블로그에 안 뜬다. 이건 정적 블로그의 트레이드오프다. (ISR을 쓰면 해결되지만 현재는 쓰지 않음)

---

## 이미지 URL 만료 문제

Notion이 업로드한 이미지에 서명된 URL(signed URL)을 준다. 이 URL은 **1시간 후 만료**된다.

빌드 타임에 HTML을 생성해도, HTML 안의 `<img src="https://...notion...">` URL이 1시간 뒤엔 404가 된다.

**현재 해결책**: 중요한 이미지는 `public/images/posts/`에 직접 저장하고, Notion 본문에서 해당 이미지를 참조할 때 `/images/posts/파일명.png` 경로를 쓴다. 이 경로는 Next.js가 정적 파일로 서빙하기 때문에 만료가 없다.

---

## 데이터 캐싱 현황

현재는 별도 캐싱 없이 매 빌드마다 Notion API를 호출한다. `next/cache`의 `revalidate` 같은 설정도 없다.

개발 서버(`next dev`)에서는 API 호출이 매 요청마다 발생한다. 프로덕션 빌드(`next build`)에서는 SSG로 생성된 HTML이 캐시되기 때문에 런타임 API 호출이 없다.
