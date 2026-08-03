export type Project = {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  images: Array<{
    src: string;
    comment: string;
  }>;
  tech: string[];
  url?: string;
  github?: string;
};

export const projects: Project[] = [
  {
    slug: "hmcpt",
    title: "HMCPT",
    description:
      "교통사고 상황을 입력하면 공개 판례 기반 참고 정보를 바탕으로 과실 쟁점과 판단 근거를 정리해 주는 분석 도구입니다.",
    thumbnail: "/images/hmcpt/01.png",
    images: [
      {
        src: "https://raw.githubusercontent.com/1lmean/devblog/main/public/images/hmcpt/01.png",
        comment:
          "분석 시작 전 고지와 동의 흐름을 분리해 서비스의 법적 한계를 먼저 확인하도록 구성했습니다.",
      },
      {
        src: "https://raw.githubusercontent.com/1lmean/devblog/main/public/images/hmcpt/02.png",
        comment:
          "사고 상황 입력 화면은 사용자가 핵심 정황을 빠르게 남길 수 있도록 대화형 분석 흐름에 맞췄습니다.",
      },
      {
        src: "https://raw.githubusercontent.com/1lmean/devblog/main/public/images/hmcpt/03.png",
        comment:
          "분석 결과는 과실 쟁점과 참고 근거를 한 화면에서 비교할 수 있게 정리했습니다.",
      },
      {
        src: "https://raw.githubusercontent.com/1lmean/devblog/main/public/images/hmcpt/04.png",
        comment:
          "이전 분석 기록을 다시 확인할 수 있도록 히스토리 영역을 두어 반복 검토 흐름을 지원합니다.",
      },
    ],
    tech: ["Next.js", "TypeScript", "RAG", "Gemini"],
    url: "https://hmcpt.vercel.app/",
    github: "https://github.com/1lmean/hmcpt",
  },
];

export function getAllTechs(): string[] {
  const set = new Set<string>();
  for (const p of projects) {
    for (const t of p.tech) set.add(t);
  }
  return Array.from(set).sort();
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
