"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/lib/projects";

type Props = {
  projects: Project[];
  techs: string[];
};

export function ProjectsFilter({ projects, techs }: Props) {
  const [activeTechs, setActiveTechs] = useState<Set<string>>(new Set());

  const countForTech = (tech: string) =>
    projects.filter((p) => p.tech.includes(tech)).length;

  const toggleTech = (tech: string) => {
    setActiveTechs((prev) => {
      const next = new Set(prev);
      next.has(tech) ? next.delete(tech) : next.add(tech);
      return next;
    });
  };

  const filtered = projects.filter((p) => {
    if (activeTechs.size > 0 && !p.tech.some((t) => activeTechs.has(t))) return false;
    return true;
  });

  return (
    <>
      <section className="mb-16">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            기술 스택
          </h2>
          {activeTechs.size > 0 && (
            <button
              onClick={() => setActiveTechs(new Set())}
              className="text-xs text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              초기화
            </button>
          )}
        </div>
        {techs.length === 0 ? (
          <p className="mt-6 text-zinc-500 dark:text-zinc-400">등록된 기술 스택이 없습니다.</p>
        ) : (
          <div className="mt-6 flex flex-wrap gap-2">
            {techs.map((tech) => (
              <button
                key={tech}
                onClick={() => toggleTech(tech)}
                className={[
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  activeTechs.has(tech)
                    ? "bg-zinc-800 text-zinc-50 dark:bg-zinc-200 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
                ].join(" ")}
              >
                {tech}
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {countForTech(tech)}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            프로젝트 목록
          </h2>
          {activeTechs.size > 0 && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {filtered.length}개
            </span>
          )}
        </div>
        {filtered.length === 0 ? (
          <p className="mt-8 text-zinc-500 dark:text-zinc-400">
            {activeTechs.size > 0
              ? "조건에 맞는 프로젝트가 없습니다."
              : "아직 프로젝트가 없습니다."}
          </p>
        ) : (
          <ul className="mt-10 divide-y divide-zinc-200 dark:divide-zinc-800">
            {filtered.map((project) => (
              <li key={project.title} className="py-6 first:pt-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {project.description}
                    </p>
                    {project.tech.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tech.map((t) => (
                          <button
                            key={t}
                            onClick={() => toggleTech(t)}
                            className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
                      >
                        {/* <Github className="h-3.5 w-3.5" /> */}
                        GitHub
                      </a>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
