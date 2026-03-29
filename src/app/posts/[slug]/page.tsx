import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { PostMetaLine } from "@/components/TagLinks";
import { formatPostDate } from "@/lib/format-date";
import { getSiteUrl } from "@/lib/site";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "글을 찾을 수 없음" };
  const url = `${getSiteUrl()}/posts/${slug}`;
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url,
    },
    twitter: {
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage(props: Props) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <article className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-800 dark:hover:text-zinc-200">
            ← 목록
          </Link>
        </p>
        <header className="mt-6 border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {post.title}
          </h1>
          <time
            dateTime={post.date}
            className="mt-3 block text-sm text-zinc-500 dark:text-zinc-400"
          >
            {formatPostDate(post.date)}
          </time>
          {post.description ? (
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">{post.description}</p>
          ) : null}
          <PostMetaLine post={post} />
        </header>
        <div className="pt-10">
          <Markdown content={post.content} />
        </div>
      </article>
    </div>
  );
}
