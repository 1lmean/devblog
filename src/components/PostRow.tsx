import Link from "next/link";
import { formatDotDate } from "@/lib/format-date";
import type { PostMeta } from "@/lib/posts";

type Props = {
  post: PostMeta;
  /** 넘기면 태그가 필터 버튼으로 동작한다 (글 목록 페이지) */
  onTagClick?: (tag: string) => void;
  activeTags?: Set<string>;
};

/**
 * 뉴스 리스트형 글 한 줄.
 * [카테고리] [날짜] [제목 · 요약 · READ MORE] 3단 구성, 위아래 헤어라인으로 구분한다.
 */
export function PostRow({ post, onTagClick, activeTags }: Props) {
  return (
    <li className="grid grid-cols-[4.5rem_1fr] gap-x-4 border-b border-line py-6 sm:grid-cols-[7rem_7rem_1fr] sm:gap-x-6">
      <div className="text-[11px] leading-6 tracking-wide text-muted sm:pt-0.5">
        <span className="block uppercase">{post.category ?? "Note"}</span>
        <time dateTime={post.date} className="block tabular-nums sm:hidden">
          {formatDotDate(post.date)}
        </time>
      </div>

      <time
        dateTime={post.date}
        className="hidden pt-0.5 tabular-nums text-[11px] leading-6 text-muted sm:block"
      >
        {formatDotDate(post.date)}
      </time>

      <div className="min-w-0">
        <Link
          href={`/posts/${post.slug}`}
          className="group block focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          <h3 className="text-base leading-7 text-foreground sm:text-lg">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
              {post.title}
            </span>
          </h3>
          {post.description ? (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">
              {post.description}
            </p>
          ) : null}
          <span className="mt-2 inline-block text-[10px] font-medium uppercase tracking-[0.12em] text-accent">
            Read more
          </span>
        </Link>

        {post.tags.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
            {post.tags.map((tag) => (
              <li key={tag}>
                {onTagClick ? (
                  <button
                    type="button"
                    onClick={() => onTagClick(tag)}
                    className={
                      activeTags?.has(tag)
                        ? "text-accent"
                        : "transition-colors hover:text-foreground"
                    }
                  >
                    #{tag}
                  </button>
                ) : (
                  <span>#{tag}</span>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}
