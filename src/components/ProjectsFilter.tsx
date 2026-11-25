"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { PageHeader, Row, SectionHeading, chipClass, smallCaps } from "@/components/PageLayout";
import type { Project } from "@/lib/projects";

type Props = {
  projects: Project[];
  techs: string[];
};

export function ProjectsFilter({ projects, techs }: Props) {
  const [activeTechs, setActiveTechs] = useState<Set<string>>(new Set());

  const countForTech = (tech: string) => projects.filter((p) => p.tech.includes(tech)).length;

  const toggleTech = (tech: string) => {
    setActiveTechs((prev) => {
      const next = new Set(prev);
      if (next.has(tech)) next.delete(tech);
      else next.add(tech);
      return next;
    });
  };

  const filtered = projects.filter(
    (p) => activeTechs.size === 0 || p.tech.some((t) => activeTechs.has(t)),
  );

  return (
    <>
      <PageHeader title="projects" subtitle="직접 만들고 배포한 프로젝트입니다." />

      <div className="mt-12">
        <Row
          as="div"
          dense
          label={
            <span className="flex flex-col items-start gap-1">
              <span className="uppercase">Stack</span>
              {activeTechs.size > 0 ? (
                <button
                  type="button"
                  onClick={() => setActiveTechs(new Set())}
                  className={`${smallCaps} text-accent transition-opacity hover:opacity-60`}
                >
                  Reset
                </button>
              ) : null}
            </span>
          }
        >
          {techs.length === 0 ? (
            <p className="text-sm text-muted">등록된 기술 스택이 없습니다.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {techs.map((tech) => (
                <button key={tech} onClick={() => toggleTech(tech)} className={chipClass(activeTechs.has(tech))}>
                  {tech}
                  <span className="text-[10px] tabular-nums opacity-60">{countForTech(tech)}</span>
                </button>
              ))}
            </div>
          )}
        </Row>
      </div>

      <section className="mt-20 pb-16">
        <SectionHeading title="Projects" count={filtered.length} />
        {filtered.length === 0 ? (
          <p className="py-8 text-sm text-muted sm:pl-[17rem]">
            {activeTechs.size > 0 ? "조건에 맞는 프로젝트가 없습니다." : "아직 프로젝트가 없습니다."}
          </p>
        ) : (
          <ul>
            {filtered.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                onTechClick={toggleTech}
                activeTechs={activeTechs}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
