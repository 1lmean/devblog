# 라우팅 & 페이지 구조

---

## App Router 파일 기반 라우팅

Next.js App Router는 `src/app/` 폴더 구조가 곧 URL 구조다.

```
src/app/
├── layout.tsx          → 모든 페이지에 공통 적용 (헤더, 푸터, 폰트, 테마)
├── page.tsx            → /
├── posts/
│   ├── page.tsx        → /posts
│   └── [slug]/
│       ├── page.tsx    → /posts/js-hiddenclass 등
│       └── opengraph-image.tsx → /posts/[slug]/opengraph-image
├── projects/
│   └── page.tsx        → /projects
├── opengraph-image.tsx → /opengraph-image
└── rss.xml/
    └── route.ts        → /rss.xml (API Route)
```

---

## Root Layout (layout.tsx)

모든 페이지가 공유하는 껍데기다. 여기서 정의한 것들:

**폰트 로딩**
```typescript
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});
```
`next/font/local`이 빌드 타임에 폰트 파일을 최적화하고, CSS 변수로 등록한다. `display: "swap"`은 폰트 로딩 전에 fallback 폰트를 보여줘서 레이아웃 시프트를 줄인다.

**Providers 래핑**
```typescript
<Providers>   // next-themes ThemeProvider
  <SiteHeader />
  {children}
  <footer>...</footer>
</Providers>
```
`next-themes`의 `ThemeProvider`는 클라이언트 컴포넌트다. 하지만 서버 컴포넌트(`layout.tsx`)에서 `<Providers>`로 감싸도 내부 `children`은 서버 컴포넌트로 남는다. 클라이언트 컴포넌트가 서버 컴포넌트를 children으로 받는 패턴이다.

**Metadata**
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "블로그", template: "%s · 블로그" },
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
};
```
`metadataBase`를 설정해야 OG 이미지 URL이 절대 경로가 된다. `template`은 각 페이지가 title을 설정하면 자동으로 " · 블로그"가 붙는다.

---

## 홈 페이지 (/)

**서버 컴포넌트**. Notion API로 최신 포스트 4개를 가져와서 카드로 보여준다.

```typescript
export default async function Home() {
  const posts = await getAllPosts();
  const bio = fs.readFileSync(path.join(process.cwd(), "content/bio.txt"), "utf-8").trim();
  // ...
}
```

bio.txt를 `fs.readFileSync`로 읽는 이유: 서버 컴포넌트는 Node.js 환경에서 실행되기 때문에 파일 시스템에 직접 접근할 수 있다. Notion에 바이오를 관리하는 것보다 텍스트 파일이 더 단순하다.

**왜 posts를 4개로 제한하나**: 홈은 최신 글을 힐끗 보여주는 공간이다. 전부 보고 싶으면 /posts로 가면 된다. 5개 이상이면 "모든 글 보기" 링크가 나타난다.

---

## 포스트 목록 (/posts)

```typescript
// posts/page.tsx — 서버 컴포넌트
export default async function Posts() {
  const [categories, tags, posts] = await Promise.all([
    getAllCategories(),
    getAllTags(),
    getAllPosts(),
  ]);
  return <PostsFilter categories={categories} tags={tags} posts={posts} />;
}
```

**왜 Promise.all 쓰나**: 세 Notion API 호출이 서로 의존성이 없다. 순차 실행하면 3배 느려진다. 병렬로 실행해서 가장 느린 하나의 시간만 기다린다.

**PostsFilter는 왜 클라이언트 컴포넌트인가**: 카테고리 클릭, 태그 멀티셀렉, 실시간 필터링이 `useState`를 필요로 한다. 상태가 있으면 `"use client"`다.

**서버/클라이언트 경계**: 데이터 fetch(서버) → props로 전달 → 필터링(클라이언트) 패턴. 클라이언트에서 Notion API를 직접 호출하지 않는다.

---

## 포스트 상세 (/posts/[slug])

가장 복잡한 페이지다.

**generateStaticParams**
```typescript
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
```
빌드 때 모든 slug를 미리 구워둔다. 런타임에 `[slug]`로 들어온 요청은 이미 만들어진 HTML을 서빙한다.

**레이아웃 구조**
```
┌────────────────────────────────────┐
│ 뒤로가기                           │
│ 카테고리 뱃지  ·  날짜             │
│ 제목 (text-4xl)                    │
│ 설명                               │
│ 태그들                             │
├──────────────────────┬─────────────┤
│                      │  목차       │
│  본문 (Markdown)     │  (sticky)   │
│                      │             │
└──────────────────────┴─────────────┘
```

**목차 사이드바**: `xl:` breakpoint 이상에서만 보인다. 모바일에서는 숨긴다. `TableOfContents`가 `IntersectionObserver`로 현재 화면에 보이는 헤딩을 추적해서 하이라이팅한다.

**PostBackButton**: `router.back()`을 호출한다. /에서 왔으면 /로, /posts에서 왔으면 /posts로 돌아간다. history가 있어야 작동하기 때문에 처음 진입(새 탭 등)하면 아무 일도 안 일어난다.

**메타데이터 생성**
```typescript
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: { ... },
  };
}
```
각 포스트마다 OG 메타데이터가 다르다. SNS에 링크 공유할 때 포스트 제목과 설명이 나온다.

---

## 프로젝트 (/projects)

구조는 /posts와 같다. 서버 컴포넌트에서 데이터 읽고 클라이언트 필터 컴포넌트에 전달.

차이: Notion API 대신 `src/lib/projects.ts`의 배열에서 데이터를 읽는다. 프로젝트는 자주 바뀌지 않고 개수도 적으니 코드에 하드코딩하는 게 더 관리하기 쉽다.

---

## RSS 피드 (/rss.xml)

```typescript
// rss.xml/route.ts — API Route
export async function GET() {
  const posts = await getAllPosts();
  const xml = generateRssFeed(posts);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
```

App Router에서 API Route는 `route.ts` 파일에 HTTP 메서드 이름으로 export한다. `page.tsx`는 HTML을 반환하고, `route.ts`는 Response 객체를 반환한다.

**Cache-Control**: RSS는 1시간 캐시, 만료 후에도 최대 24시간은 stale 데이터를 서빙하면서 백그라운드에서 갱신한다. 매 요청마다 Notion API를 치지 않는다.

---

## OG 이미지 (opengraph-image.tsx)

Next.js 13.3+부터 `opengraph-image.tsx`라는 파일을 만들면 해당 경로의 OG 이미지를 자동 생성한다. Vercel의 `@vercel/og`(내부적으로 Satori 사용)로 JSX → PNG 변환이 일어난다.

```typescript
// posts/[slug]/opengraph-image.tsx
export default async function OGImage({ params }) {
  const post = await getPostBySlug(params.slug);
  return new ImageResponse(
    <div style={{ ... }}>
      <span>{post.meta.category}</span>
      <h1>{post.meta.title}</h1>
      <p>{post.meta.description}</p>
    </div>
  );
}
```

`generateStaticParams`를 여기서도 export하면 빌드 타임에 모든 OG 이미지가 미리 생성된다.
