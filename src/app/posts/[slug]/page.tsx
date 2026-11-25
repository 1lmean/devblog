import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostBackButton } from "@/components/PostBackButton";
import { Markdown } from "@/components/Markdown";
import Link from "next/link";
import { labelText } from "@/components/PageLayout";
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

/* TEMP: 상세 레이아웃 비교용 — ?layout=b 로 B안 확인. 결정 후 한쪽만 남긴다 */
type FullPost = NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>;
type Toc = ReturnType<typeof extractToc>;

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

/** A안: 목록과 같은 3단 그리드. 왼쪽 라벨 칸에 메타·목차, 오른쪽 본문 칸에 제목·본문 */
function LayoutA({ post, toc }: { post: FullPost; toc: Toc }) {
  return (
    <div className="page-shell flex-1 pt-6 pb-40">
      <PostBackButton />
      <header className="mt-14 grid grid-cols-[4.5rem_1fr] gap-x-4 border-b border-line pb-10 sm:mt-20 sm:grid-cols-[7rem_7rem_1fr] sm:gap-x-6">
        <div className={labelText}>
          <span className="block uppercase">{post.category ?? "Note"}</span>
          <time dateTime={post.date} className="block tabular-nums sm:hidden">
            {formatDotDate(post.date)}
          </time>
        </div>
        <time dateTime={post.date} className={`hidden tabular-nums sm:block ${labelText}`}>
          {formatDotDate(post.date)}
        </time>
        <div className="min-w-0 max-w-[42rem]">
          <h1 className="break-keep text-[1.75rem] font-normal leading-[1.3] tracking-[-0.02em] text-foreground sm:text-4xl">
            {post.title}
          </h1>
          {post.description ? (
            <p className="mt-4 break-keep text-[15px] leading-7 text-muted">{post.description}</p>
          ) : null}
          <div className="mt-5">
            <TagList post={post} />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-x-6 pt-12 sm:grid-cols-[15.5rem_1fr]">
        <aside className="hidden sm:block">
          {toc.length > 0 ? (
            <div className="sticky top-24 pr-4">
              <TableOfContents items={toc} />
            </div>
          ) : null}
        </aside>
        <div className="min-w-0 max-w-[42rem]">
          <Markdown content={post.content} />
        </div>
      </div>
    </div>
  );
}

/** B안: 가운데 좁은 단에 차례로 쌓는 읽기 전용 레이아웃 */
function LayoutB({ post, toc }: { post: FullPost; toc: Toc }) {
  return (
    <div className="page-shell flex-1 pt-6 pb-40">
      <div className="mx-auto max-w-[42rem]">
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
        <div className="pt-12">
          <Markdown content={post.content} />
        </div>
      </div>
      {toc.length > 0 ? (
        <aside className="fixed right-8 top-28 hidden w-52 2xl:block">
          <TableOfContents items={toc} />
        </aside>
      ) : null}
    </div>
  );
}

export default async function PostPage(props: Props & { searchParams: Promise<{ layout?: string }> }) {
  const { slug } = await props.params;
  const { layout } = await props.searchParams;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const toc = extractToc(post.content);

  return (
    <div className="flex flex-1 flex-col">
      {layout === "b" ? <LayoutB post={post} toc={toc} /> : <LayoutA post={post} toc={toc} />}
    </div>
  );
}
