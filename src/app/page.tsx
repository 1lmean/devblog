import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { PostRow } from "@/components/PostRow";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/PageLayout";
import { getAllPosts } from "@/lib/posts";
import { projects } from "@/lib/projects";

const RECENT_COUNT = 5;

export default async function Home() {
  const posts = await getAllPosts();
  const bio = fs.readFileSync(path.join(process.cwd(), "content/bio.txt"), "utf-8").trim();

  const categoryCounts = Object.entries(
    posts.reduce<Record<string, number>>((acc, post) => {
      if (post.category) acc[post.category] = (acc[post.category] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort(([a], [b]) => a.localeCompare(b, "ko"));

  const indexLinks = [
    { href: "/posts", label: ["All", "Posts"], count: posts.length },
    { href: "/projects", label: ["Featured", "Projects"], count: projects.length },
    { href: "/rss.xml", label: ["RSS", "Feed"], external: true },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <main className="page-shell flex-1 pb-28">
        {/* 히어로 — 대형 라이트 타이틀 + 헤어라인 */}
        <section className="pt-20 sm:pt-28">
          <h1 className="border-b border-line pb-[0.22em] text-[4.5rem] font-light leading-[0.95] tracking-[-0.055em] text-foreground sm:text-[8.5rem] md:text-[10rem]">
            dig in
          </h1>
          <p className="mt-3 text-2xl font-light tracking-tight text-foreground sm:text-3xl">
            the hard way.
          </p>
          <p className="mt-3 text-[11px] leading-5 text-muted">
            Using AI as a tool — never as the point.
          </p>
        </section>

        {/* 소개 — 왼쪽 작은 인덱스, 오른쪽 정렬 바이오 */}
        <section className="mt-24 grid gap-10 sm:mt-32 sm:grid-cols-2">
          <dl className="order-2 grid w-fit grid-cols-[auto_auto] gap-x-6 gap-y-1 tabular-nums text-[11px] leading-5 text-muted sm:order-1 sm:self-end">
            {categoryCounts.map(([category, count]) => (
              <div key={category} className="contents">
                <dt className="uppercase">{category}</dt>
                <dd>{String(count).padStart(2, "0")}</dd>
              </div>
            ))}
            <dt>TOTAL</dt>
            <dd>{String(posts.length).padStart(2, "0")}</dd>
          </dl>
          <p className="order-1 max-w-md whitespace-pre-line break-keep text-sm leading-7 text-foreground sm:order-2 sm:ml-auto sm:text-right">
            {bio}
          </p>
        </section>

        {/* 인덱스 내비 — ↘ 화살표 링크 */}
        <nav className="mt-24 flex flex-wrap gap-x-12 gap-y-8 sm:mt-28 sm:justify-center sm:gap-x-20">
          {indexLinks.map((item) => {
            const className =
              "group flex items-start gap-2 text-xl font-light leading-[1.1] tracking-tight text-foreground sm:text-2xl";
            const content = (
              <>
                {item.external ? (
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                ) : (
                  <ArrowDownRight className="mt-0.5 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" strokeWidth={1.5} />
                )}
                <span>
                  {item.label.map((word) => (
                    <span key={word} className="block">
                      {word}
                    </span>
                  ))}
                  {item.count !== undefined ? (
                    <span className="block text-muted">({item.count})</span>
                  ) : null}
                </span>
              </>
            );
            return item.external ? (
              <a key={item.href} href={item.href} className={className}>
                {content}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className={className}>
                {content}
              </Link>
            );
          })}
        </nav>

        {/* 최근 글 — 뉴스 리스트 */}
        <section className="mt-28 sm:mt-36">
          <SectionHeading
            title="Recent Posts"
            aside="개발하면서 배우거나 공부한 내용들을 기록합니다."
          />

          {posts.length === 0 ? (
            <p className="py-8 text-sm text-muted">아직 글이 없습니다.</p>
          ) : (
            <ul>
              {posts.slice(0, RECENT_COUNT).map((post) => (
                <PostRow key={post.slug} post={post} />
              ))}
            </ul>
          )}

          {posts.length > RECENT_COUNT ? (
            <Link
              href="/posts"
              className="mt-6 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.12em] text-accent transition-opacity hover:opacity-60 sm:ml-[17rem]"
            >
              <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              View all posts
            </Link>
          ) : null}
        </section>

        {/* 주요 프로젝트 — 텍스트 행 */}
        <section className="mt-28">
          <SectionHeading title="Featured Projects" />
          <ul>
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} compact />
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
