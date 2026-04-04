# 컴포넌트 설계 결정

---

## 서버 컴포넌트 vs 클라이언트 컴포넌트 경계

App Router에서 모든 컴포넌트는 기본적으로 서버 컴포넌트다. `"use client"`를 선언해야만 클라이언트 컴포넌트가 된다.

**클라이언트 컴포넌트로 만든 것들과 이유**:

| 컴포넌트 | 이유 |
|---|---|
| `PostsFilter` | `useState` (필터 상태) |
| `ProjectsFilter` | `useState` (필터 상태) |
| `TableOfContents` | `useState` (active heading), `useEffect` (IntersectionObserver) |
| `PostBackButton` | `useRouter` (router.back()) |
| `ThemeToggle` | `useTheme` (next-themes), `useState` (mount guard) |
| `Markdown` | `react-markdown`이 클라이언트 렌더링 필요 |
| `Providers` | `ThemeProvider`가 클라이언트 컴포넌트 |

**서버 컴포넌트로 남긴 것들**:
- `SiteHeader`, `NavButton`, `PostCard`, `TagLinks` — 상태 없음, 인터랙션 없음

**패턴**: 서버 컴포넌트가 데이터를 가져와서 클라이언트 컴포넌트에 props로 내려준다. 클라이언트 컴포넌트 자체는 API 호출을 하지 않는다.

---

## NavButton — 폴리모픽 컴포넌트

같은 스타일의 버튼인데, 상황에 따라 다른 HTML 요소를 렌더링해야 한다:
- 내부 링크 → Next.js `<Link>`
- 외부 링크 → `<a target="_blank">`
- 클릭 이벤트 → `<button>`

세 경우를 하나의 컴포넌트로 처리한다:

```typescript
type NavLinkProps = ComponentPropsWithoutRef<typeof Link> & { as?: "link" };
type NavAnchorProps = ComponentPropsWithoutRef<"a"> & { as: "a"; href: string };
type NavButtonElementProps = ComponentPropsWithoutRef<"button"> & { as: "button" };

type NavButtonProps = NavLinkProps | NavAnchorProps | NavButtonElementProps;
```

`as` prop으로 어떤 요소를 렌더링할지 결정한다. 타입도 각 경우마다 정확하게 추론된다. `as="a"`면 `<a>` 속성만 허용, `as="button"`이면 `<button>` 속성만 허용.

```typescript
export function NavButton(props: NavButtonProps) {
  if (props.as === "button") { return <button ... /> }
  if (props.as === "a") { return <a ... /> }
  return <Link ... />  // 기본값
}
```

---

## Markdown — 커스텀 컴포넌트 오버라이드

`react-markdown`은 마크다운의 각 요소를 기본 HTML 태그로 변환한다. `components` prop으로 이를 오버라이드할 수 있다.

**왜 오버라이드하는가**: 기본 HTML 태그에는 스타일이 없다. Tailwind는 CSS reset을 포함하기 때문에 `<h1>`, `<p>`, `<ul>` 등이 전부 스타일 없는 상태다. 각 요소에 Tailwind 클래스를 붙여야 한다.

```typescript
const components: Components = {
  h2: ({ children, ...props }) => (
    <h2
      id={slugify(getHeadingText(children))}  // TOC 연결용 id
      className="mt-10 text-2xl font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h2>
  ),
  code: (props) => {
    const { className, children } = props;
    const inline = !className;  // className이 없으면 인라인 코드
    if (inline) {
      return <code className="rounded bg-zinc-100 px-1.5 ...">...</code>;
    }
    return <code className={className}>...</code>;  // 코드블록은 className 유지 (hljs 클래스 필요)
  },
  // ...
};
```

**heading에 id 붙이는 이유**: 목차의 각 항목이 `href="#제목-텍스트"` 형태의 앵커 링크다. 이게 동작하려면 실제 헤딩 요소에 같은 id가 있어야 한다. `slugify()`로 헤딩 텍스트를 URL-safe id로 변환해서 붙인다.

**inline vs block code 구분**: react-markdown은 인라인 코드(`` `code` ``)와 코드블록(` ```js ``` `)을 모두 `<code>` 요소로 전달한다. 구분 방법은 `className` 유무다. 코드블록은 `language-js` 같은 className이 붙고, 인라인은 없다.

