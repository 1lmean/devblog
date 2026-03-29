import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories, getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "카테고리",
  description: "글 카테고리 목록",
};

export default async function CategoriesIndexPage() {
  const categories = await getAllCategories();
  const posts = await getAllPosts();
  const countFor = (c: string) => posts.filter((p) => p.category === c).length;

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">카테고리</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">카테고리별로 글을 모아 볼 수 있습니다.</p>
        {categories.length === 0 ? (
          <p className="mt-8 text-zinc-500 dark:text-zinc-400">
            등록된 카테고리가 없습니다. 글 front matter에 <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">category</code>를
            추가해 보세요.
          </p>
        ) : (
          <ul className="mt-10 space-y-3">
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/categories/${encodeURIComponent(cat)}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">{cat}</span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{countFor(cat)}개</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
