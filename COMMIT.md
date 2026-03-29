# Next + TypeScript 프로젝트용 Git Commit 가이드

이 문서는 **Next.js + TypeScript 프로젝트**를 기준으로, 커밋 메시지를 일관되게 작성하기 위한 개인 규칙이다.
목표는 세 가지다.

1. 커밋 제목만 봐도 변경 의도를 바로 알 수 있게 하기
2. 기능 추가 / 버그 수정 / 리팩터링 / 설정 변경을 명확히 구분하기
3. 이력서·포트폴리오·PR 회고에서 변경 흐름을 다시 읽기 쉽게 만들기

---

## 기본 형식

```text
<type>(<scope>): <subject>
```

예시:

```text
feat(auth): add Kakao login button
fix(search): prevent duplicate request on input change
refactor(cart): extract price formatter util
chore(eslint): migrate to flat config
```

scope는 선택이지만, **Next 프로젝트에서는 붙이는 쪽이 훨씬 낫다.**
페이지, 기능, 레이어가 비교적 명확해서 로그 가독성이 좋아진다.

---

## 추천 type 기준

### 1) `feat`
사용자 입장에서 **새 기능이 생겼을 때** 쓴다.

```text
feat(home): add trending perfume section
feat(record): support memo editing on history card
feat(auth): add social login redirect handling
feat(api): add server action for profile update
```

다음 같은 경우도 `feat`다.
- 새로운 API 연동
- 새 페이지 추가
- 필터/정렬/검색 기능 추가
- UI 컴포넌트가 아니라 **실제로 동작하는 기능** 추가

헷갈리는 포인트:
- 버튼만 추가했더라도 눌렀을 때 실제 기능이 생기면 `feat`
- 그냥 배치만 바꾼 거면 `style` 또는 `refactor`

---

### 2) `fix`
기존 동작이 잘못되어 있던 걸 고쳤을 때 쓴다.

```text
fix(login): handle expired token redirect correctly
fix(search): debounce keyword request to avoid duplicate fetches
fix(image): prevent layout shift in product card thumbnail
fix(form): keep checkbox state after validation error
fix(router): preserve query params after refresh
```

다음 상황이면 거의 `fix`다.
- hydration mismatch 해결
- 잘못된 조건문 수정
- 잘못된 라우팅 수정
- 모바일에서 깨지는 동작 수정
- 서버/클라이언트 분기 오류 수정

---

### 3) `refactor`
기능은 그대로인데 **구조만 개선**했을 때 쓴다.

```text
refactor(profile): split settings form into smaller sections
refactor(search): move fetch logic to custom hook
refactor(ui): extract common modal layout component
refactor(api): separate dto mapper from route handler
```

다음은 `refactor`다.
- 컴포넌트 분리
- 중복 로직 훅/유틸로 추출
- 파일 구조 재정리
- props/상태 구조 개선
- 가독성 개선

주의:
동작까지 바뀌면 `refactor` 단독보다 `feat`나 `fix`가 더 맞다.

---

### 4) `style`
**동작 변화 없는 스타일 변경**만 있을 때 쓴다.

```text
style(home): adjust card spacing and typography
style(button): update hover and focus styles
style(layout): align section padding across pages
```

포함 예시:
- CSS/Tailwind class 수정
- 여백, 폰트, 색상 변경
- 반응형 레이아웃 미세 조정

주의:
디자인 바꾸면서 기능 동작도 같이 바뀌면 `feat` 또는 `fix`로 가는 게 맞다.

---

### 5) `test`
테스트 추가/수정만 있을 때 쓴다.

```text
test(login): add integration tests for oauth callback
test(search): cover empty result state
test(form): verify validation message rendering
```

포함 예시:
- Vitest 테스트 추가
- RTL 테스트 수정
- Playwright 시나리오 추가
- mock / fixture 정리

---

### 6) `chore`
빌드/설정/의존성/스크립트 같은 **잡무성 변경**에 쓴다.

```text
chore(eslint): add next and typescript flat config
chore(deps): upgrade next to v16
chore(ci): cache pnpm store in github actions
chore(env): rename public env variables
```

포함 예시:
- package 업데이트
- lint/prettier/husky 설정
- CI/CD 설정
- tsconfig 조정
- npm script 추가

---

### 7) `perf`
성능 개선이 핵심이면 쓴다.

```text
perf(image): optimize remote image loading in list page
perf(search): memoize expensive filter calculation
perf(home): defer non-critical client component rendering
```

포함 예시:
- unnecessary rerender 감소
- lazy loading
- bundle size 절감
- 이미지 최적화
- 서버/클라 경계 조정으로 렌더링 비용 절감

---

### 8) `docs`
문서만 바꿨을 때 쓴다.

```text
docs(readme): add local setup guide
docs(commit): add commit naming examples
docs(architecture): document app router structure
```

---

## scope 추천 규칙

Next 프로젝트에서는 아래 정도로 나누면 무난하다.

### 기능 기준 scope
- `auth`
- `search`
- `home`
- `profile`
- `record`
- `feed`
- `comment`
- `admin`

### 레이어 기준 scope
- `ui`
- `api`
- `hooks`
- `store`
- `utils`
- `types`
- `config`
- `eslint`
- `ci`

### App Router 기준 scope
- `app`
- `layout`
- `route`
- `middleware`
- `metadata`

예시:

```text
feat(metadata): add dynamic og tags for post pages
fix(middleware): redirect unauthenticated users to login
refactor(app): split dashboard page into server and client parts
chore(config): update tsconfig path aliases
```

scope 너무 잘게 쪼개면 로그가 오히려 지저분하다.
**기능 단위 > 파일명 단위**로 잡는 게 낫다.

