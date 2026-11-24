import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { PageHeader, Row, SectionHeading, smallCaps } from "@/components/PageLayout";
import { PostRow } from "@/components/PostRow";
import { getAllPosts } from "@/lib/posts";
import { getSiteUrl } from "@/lib/site";
import { getProjectBySlug, projects } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "프로젝트를 찾을 수 없음" };

  const url = `${getSiteUrl()}/projects/${project.slug}`;
  return {
    title: { absolute: `${project.title} · 프로젝트` },
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url,
      images: [project.thumbnail],
    },
    twitter: {
      title: project.title,
      description: project.description,
      images: [project.thumbnail],
    },
  };
}

export default async function ProjectDetailPage(props: Props) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const posts = await getAllPosts();
  const relatedPosts = posts.filter((post) =>
    post.slug.startsWith(`${project.slug}-`),
  );

  const linkClass = `${smallCaps} inline-flex items-center gap-1 text-accent transition-opacity hover:opacity-60`;

  return (
    <div className="flex flex-1 flex-col">
      <main className="page-shell flex-1 pt-6 pb-12">
        <Link href="/projects" className={`${smallCaps} inline-block text-accent transition-opacity hover:opacity-60`}>
          ← Projects
        </Link>

        <article>
          <PageHeader
            size="detail"
            title={project.title}
            subtitle={project.description}
            meta={<span>{project.tech.join(" · ")}</span>}
          >
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {project.url ? (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                  Live
                </a>
              ) : null}
              {project.github ? (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                  GitHub
                </a>
              ) : null}
            </div>
          </PageHeader>

          {project.images.length > 0 ? (
            <section className="mt-20">
              <SectionHeading title="Screens" count={project.images.length} />
              <ul>
                {project.images.map((image, index) => (
                  <Row
                    key={image.src}
                    label={<span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>}
                  >
                    <figure>
                      <div className="overflow-hidden border border-line">
                        <Image
                          src={image.src}
                          alt={`${project.title} 화면 ${String(index + 1).padStart(2, "0")}`}
                          width={3360}
                          height={1916}
                          loading="lazy"
                          sizes="(min-width: 1024px) 800px, calc(100vw - 7rem)"
                          className="h-auto w-full"
                        />
                      </div>
                      <figcaption className="mt-3 break-keep text-sm leading-6 text-muted">
                        {image.comment}
                      </figcaption>
                    </figure>
                  </Row>
                ))}
              </ul>
            </section>
          ) : null}
        </article>

        <section className="mt-20 pb-28">
          <SectionHeading title="Related posts" count={relatedPosts.length} />
          {relatedPosts.length === 0 ? (
            <p className="py-8 text-sm text-muted sm:pl-[17rem]">아직 연결된 글이 없습니다.</p>
          ) : (
            <ul>
              {relatedPosts.map((post) => (
                <PostRow key={post.slug} post={post} />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
