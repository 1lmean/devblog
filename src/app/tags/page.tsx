import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "태그",
  description: "글에 달린 태그 목록",
};

export default function TagsIndexPage() {
  const tags = getAllTags();
  const posts = getAllPosts();
  const countFor = (tag: string) => posts.filter((p) => p.tags.includes(tag)).length;

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">태그</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">태그를 눌러 관련 글만 모아 볼 수 있습니다.</p>
        {tags.length === 0 ? (
          <p className="mt-8 text-zinc-500 dark:text-zinc-400">등록된 태그가 없습니다.</p>
        ) : (
          <ul className="mt-10 space-y-3">
            {tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">#{tag}</span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{countFor(tag)}개</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