---

## TableOfContents — IntersectionObserver

```typescript
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      }
    },
    { rootMargin: "0px 0px -80% 0px" }  // 뷰포트 상단 20%만 인식
  );

  document.querySelectorAll("h1, h2, h3").forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}, []);
```

**rootMargin "0px 0px -80% 0px"의 의미**: 뷰포트의 아래 80%를 잘라낸다. 화면 상단 20% 영역에 헤딩이 들어와야 active로 인식한다. 이게 없으면 화면에 두 헤딩이 동시에 보일 때 아래쪽 헤딩이 더 먼저 active 되는 이상한 동작이 생긴다.

**sticky 포지셔닝이 작동하려면**: `aside` 요소가 article과 같은 flex 컨테이너 안에 있어야 하고, aside의 height가 article과 같아야 한다. flex 기본값인 `align-items: stretch`가 이걸 처리한다. (`items-start`를 제거한 이유가 이거다. items-start를 쓰면 aside가 내용 높이로만 줄어들어서 sticky가 작동 안 함)

---

## PostsFilter — Set 기반 멀티셀렉

태그 필터링은 여러 개를 동시에 선택할 수 있어야 한다. 배열 대신 Set을 쓴 이유:

```typescript
const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

const toggleTag = (tag: string) => {
  setActiveTags((prev) => {
    const next = new Set(prev);  // 불변성: 새 Set 생성
    next.has(tag) ? next.delete(tag) : next.add(tag);
    return next;
  });
};
```

- `Set.has()` 조회: O(1). 배열 `includes()`는 O(n).
- 중복 없음 보장.
- `activeTags.has(tag)`로 현재 선택 여부를 바로 확인해 버튼 스타일에 적용.

**필터 로직**:
```typescript
const filtered = posts.filter((p) => {
  if (activeCategory && p.category !== activeCategory) return false;
  // 카테고리는 AND, 태그는 OR (하나라도 포함이면 통과)
  if (activeTags.size > 0 && !p.tags.some((t) => activeTags.has(t))) return false;
  return true;
});
```

카테고리 AND 태그 조합. 같은 카테고리 안에서 여러 태그 중 하나라도 포함된 글을 찾는 방식이다.

---

## ThemeToggle — hydration mismatch 방지

```typescript
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);

if (!mounted) return <div className="h-9 w-9" />;  // placeholder
```

**왜 필요한가**: `useTheme()`은 클라이언트에서만 실제 테마를 알 수 있다. 서버는 항상 `undefined`를 반환한다. 서버 렌더링 결과와 클라이언트 첫 렌더링 결과가 달라지면 React가 hydration error를 낸다.

mount 전에는 같은 크기의 빈 div를 반환해서 레이아웃은 유지하되, 테마 의존 렌더링은 mount 후에만 한다.

---

## TagLinks — 세 가지 변형

```typescript
// 태그 칩 목록
export function TagLinks({ tags, className }: { tags: string[]; className?: string }) { ... }

// 카테고리 뱃지 하나
export function CategoryLink({ category }: { category: string }) { ... }

// 포스트 메타 한 줄 (카테고리 + 태그 조합)
export function PostMetaLine({ category, tags }: { category?: string; tags: string[] }) { ... }
```

세 변형을 하나의 파일로 묶은 이유: 모두 태그/카테고리 표시와 관련이 있고, 스타일 일관성을 한 곳에서 관리하기 위해서다. 각각 별도 파일로 만들면 3개 파일을 왔다갔다 해야 한다.

---

## PostCard — overflow 처리

```typescript
<h3 className="mt-1 truncate ...">  // 한 줄 잘림 + ...
<time className="block truncate ...">  // block 필요! time은 inline 요소
<TagLinks className="mt-2 overflow-hidden" />  // 태그가 넘치면 클립
```

`truncate`는 `overflow-hidden + text-overflow: ellipsis + white-space: nowrap`을 한번에 적용한다. `<time>`은 inline 요소라서 `truncate`가 작동하려면 `block`으로 변경이 필요하다.
