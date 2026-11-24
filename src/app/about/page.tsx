import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { contacts, education, experiences, intro, skills } from "@/lib/about";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "About",
  description: "경력, 기술, 학력 소개",
};

const RELATED_LIMIT = 3;

/** 레이아웃: 왼쪽 라벨 2칸(7rem + 7rem) + 본문. 홈의 글 목록 행과 같은 그리드 */
const rowGrid =
  "grid grid-cols-[4.5rem_1fr] gap-x-4 border-b border-line py-8 sm:grid-cols-[7rem_7rem_1fr] sm:gap-x-6";
const label = "text-[11px] leading-6 tracking-wide text-muted";
const sectionTitle = "border-b border-line pb-4 text-xl font-normal tracking-tight text-foreground";

export default async function About() {
  const posts = await getAllPosts();

  return (
    <main className="page-shell flex-1 pb-28">
      <section className="pt-20 sm:pt-28">
        <h1 className="border-b border-line pb-[0.22em] text-[4.5rem] font-light leading-[0.95] tracking-[-0.055em] text-foreground sm:text-[8.5rem] md:text-[10rem]">
          about
        </h1>
        <p className="mt-3 text-2xl font-light tracking-tight text-foreground sm:text-3xl">
          한선민 <span className="text-muted">/ 1lmean</span>
        </p>
      </section>

      <section className="mt-20 sm:mt-28 sm:pl-[17rem]">
        <p className="max-w-2xl whitespace-pre-line break-keep text-base leading-8 text-foreground">
          {intro}
        </p>
      </section>

      {/* 경력 */}
      <section className="mt-24 sm:mt-32">
        <h2 className={sectionTitle}>Experience</h2>
        <ol>
          {experiences.map((exp) => {
            const related = exp.relatedTags?.length
              ? posts
                  .filter((post) => post.tags.some((tag) => exp.relatedTags!.includes(tag)))
                  .slice(0, RELATED_LIMIT)
              : [];

            return (
              <li key={`${exp.company}-${exp.period}`} className={rowGrid}>
                <div className={label}>
                  <span className="block tabular-nums">{exp.period}</span>
                  <span className="block sm:hidden">{exp.company}</span>
                </div>
                <span className={`hidden sm:block ${label}`}>{exp.company}</span>

                <div className="min-w-0">
                  <h3 className="text-base leading-7 text-foreground sm:text-lg">{exp.role}</h3>
                  <p className="mt-1 break-keep text-sm leading-6 text-muted">{exp.summary}</p>

                  <ul className="mt-4 space-y-2 text-sm leading-6 text-foreground">
                    {exp.highlights.map((item) => (
                      <li key={item} className="flex gap-3 break-keep">
                        <span aria-hidden className="text-muted">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {exp.stack?.length ? (
                    <p className="mt-4 text-xs text-muted">{exp.stack.join(" · ")}</p>
                  ) : null}

                  {related.length > 0 ? (
                    <div className="mt-5">
                      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                        Related posts
                      </p>
                      <ul className="mt-1.5 space-y-1">
                        {related.map((post) => (
                          <li key={post.slug}>
                            <Link
                              href={`/posts/${post.slug}`}
                              className="text-sm text-accent transition-opacity hover:opacity-60"
                            >
                              ↘ {post.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* 기술 */}
      <section className="mt-24">
        <h2 className={sectionTitle}>Skills</h2>
        <dl>
          {skills.map((group) => (
            <div key={group.label} className={`${rowGrid} py-6`}>
              <dt className={`${label} sm:col-span-2`}>{group.label}</dt>
              <dd className="text-sm leading-7 text-foreground">{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 학력·자격 */}
      <section className="mt-24">
        <h2 className={sectionTitle}>Education &amp; Certifications</h2>
        <ul>
          {education.map((item) => (
            <li key={item.title} className={`${rowGrid} py-6`}>
              <span className={`${label} tabular-nums sm:col-span-2`}>{item.period}</span>
              <span className="text-sm leading-7 text-foreground">{item.title}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 연락 */}
      <section className="mt-24">
        <h2 className={sectionTitle}>Contact</h2>
        <ul>
          {contacts.map((item) => (
            <li key={item.href} className={`${rowGrid} py-6`}>
              <span className={`${label} sm:col-span-2`}>{item.label}</span>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-accent transition-opacity hover:opacity-60"
              >
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                {item.href.replace(/^https?:\/\//, "")}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
