import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostBackButton } from "@/components/PostBackButton";
import { Markdown } from "@/components/Markdown";
import Link from "next/link";
import { TableOfContents } from "@/components/TableOfContents";
import { formatDotDate } from "@/lib/format-date";
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

type FullPost = NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>;

function TagList({ post }: { post: FullPost }) {
  if (post.tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
      {post.tags.map((tag) => (
        <li key={tag}>
          <Link href="/posts" className="transition-colors hover:text-foreground">
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function PostPage(props: Props) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const toc = extractToc(post.content);

  return (
    <div className="flex flex-1 flex-col">
      <div className="page-shell flex-1 pt-6 pb-40">
        {/* 가운데 읽기 단 + 오른쪽 목차 (lg 이상) */}
        <div className="lg:grid lg:grid-cols-[1fr_minmax(0,42rem)_1fr] lg:gap-x-12">
          <div aria-hidden className="hidden lg:block" />

          <article className="min-w-0">
            <PostBackButton />
            <header className="mt-14 border-b border-line pb-10 sm:mt-20">
              <div className="flex gap-4 text-[11px] tabular-nums tracking-wide text-muted">
                {post.category ? <span className="uppercase">{post.category}</span> : null}
                <time dateTime={post.date}>{formatDotDate(post.date)}</time>
              </div>
              <h1 className="mt-4 break-keep text-[1.75rem] font-normal leading-[1.3] tracking-[-0.02em] text-foreground sm:text-4xl">
                {post.title}
              </h1>
              {post.description ? (
                <p className="mt-4 break-keep text-[15px] leading-7 text-muted">{post.description}</p>
              ) : null}
              <div className="mt-5">
                <TagList post={post} />
              </div>
            </header>

            {toc.length > 0 ? (
              <details className="group mt-8 border-b border-line pb-4 lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                  Contents
                  <span aria-hidden className="transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-4">
                  <TableOfContents items={toc} showTitle={false} />
                </div>
              </details>
            ) : null}

            <div className="pt-12">
              <Markdown content={post.content} />
            </div>
          </article>

          {toc.length > 0 ? (
            <aside className="hidden lg:block">
              <div className="sticky top-24 mt-[11.5rem]">
                <TableOfContents items={toc} />
              </div>
            </aside>
          ) : (
            <div aria-hidden className="hidden lg:block" />
          )}
        </div>
      </div>
    </div>
  );
}
