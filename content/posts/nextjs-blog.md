---
title: Next.js로 블로그 만들기
date: "2026-03-29"
description: App Router와 마크다운 파일 기반으로 정적 블로그를 구성하는 방법을 정리했습니다.
category: 개발
tags:
  - Next.js
  - Markdown
  - 블로그
---

이 사이트는 **Next.js 16** App Router와 `content/posts` 폴더의 `.md` 파일로 글을 불러옵니다.

### 구성 요약

1. `gray-matter`로 프론트매터 파싱
2. `react-markdown` + `remark-gfm`으로 본문 렌더링
3. 빌드 시 `generateStaticParams`로 글 경로 생성

새 글을 쓰려면 `content/posts/글-slug.md` 파일을 추가하면 됩니다.
