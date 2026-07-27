"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
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
      if (next.has(tech)) {
        next.delete(tech);
      } else {
        next.add(tech);
      }
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
              <ProjectCard
                key={project.title}
                project={project}
                onTechClick={toggleTech}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
