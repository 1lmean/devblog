import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostBackButton } from "@/components/PostBackButton";
import { Markdown } from "@/components/Markdown";
import { PostMetaLine } from "@/components/TagLinks";
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

export default async function PostPage(props: Props) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const tocItems = extractToc(post.content);

  return (
    <div className="flex flex-1 flex-col">
      <div className="page-shell flex-1 py-12">
        <div className="flex gap-16">
          <article className="min-w-0 flex-1">
            <PostBackButton />
            <header className="mt-16 sm:mt-24">
              <div className="flex items-baseline gap-4 tabular-nums text-[11px] text-muted">
                {post.category ? <span className="uppercase">{post.category}</span> : null}
                <time dateTime={post.date}>{formatDotDate(post.date)}</time>
              </div>
              <h1 className="mt-4 border-b border-line pb-3 text-4xl font-light leading-[1.15] tracking-[-0.03em] text-foreground sm:text-6xl">
                {post.title}
              </h1>
              {post.description ? (
                <p className="mt-4 text-lg font-light leading-8 text-foreground/80">{post.description}</p>
              ) : null}
              <PostMetaLine post={post} />
            </header>
            <div className="pt-14 pb-40">
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