---

## subject 작성 규칙

제목은 짧고 바로 이해되게 쓴다.
영어로 쓴다면 보통 **동사 원형**으로 시작한다.

좋은 예:

```text
feat(search): add recent keyword section
fix(auth): prevent redirect loop after logout
refactor(ui): extract common dialog footer
```

별로인 예:

```text
feat: stuff
fix: bug fixed
refactor: code cleanup
```

피해야 할 것:
- 너무 추상적인 표현
- 한 커밋에 이것저것 다 넣고 제목 뭉개기
- `update`, `change`, `modify`만 반복하기

---

## body는 언제 쓰나

제목만으로 부족하면 body를 쓴다.
특히 아래 경우에는 쓰는 게 좋다.

- 왜 이렇게 바꿨는지 설명이 필요할 때
- 트레이드오프가 있을 때
- SSR/CSR/Server Component 경계처럼 문맥이 중요할 때
- 설정 변경 이유를 남겨야 할 때

예시:

```text
feat(search): add debounced keyword search

- reduce duplicate client requests while typing
- move fetch trigger to debounced value change
- keep immediate UI state update for input responsiveness
```

---

## breaking change가 있을 때

호환성 깨지는 변경이면 명확히 표시한다.

```text
feat(api)!: replace client fetch with server action
```

또는 body에 적는다.

```text
BREAKING CHANGE: rename response shape from items to data
```

---

## Next + TypeScript 프로젝트에서 자주 쓸 커밋 예시

### App Router / 페이지 구성

```text
feat(app): add onboarding page for new users
fix(layout): prevent duplicate header rendering on mobile
refactor(route): move post detail data fetching to server component
```

### metadata / SEO / OG / RSS

```text
feat(metadata): add dynamic open graph image for posts
feat(rss): generate rss feed for blog posts
fix(metadata): set canonical url for paginated pages
```

### form / validation

```text
feat(form): add zod validation for signup fields
fix(form): keep dirty state after server error
refactor(form): extract controlled input wrapper for react-hook-form
```

### API / fetch / server action

```text
feat(api): add server action for comment creation
fix(api): handle empty response in product list fetcher
refactor(api): centralize error parsing logic
```

### UI / design system

```text
feat(ui): add reusable bottom sheet component
style(ui): update badge variants and spacing
refactor(ui): unify button variants with cva
```

### 성능

```text
perf(image): replace img tags with next/image
perf(list): virtualize long review list rendering
perf(cache): avoid duplicate fetches with react cache
```

### 테스트

```text
test(app): add e2e coverage for signup flow
test(api): verify server action error handling
test(ui): cover modal keyboard interaction
```

### 설정

```text
chore(eslint): migrate project to flat config
chore(typescript): enable noUncheckedIndexedAccess
chore(ci): add lint and type-check steps
```

---

## 커밋을 쪼개는 기준

### 한 커밋에 넣어도 되는 것
- 하나의 기능을 위해 같이 움직이는 코드
- 하나의 버그를 고치기 위한 관련 수정
- 한 설정 변경을 위한 파일 묶음

### 나눠야 하는 것
- 기능 추가 + 스타일 수정 + 리팩터링을 한 번에 넣는 경우
- ESLint 설정 바꾸면서 unrelated 컴포넌트 로직까지 만지는 경우
- API 구조 수정 + UI 디자인 변경을 한 커밋에 넣는 경우

예:

좋음:
1. `chore(eslint): add flat config and ignore patterns`
2. `fix(ui): resolve lint errors in dialog component`
3. `refactor(search): simplify filter state structure`

별로:
1. `fix: update eslint and refactor pages and change styles`

이건 그냥 나중에 본인이 본인 로그 보고도 화남.

---

## 개인 규칙 추천

### rule 1
설정 파일 변경은 `chore(config)` 또는 `chore(eslint)`로 분리한다.

### rule 2
보이는 기능 추가는 웬만하면 `feat`로 쓴다.
리팩터링했다는 뿌듯함보다 사용자 가치가 더 중요하다.

### rule 3
버그 수정은 원인 중심으로 쓴다.

예:
```text
fix(auth): prevent session flicker on refresh
```

`fix(auth): update logic`보다 훨씬 낫다.

### rule 4
리팩터링은 **무엇을 분리/정리했는지** 드러나게 쓴다.

예:
```text
refactor(home): extract hero section into server component
```

### rule 5
스타일 커밋은 기능 커밋에 묻어넣지 않는다.
디자인 손댄 날은 은근 로그가 제일 더럽혀진다.

---

## 추천 워크플로우

작업 순서를 이렇게 가져가면 깔끔하다.

1. 설정 변경
2. 기능 추가
3. 버그 수정
4. 리팩터링
5. 테스트
6. 문서

예시:

```text
chore(eslint): add next flat config with typescript rules
feat(blog): add post detail page metadata
feat(rss): generate rss feed from post collection
fix(blog): resolve hydration warning in toc component
refactor(blog): extract markdown renderer utils
test(blog): add metadata generation tests
```

---

## 최종 요약

가장 많이 쓰게 될 실전 조합은 이거다.

- 기능 추가: `feat(scope): ...`
- 버그 수정: `fix(scope): ...`
- 구조 개선: `refactor(scope): ...`
- 스타일만: `style(scope): ...`
- 설정/도구: `chore(scope): ...`
- 테스트: `test(scope): ...`
- 성능: `perf(scope): ...`
- 문서: `docs(scope): ...`

커밋 메시지는 멋 부리는 문장이 아니라 **변경 이력 인덱스**다.
나중에 PR 볼 때, 회고 쓸 때, 면접에서 설명할 때, 결국 이 로그가 네 편이 된다.
