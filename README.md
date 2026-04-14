# 1lmean devblog

개인 기술 블로그입니다.

🔗 **[1lmeandevblog.vercel.app](https://1lmeandevblog.vercel.app/)**

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **CMS**: Notion API (`@notionhq/client` v5)
- **Markdown 변환**: `notion-to-md` + `react-markdown`
- **Syntax Highlighting**: `rehype-highlight`
- **Fonts**: Pretendard
- **Deployment**: Vercel
- **Package Manager**: pnpm

## Features

- Notion 데이터베이스 기반 포스트 관리
- 태그 / 카테고리 분류 및 필터링
- 다크모드 토글 (`next-themes`)
- 반응형 디자인
- 포스트 카드 형태 목록
- 포스트 본문 목차(ToC) — 스크롤 위치에 따라 활성 항목 하이라이트
- RSS 피드 (`/rss.xml`)
- OG 이미지 자동 생성 (`next/og`)
- 프로젝트 페이지 (`/projects`)

## Project Structure

```
src/
├── app/
│   ├── posts/
│   │   └── [slug]/       # 포스트 상세 페이지
│   ├── projects/         # 프로젝트 목록 페이지
│   ├── rss.xml/          # RSS 피드 라우트 핸들러
│   ├── opengraph-image.tsx  # 사이트 OG 이미지
│   └── layout.tsx        # 루트 레이아웃
├── components/
│   ├── SiteHeader.tsx    # 헤더 / 네비게이션
│   ├── PostCard.tsx      # 포스트 카드
│   ├── PostsFilter.tsx   # 태그·카테고리 필터
│   ├── TableOfContents.tsx  # 목차 (IntersectionObserver)
│   ├── Markdown.tsx      # 마크다운 렌더러
│   ├── ThemeToggle.tsx   # 다크모드 토글
│   └── TagLinks.tsx      # 태그 링크
└── lib/
    ├── posts.ts          # Notion API 연동 (포스트)
    ├── projects.ts       # 프로젝트 데이터
    ├── toc.ts            # 목차 파싱
    ├── site.ts           # 사이트 URL 유틸
    ├── xml.ts            # XML 이스케이프 유틸
    └── format-date.ts    # 날짜 포맷 유틸
```

## Getting Started

```bash
pnpm install
pnpm dev
```

환경변수 설정 (`.env.local`):

```
NOTION_API_KEY=your_api_key
NOTION_DATABASE_ID=your_database_id
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```