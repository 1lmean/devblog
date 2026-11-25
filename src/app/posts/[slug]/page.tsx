import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostBackButton } from "@/components/PostBackButton";
import { Markdown } from "@/components/Markdown";
import { PostMetaLine } from "@/components/TagLinks";
import { PageHeader } from "@/components/PageLayout";
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
      <div className="page-shell flex-1 pt-6 pb-12">
        <div className="flex gap-16">
          <article className="min-w-0 flex-1">
            <PostBackButton />
            <PageHeader
              size="detail"
              title={post.title}
              subtitle={post.description}
              meta={
                <>
                  {post.category ? <span className="uppercase">{post.category}</span> : null}
                  <time dateTime={post.date}>{formatDotDate(post.date)}</time>
                </>
              }
            >
              <PostMetaLine post={post} />
            </PageHeader>
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
