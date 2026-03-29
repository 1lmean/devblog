import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function TagLinks({ tags, className = "" }: { tags: string[]; className?: string }) {
  if (tags.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/tags/${encodeURIComponent(tag)}`}
            className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
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
      href={`/categories/${encodeURIComponent(category)}`}
      className="inline-flex rounded-md border border-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-900"
    >
      {category}
    </Link>
  );
}

export function PostMetaLine({ post }: { post: PostMeta }) {
  if (!post.category && post.tags.length === 0) return null;
  return (
    <div className="mt-10 flex flex-wrap items-center gap-3">
      {post.category ? <CategoryLink category={post.category} /> : null}
      <TagLinks tags={post.tags} />
    </div>
  );
}
