import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { formatPostDate } from "@/lib/format-date";
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
    title: project.title,
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

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          프로젝트 목록
        </Link>

        <article className="mt-10">
          <header className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {project.title}
                </h1>
                <p className="mt-3 max-w-3xl leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
              </div>

              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  프로젝트 열기
                </a>
              ) : null}
            </div>

            {project.tech.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    #{tech}
                  </span>
                ))}
              </div>
            ) : null}
          </header>

          {project.images.length > 0 ? (
            <section className="mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                화면 구성
              </h2>
              <ul className="mt-6 space-y-10">
                {project.images.map((image, index) => (
                  <li key={image.src}>
                    <figure>
                      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                        <Image
                          src={image.src}
                          alt={`${project.title} 화면 ${String(index + 1).padStart(2, "0")}`}
                          width={3360}
                          height={1916}
                          loading="lazy"
                          sizes="(min-width: 1024px) 896px, calc(100vw - 48px)"
                          className="h-auto w-full"
                        />
                      </div>
                      <figcaption className="mt-3 flex gap-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        <span className="shrink-0 font-medium text-zinc-400 dark:text-zinc-500">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p>{image.comment}</p>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>

        <section className="mt-14 pb-32">
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              관련 글
            </h2>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {relatedPosts.length}개
            </span>
          </div>

          {relatedPosts.length === 0 ? (
            <p className="mt-8 text-zinc-500 dark:text-zinc-400">
              아직 연결된 글이 없습니다.
            </p>
          ) : (
            <ul className="mt-10 divide-y divide-zinc-200 dark:divide-zinc-800">
              {relatedPosts.map((post) => (
                <li key={post.slug} className="py-6 first:pt-0">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-600"
                  >
                    <h3 className="text-lg font-semibold text-zinc-900 group-hover:underline dark:text-zinc-50">
                      {post.title}
                    </h3>
                    <time
                      dateTime={post.date}
                      className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400"
                    >
                      {formatPostDate(post.date)}
                    </time>
                    {post.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {post.description}
                      </p>
                    ) : null}
                  </Link>
                  {post.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
