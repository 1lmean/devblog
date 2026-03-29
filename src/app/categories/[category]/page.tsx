import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate } from "@/lib/format-date";
import { getAllCategories, getPostsByCategory } from "@/lib/posts";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { category: raw } = await props.params;
  const category = decodeURIComponent(raw);
  const posts = getPostsByCategory(category);
  if (posts.length === 0) return { title: "카테고리" };
  return {
    title: category,
    description: `“${category}” 카테고리 글 ${posts.length}개`,
  };
}

export default async function CategoryPage(props: Props) {
  const { category: raw } = await props.params;
  const category = decodeURIComponent(raw);
  const posts = getPostsByCategory(category);
  if (posts.length === 0) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/categories" className="hover:text-zinc-800 dark:hover:text-zinc-200">
            ← 모든 카테고리
          </Link>
        </p>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {category}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{posts.length}개의 글</p>
        <ul className="mt-10 divide-y divide-zinc-200 dark:divide-zinc-800">
          {posts.map((post) => (
            <li key={post.slug} className="py-6 first:pt-0">
              <Link
                href={`/posts/${post.slug}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-600"
              >
                <h2 className="text-lg font-semibold text-zinc-900 group-hover:underline dark:text-zinc-50">
                  {post.title}
                </h2>
                <time
                  dateTime={post.date}
                  className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400"
                >
                  {formatPostDate(post.date)}
                </time>
                {post.description ? (
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {post.description}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
