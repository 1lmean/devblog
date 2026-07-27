import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/lib/projects";

type Props = {
  project: Project;
  onTechClick?: (tech: string) => void;
};

export function ProjectCard({ project, onTechClick }: Props) {
  return (
    <li className="py-8 first:pt-0">
      <article className="group">
        <Link
          href={`/projects/${project.slug}`}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-600"
        >
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
            <Image
              src={project.thumbnail}
              alt={`${project.title} 프로젝트 썸네일`}
              fill
              sizes="(min-width: 1024px) 896px, calc(100vw - 48px)"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.015]"
            />
          </div>
        </Link>

        <div className="mt-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <Link
              href={`/projects/${project.slug}`}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-600"
            >
              <h3 className="text-xl font-semibold tracking-tight text-zinc-900 group-hover:underline dark:text-zinc-50">
                {project.title}
              </h3>
            </Link>
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-0 items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{project.url.replace(/^https?:\/\//, "")}</span>
              </a>
            ) : null}
          </div>

          <Link
            href={`/projects/${project.slug}`}
            className="mt-3 block max-w-3xl text-sm leading-6 text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:text-zinc-400 dark:focus-visible:ring-zinc-600"
          >
            {project.description}
          </Link>

          {project.tech.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.map((tech) =>
                onTechClick ? (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => onTechClick(tech)}
                    className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    #{tech}
                  </button>
                ) : (
                  <span
                    key={tech}
                    className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    #{tech}
                  </span>
                ),
              )}
            </div>
          ) : null}
        </div>
      </article>
    </li>
  );
}
