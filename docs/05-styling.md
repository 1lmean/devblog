# 스타일링 전략

---

## Tailwind CSS v4 — 무엇이 달라졌나

v3까지는 `tailwind.config.ts`가 있었다:

```typescript
// v3 방식 (이 프로젝트에는 없음)
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: { sans: ["Pretendard", ...] }
    }
  }
}
```

v4는 이 파일이 없다. 대신 CSS에서 전부 처리한다:

```css
/* globals.css */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --font-sans: var(--font-pretendard);
  --font-mono: var(--font-geist-mono);
}
```

**`@custom-variant dark`**: `.dark` 클래스가 조상 요소에 있을 때 `dark:` prefix를 활성화하는 규칙. next-themes가 `<html class="dark">`를 달아주면 그 안의 모든 `dark:` 클래스가 적용된다.

**`@theme inline`**: Tailwind 토큰을 CSS 변수로 매핑. `font-sans`가 사용되는 곳(`body`, `font-sans` 클래스 등)에서 자동으로 `--font-pretendard` CSS 변수를 참조하게 된다.

---

## CSS 변수 기반 테마

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}
.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

다크모드를 미디어쿼리(`@media (prefers-color-scheme: dark)`) 대신 클래스(`.dark`)로 처리하는 이유: 유저가 시스템 설정과 다른 테마를 원할 때 직접 토글할 수 있어야 한다. 미디어쿼리 방식은 시스템 설정을 따라가서 수동 제어가 불가능하다.

---

## page-shell — 최대 너비 통일

```css
@layer components {
  .page-shell {
    @apply mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8;
  }
}
```

모든 페이지의 content 영역이 같은 최대 너비(`max-w-5xl`, 1024px)를 쓴다. 헤더, 푸터, 각 페이지 `<main>`에 전부 이 클래스를 붙여서 일관된 레이아웃 그리드를 유지한다.

반응형 padding: 모바일 `px-4` → 태블릿 `sm:px-6` → 데스크탑 `md:px-8`. 화면이 클수록 여백이 더 생긴다.

---

## 다크모드 색상 선택

이 프로젝트는 zinc 계열 색상을 메인으로 쓴다:

- **배경**: `zinc-100` (light) / `zinc-800` (dark)
- **텍스트 주**: `zinc-900` (light) / `zinc-50` (dark)
- **텍스트 부**: `zinc-500` / `zinc-400`
- **테두리**: `zinc-200` / `zinc-800`

zinc는 회색 계열 중에서 가장 중립적이다. blue/gray처럼 색조가 섞이지 않아서 텍스트 가독성이 좋다.

---

## Syntax Highlighting — 직접 CSS 작성

`rehype-highlight`는 코드블록 토큰에 `.hljs-keyword`, `.hljs-string` 같은 클래스를 붙인다. 실제 색상은 CSS가 담당한다.

highlight.js 공식 theme CSS를 가져다 쓰는 대신, GitHub 라이트/다크 테마 색상을 `globals.css`에 직접 작성했다:

```css
.hljs-keyword { color: #cf222e; }          /* GitHub light 빨간색 */
.dark .hljs-keyword { color: #ff7b72; }    /* GitHub dark 연한 빨간색 */

.hljs-string { color: #0a3069; }
.dark .hljs-string { color: #a5d6ff; }
```

**왜 직접 작성했나**: 외부 CSS 파일을 import하면 다크모드 대응이 번거롭다. highlight.js theme은 별도 라이트/다크 파일이 있어서 조건부로 로드해야 한다. 직접 작성하면 다크모드 색상을 한 파일에서 `.dark .hljs-*` 패턴으로 관리할 수 있다.

---

## 헤더 스타일링

```typescript
<header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
```

- `bg-white/80`: 배경색 80% 불투명. 뒤 콘텐츠가 살짝 비침.
- `backdrop-blur`: 뒤 콘텐츠를 블러 처리. 스크롤할 때 헤더 아래 콘텐츠가 흐릿하게 보이는 효과.

이 조합이 "glassmorphism" 효과다. sticky 헤더에서 콘텐츠가 겹칠 때 깔끔하게 보인다.

---

## 폰트 전략

**Pretendard (한국어 본문)**
- `next/font/local`로 자체 호스팅
- Variable font: 단일 woff2 파일로 45~920 weight 전체 커버
- `display: "swap"`: 폰트 로딩 전 fallback 폰트로 텍스트 먼저 보여줌

**Geist Mono (코드)**
- `next/font/google`로 Google Fonts에서 로딩
- 코드블록, 인라인 코드, 타임스탬프 등에 `font-mono` 클래스로 적용

**왜 두 폰트를 나눴나**: 한국어 본문은 Pretendard가 훨씬 자연스럽다. 하지만 코드는 가독성을 위해 고정폭 폰트가 필요하다. Pretendard는 가변폭이라 코드에 쓰면 정렬이 안 맞는다.

---

## 반응형 전략

- **모바일 우선**: 기본 스타일이 모바일, `sm:` `md:` `lg:` `xl:`로 데스크탑 확장
- **TOC 사이드바**: `xl:block`으로 1280px 이상에서만 보임. 좁은 화면에서 사이드바 공간이 없기 때문
- **포스트 카드 그리드**: 홈페이지의 포스트 카드는 `flex` + `w-1/4`로 4열. 좁은 화면에서 카드가 찌그러지는 문제는 `truncate`와 `overflow-hidden`으로 해결
- **padding**: 페이지마다 `px-6` 또는 `page-shell`(responsive padding)로 일관성 유지
