export type Project = {
  title: string;
  description: string;
  tech: string[];
  url?: string;
  github?: string;
};

export const projects: Project[] = [
  // 프로젝트를 여기에 추가하세요
  // {
  //   title: "프로젝트 이름",
  //   description: "프로젝트 설명",
  //   tech: ["Next.js", "TypeScript"],
  //   url: "https://example.com",
  //   github: "https://github.com/username/repo",
  // },
];

export function getAllTechs(): string[] {
  const set = new Set<string>();
  for (const p of projects) {
    for (const t of p.tech) set.add(t);
  }
  return Array.from(set).sort();
}
