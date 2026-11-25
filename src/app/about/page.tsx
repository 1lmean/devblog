import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader, Row, SectionHeading, smallCaps } from "@/components/PageLayout";
import { contacts, education, experiences, intro, sideProjects, skills } from "@/lib/about";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "About",
  description: "경력, 기술, 학력 소개",
};

const RELATED_LIMIT = 3;

type PostLink = { slug: string; title: string; tags: string[] };

function relatedTo<T extends PostLink>(posts: T[], tags?: string[]): T[] {
  if (!tags?.length) return [];
  return posts.filter((post) => post.tags.some((tag) => tags.includes(tag))).slice(0, RELATED_LIMIT);
}

/** 관련 글 — 데스크톱 1행 3열, 모바일 세로 */
function RelatedPosts({ posts }: { posts: PostLink[] }) {
  if (posts.length === 0) return null;
  return (
    <div className="mt-5">
      <p className={`${smallCaps} text-muted`}>Related posts</p>
      <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug} className="min-w-0">
            <Link
              href={`/posts/${post.slug}`}
              className="flex gap-1.5 text-sm leading-6 text-accent transition-opacity hover:opacity-60"
            >
              <span aria-hidden>↘</span>
              <span className="truncate">{post.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function About() {
  const posts = await getAllPosts();

  return (
    <main className="page-shell flex-1 pb-28">
      <PageHeader title="about" subtitle="Model → Pipeline → Screen" />

      <div className="mt-12">
        <Row as="div" dense label={<span className="uppercase">Profile</span>}>
          <p className="max-w-2xl whitespace-pre-line break-keep text-sm leading-7 text-foreground sm:text-base sm:leading-8">
            {intro}
          </p>
        </Row>
      </div>

      <section className="mt-20">
        <SectionHeading title="Experience" />
        <ol>
          {experiences.map((exp) => {
            const related = relatedTo(posts, exp.relatedTags);

            return (
              <Row
                key={exp.period}
                label={<span className="block tabular-nums">{exp.period}</span>}
                meta={<span className="block break-keep">{exp.company}</span>}
              >
                <div className="space-y-6">
                  {exp.roles.map((role) => (
                    <div key={role.title}>
                      <h3 className="flex flex-wrap items-baseline gap-x-3 text-base leading-7 text-foreground sm:text-lg">
                        {role.title}
                        <span className="text-xs tabular-nums text-muted">{role.period}</span>
                      </h3>
                      <p className="mt-1 break-keep text-sm leading-6 text-muted">{role.summary}</p>
                      <ul className="mt-3 space-y-1 text-sm leading-6">
                        {role.highlights.map((item) => (
                          <li key={item.title} className="flex flex-wrap gap-x-2 break-keep">
                            <span className="text-foreground">{item.title}</span>
                            <span className="tabular-nums text-muted">{item.detail}</span>
                          </li>
                        ))}
                      </ul>
                      {role.stack?.length ? (
                        <p className="mt-3 text-xs text-muted">{role.stack.join(" · ")}</p>
                      ) : null}
                    </div>
                  ))}
                </div>

                <RelatedPosts posts={related} />
              </Row>
            );
          })}
        </ol>
      </section>

      <section className="mt-20">
        <SectionHeading title="Side Project" />
        <ul>
          {sideProjects.map((project) => (
            <Row
              key={project.title}
              label={<span className="block tabular-nums">{project.period}</span>}
              meta={<span className="block">개인 프로젝트</span>}
            >
              <Link
                href={project.href}
                className="text-base leading-7 text-foreground hover:underline hover:decoration-1 hover:underline-offset-4 sm:text-lg"
              >
                {project.title}
              </Link>
              <p className="mt-1 break-keep text-sm leading-6 text-muted">{project.summary}</p>

            </Row>
          ))}
        </ul>
      </section>

      <section className="mt-20">
        <SectionHeading title="Skills" />
        <ul>
          {skills.map((group) => (
            <Row key={group.label} dense label={group.label}>
              <p className="text-sm leading-6 text-foreground">{group.items.join(" · ")}</p>
            </Row>
          ))}
        </ul>
      </section>

      <section className="mt-20">
        <SectionHeading title="Education & Certifications" />
        <ul>
          {education.map((item) => (
            <Row key={item.title} dense label={<span className="tabular-nums">{item.period}</span>}>
              <p className="text-sm leading-6 text-foreground">{item.title}</p>
              <RelatedPosts posts={relatedTo(posts, item.relatedTags)} />
            </Row>
          ))}
        </ul>
      </section>

      <section className="mt-20">
        <SectionHeading title="Contact" />
        <ul>
          {contacts.map((item) => (
            <Row key={item.href} dense label={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-accent transition-opacity hover:opacity-60"
              >
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                {item.href.replace(/^https?:\/\//, "")}
              </a>
            </Row>
          ))}
        </ul>
      </section>
    </main>
  );
}
