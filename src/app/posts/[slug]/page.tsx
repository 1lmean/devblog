import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { PostMetaLine } from "@/components/TagLinks";
import { TableOfContents } from "@/components/TableOfContents";
import { formatPostDate } from "@/lib/format-date";
import { getSiteUrl } from "@/lib/site";
import { extractToc } from "@/lib/toc";
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

  const tocItems = extractToc(post.content);

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <div className="flex gap-16">
          <article className="min-w-0 flex-1">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              <Link href="/" className="hover:text-zinc-800 dark:hover:text-zinc-200">
                ← 목록
              </Link>
            </p>
            <header className="mt-15 border-b border-zinc-200 pb-8 dark:border-zinc-800">
              <time
                dateTime={post.date}
                className="block text-sm text-zinc-500 dark:text-zinc-400"
              >
                {formatPostDate(post.date)}
              </time>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {post.title}
              </h1>
              {post.description ? (
                <p className="mt-2 text-m text-zinc-600 dark:text-zinc-400">{post.description}</p>
              ) : null}
              <PostMetaLine post={post} />
            </header>
            <div className="pt-10">
              <Markdown content={post.content} />
            </div>
          </article>

          {tocItems.length > 0 && (
            <aside className="hidden xl:block w-56 shrink-0">
              <div className="sticky top-24">
                <TableOfContents items={tocItems} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
