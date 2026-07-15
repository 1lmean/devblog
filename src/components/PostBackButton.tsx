import Link from "next/link";

export function PostBackButton() {
  return (
    <Link
      href="/posts"
      className="text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
    >
      ← 글 목록
    </Link>
  );
}
