import type { ReactNode } from "react";

/**
 * 모든 페이지가 공유하는 레이아웃 조각.
 *
 * 그리드 규칙 (sm 이상)
 *   [라벨 7rem] [메타 7rem] [본문 1fr], 열 간격 1.5rem → 본문 시작점 17rem
 * 모바일
 *   [라벨 4.5rem] [본문 1fr], 메타는 라벨 아래로 내려간다
 */

export const CONTENT_OFFSET = "sm:pl-[17rem]";

export const labelText = "text-[11px] leading-6 tracking-wide text-muted";

export const smallCaps =
  "text-[10px] font-medium uppercase tracking-[0.12em]";

/** 서브 페이지 제목: blog / projects / about / 상세 페이지 공통 */
export function PageHeader({
  title,
  subtitle,
  meta,
  size = "page",
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  /** page: 목록 페이지 제목, detail: 글·프로젝트 상세 제목 */
  size?: "page" | "detail";
  children?: ReactNode;
}) {
  const titleClass =
    size === "page"
      ? "text-6xl leading-none tracking-[-0.05em] sm:text-8xl"
      : "text-4xl leading-[1.15] tracking-[-0.03em] sm:text-6xl";

  return (
    <header className="pt-12 sm:pt-20">
      {meta ? (
        <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px] tabular-nums text-muted">
          {meta}
        </div>
      ) : null}
      <h1
        className={`border-b border-line pb-[0.22em] font-light text-foreground ${titleClass}`}
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          className={
            size === "page"
              ? "mt-4 break-keep text-lg font-light leading-8 text-foreground/80 sm:text-xl"
              : "mt-4 break-keep text-[15px] leading-7 text-muted"
          }
        >
          {subtitle}
        </p>
      ) : null}
      {children}
    </header>
  );
}

/** 섹션 제목 + 선택적 개수 */
export function SectionHeading({
  title,
  count,
  aside,
}: {
  title: ReactNode;
  count?: number;
  aside?: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
      <h2 className="flex items-baseline gap-3 text-xl font-normal tracking-tight text-foreground">
        {title}
        {count !== undefined ? (
          <span className="text-xs tabular-nums text-muted">({count})</span>
        ) : null}
      </h2>
      {aside ? <div className="hidden text-xs text-muted sm:block">{aside}</div> : null}
    </div>
  );
}

/** 3단 행. meta가 없으면 라벨이 두 칸을 차지한다 */
export function Row({
  label,
  meta,
  children,
  as: Tag = "li",
  dense = false,
}: {
  label?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  as?: "li" | "div";
  dense?: boolean;
}) {
  return (
    <Tag
      className={`grid grid-cols-[4.5rem_1fr] gap-x-4 border-b border-line sm:grid-cols-[7rem_7rem_1fr] sm:gap-x-6 ${
        dense ? "py-5" : "py-7"
      }`}
    >
      <div className={`${labelText} ${meta === undefined ? "sm:col-span-2" : ""}`}>
        {label}
        {meta !== undefined ? <div className="sm:hidden">{meta}</div> : null}
      </div>
      {meta !== undefined ? (
        <div className={`hidden sm:block ${labelText}`}>{meta}</div>
      ) : null}
      <div className="min-w-0">{children}</div>
    </Tag>
  );
}

/** 필터 칩 (블로그 카테고리·태그, 프로젝트 기술 스택 공통) */
export function chipClass(active: boolean) {
  return [
    "inline-flex items-baseline gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
    active
      ? "border-foreground bg-foreground text-background"
      : "border-line text-foreground hover:border-foreground",
  ].join(" ");
}
