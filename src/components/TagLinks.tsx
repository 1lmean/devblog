import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function TagLinks({ tags, className = "" }: { tags: string[]; className?: string }) {
  if (tags.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-x-3 gap-y-1 ${className}`}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href="/posts"
            className="inline-flex text-xs text-muted transition-colors hover:text-foreground"
          >
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function CategoryLink({ category }: { category: string }) {
  return (
    <Link
      href="/posts"
      className="inline-flex rounded-full border border-line px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-foreground transition-colors hover:border-foreground"
    >
      {category}
    </Link>
  );
}

export function PostMetaLine({ post }: { post: PostMeta }) {
  if (!post.category && post.tags.length === 0) return null;
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {post.category ? <CategoryLink category={post.category} /> : null}
      <TagLinks tags={post.tags} />
    </div>
  );
}
