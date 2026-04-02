import type { Metadata } from "next";
import { ProjectsFilter } from "@/components/ProjectsFilter";
import { projects, getAllTechs } from "@/lib/projects";

export const metadata: Metadata = {
  title: "프로젝트",
  description: "직접 만든 프로젝트 목록입니다.",
};

export default function Projects() {
  const techs = getAllTechs();

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <ProjectsFilter projects={projects} techs={techs} />
      </main>
    </div>
  );
}
