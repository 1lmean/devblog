import Link from "next/link";
import { TagLinks } from "@/components/TagLinks";
import { formatPostDate } from "@/lib/format-date";
import type { PostMeta } from "@/lib/posts";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <li className="w-[13.75rem] shrink-0 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
      <Link
        href={`/posts/${post.slug}`}
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-600"
      >
        <h3 className="mt-1 truncate text-base font-semibold text-zinc-900 group-hover:underline dark:text-zinc-50">
          {post.title}
        </h3>
        <time
          dateTime={post.date}
          className="block truncate text-xs text-zinc-400 dark:text-zinc-500"
        >
          {formatPostDate(post.date)}
        </time>
        {post.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
            {post.description}
          </p>
        ) : null}
      </Link>
      <TagLinks tags={post.tags} className="mt-2 overflow-hidden" />
    </li>
  );
}
