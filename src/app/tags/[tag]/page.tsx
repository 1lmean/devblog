import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate } from "@/lib/format-date";
import { getAllTags, getPostsByTag } from "@/lib/posts";

type Props = { params: Promise<{ tag: string }> };

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { tag: raw } = await props.params;
  const tag = decodeURIComponent(raw);
  const posts = getPostsByTag(tag);
  if (posts.length === 0) return { title: "태그" };
  return {
    title: `#${tag}`,
    description: `“${tag}” 태그가 달린 글 ${posts.length}개`,
  };
}

export default async function TagPage(props: Props) {
  const { tag: raw } = await props.params;
  const tag = decodeURIComponent(raw);
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/tags" className="hover:text-zinc-800 dark:hover:text-zinc-200">
            ← 모든 태그
          </Link>
        </p>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          #{tag}
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
