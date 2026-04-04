# 기술스택 선택 이유

---

## Next.js 16 (App Router)

**선택 이유**: 블로그처럼 콘텐츠 중심 사이트는 SEO가 핵심인데, App Router는 서버 컴포넌트를 기본으로 쓰기 때문에 클라이언트 JS 번들 없이 HTML을 바로 만들어낸다. 즉, 검색 엔진이 JS 실행 없이 콘텐츠를 읽을 수 있다.

`generateStaticParams()`로 포스트 상세 페이지를 빌드 타임에 미리 생성(`SSG`)하기 때문에, Notion API 호출 없이 정적 HTML을 서빙한다. 응답속도가 빠르고 Notion API rate limit도 안 맞는다.

**왜 Pages Router 안 씀**: Pages Router는 `getStaticProps` / `getServerSideProps`로 데이터 페칭을 했는데, App Router는 서버 컴포넌트 안에서 `await`로 바로 fetch하면 된다. 코드가 훨씬 직관적이다.

---

## React 19

**선택 이유**: Next.js 16이 React 19를 기본으로 쓴다. Server Components, `use()` hook, 비동기 컴포넌트(`async function Component()`) 같은 기능이 정식 지원된다.

실제로 이 프로젝트에서 `async function Home()`, `async function Posts()` 처럼 서버 컴포넌트를 async 함수로 바로 선언하고 그 안에서 `await getAllPosts()` 호출하고 있다.

---

## TypeScript

**선택 이유**: Notion API 응답이 복잡하다. `block.type`에 따라 구조가 완전히 달라지기 때문에 타입 없이 쓰면 런타임 에러가 너무 많이 난다.

`PostMeta`, `TocItem`, `Project`, `RichTextItem` 같은 타입을 직접 정의해서 데이터 흐름 전체를 타입으로 추적하고 있다.

`tsconfig.json`에 `@/*` path alias를 걸어서 상대경로 지옥(`../../../components/...`)을 없앴다.

---

## Tailwind CSS v4

**선택 이유**: v3까지는 `tailwind.config.ts`에 `content` 배열, `theme.extend` 같은 설정을 따로 관리해야 했다. v4는 CSS 파일 안에서 전부 처리한다.

```css
/* globals.css */
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-pretendard);
  --font-mono: var(--font-geist-mono);
}
```

이렇게 CSS 파일 하나에서 테마 커스터마이징까지 끝난다. 설정 파일이 하나 줄었고, CSS 변수와 Tailwind 토큰이 같은 파일 안에서 연결된다.

**다크모드**: `@custom-variant dark (&:where(.dark, .dark *))` 선언으로 `.dark` 클래스 기반 다크모드를 쓴다. 시스템 설정이 아니라 유저가 직접 토글하는 방식이다.

---

## Notion + @notionhq/client + notion-to-md

**선택 이유**: 글쓰는 환경이 중요하다. Notion은 블록 에디터라 마크다운 파일을 직접 편집하는 것보다 훨씬 편하다. 이미지 드래그앤드롭, 표, 코드블록, 컬러 텍스트 전부 GUI로 처리된다.

CMS 솔루션(Contentful, Sanity 등)은 별도 어드민을 배워야 하는데 Notion은 이미 익숙하다.

- `@notionhq/client`: Notion 공식 JS SDK. 데이터베이스 쿼리, 블록 읽기에 사용.
- `notion-to-md`: Notion 블록 구조를 마크다운 문자열로 변환해주는 라이브러리. 직접 블록을 파싱하면 코드가 수백 줄이 되는데, 이걸로 대부분 처리된다.

단, notion-to-md가 **Notion 컬러 어노테이션**을 처리 못해서 커스텀 트랜스포머를 직접 등록했다 (`src/lib/posts.ts`의 `n2m.setCustomTransformer("paragraph", ...)`).

---

## react-markdown + rehype-highlight + rehype-raw + remark-gfm

**선택 이유**: Notion에서 가져온 콘텐츠는 마크다운 문자열이다. 이걸 HTML로 렌더링해야 하는데, 단순 `dangerouslySetInnerHTML`은 XSS 위험이 있고 커스터마이징이 불가능하다.

`react-markdown`은 마크다운을 React 컴포넌트 트리로 변환하는데, 각 요소(`h1`, `p`, `code`, `pre` 등)를 커스텀 컴포넌트로 오버라이드할 수 있다. Tailwind 클래스도 이 시점에 붙인다.

- `remark-gfm`: GitHub Flavored Markdown 지원. 테이블, 체크박스, 취소선이 여기서 처리된다.
- `rehype-highlight`: `<pre><code class="language-js">` 블록에 syntax highlighting용 클래스를 붙인다. CSS는 `globals.css`에 직접 작성했다.
- `rehype-raw`: Notion 컬러 커스텀 트랜스포머가 `<p><span style="color:...">` 같은 HTML을 출력하는데, 기본 react-markdown은 이걸 텍스트로 escape 처리한다. rehype-raw가 있어야 HTML로 인식된다.

---

## next-themes

**선택 이유**: 다크모드 구현에서 hydration mismatch가 문제다. 서버는 유저의 테마를 모르니까 항상 light로 렌더링하는데, 클라이언트에서 dark로 바꾸면 HTML이 달라져서 React가 경고를 낸다.

next-themes는 `<html>` 태그에 `suppressHydrationWarning`을 달고, 스크립트를 주입해서 초기 렌더링 전에 테마 클래스를 미리 적용한다. 그래서 dark 테마여도 깜빡임이 없다.

---

## Pretendard

**선택 이유**: Next.js 기본 폰트인 Geist는 영문 전용이다. 한국어를 쓰면 시스템 폰트로 fallback되는데, OS마다 달라서 일관성이 없다.

Pretendard는 한국어 웹폰트 중에서 Inter(가장 많이 쓰이는 영문 폰트)와 자형이 가장 비슷하고, variable font라서 하나의 파일로 45~920 굵기를 전부 커버한다.

`next/font/local`로 자체 호스팅하기 때문에 Google Fonts 같은 외부 서버에 요청이 나가지 않는다. 개인정보 이슈도 없고 응답속도도 빠르다.

---

## lucide-react

**선택 이유**: MIT 라이선스, 트리쉐이킹 지원, TypeScript 타입 내장. SVG 아이콘을 직접 만들거나 다른 라이브러리 쓸 이유가 없다. `<Sparkles />`, `<ArrowRight />`, `<ExternalLink />` 같은 아이콘을 import 하나로 처리한다.
