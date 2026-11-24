/**
 * /about 페이지 데이터. 원본은 이력서(2026-11)이며, 공개 사이트라 아래 원칙을 지킨다.
 * - 회사명·제품명은 쓰지 않는다 (company에는 업종 설명만)
 * - 실명·연락처는 쓰지 않는다
 * relatedTags에 적은 태그가 붙은 글은 해당 경력 아래 "Related posts"로 자동 연결된다.
 */

export type Highlight = { title: string; detail: string };

export type Role = {
  title: string;
  period: string;
  summary: string;
  highlights: Highlight[];
  stack?: string[];
};

export type Experience = {
  period: string;
  company: string;
  roles: Role[];
  relatedTags?: string[];
};

export type SkillGroup = { label: string; items: string[] };

export const intro =
  "AI 모델을 시스템에 연결하고, 처리 성능과 기능을 개선해 온 개발자입니다.\n영상 인식 파이프라인에서 관제 화면까지 다뤘고, 지금은 AI 성능 검증과 품질 개선을 맡고 있습니다.";

export const experiences: Experience[] = [
  {
    period: "2026.08 — 재직 중",
    company: "B2G SaaS 스타트업",
    roles: [
      {
        title: "AI Evaluation Engineer",
        period: "2026.08 —",
        summary: "공공조달 견적 SaaS의 AI 성능 검증과 품질 개선",
        highlights: [
          { title: "견적 요청 분류기 비교 검증", detail: "정확도 84.4% → 95.8%" },
          { title: "재현 가능한 성능 검증 자동화 도구", detail: "AI 성능지표 5종 목표 충족" },
          { title: "품목 매핑 데이터 커버리지 개선", detail: "51.4% → 87.0%" },
        ],
      },
    ],
    relatedTags: ["평가지표", "통계", "재현성"],
  },
  {
    period: "2020.04 — 2025.09",
    company: "AI 비전 솔루션 기업",
    roles: [
      {
        title: "Frontend Engineer",
        period: "2024.03 — 2025.08",
        summary: "레이더·CCTV·AI 분석 결과를 지도에 표출하는 실시간 관제 웹앱",
        highlights: [
          { title: "장시간 실행 메모리 누수 해결", detail: "3.2GB → 1GB 미만" },
          { title: "고빈도 SSE 이벤트 렌더링 최적화", detail: "초당 50~100건" },
        ],
      },
      {
        title: "AI Vision Engineer",
        period: "2020.04 — 2024.03",
        summary: "공항 이상행동 탐지 R&D — 탐지·추적·포즈·행동 인식 파이프라인",
        highlights: [
          { title: "다채널 처리 구조 재설계", detail: "8채널 7~9fps → 9채널 18fps" },
          { title: "NPU 추론 경로 구현", detail: "추론 시간 26% 단축, 제3자 평가 F1 95.3%" },
          { title: "행동 인식 개선", detail: "돌진 인식 정확도 92.9% → 97.1%" },
        ],
      },
    ],
    relatedTags: ["Vision", "CV"],
  },
];

export const sideProjects = [
  {
    period: "2026.06 —",
    title: "한문철피티 (hmcpt)",
    href: "/projects/hmcpt",
    summary: "교통사고 판례 검색 기반 RAG 서비스 — 데이터 수집부터 배포까지 단독 개발",
  },
];

export const skills: SkillGroup[] = [
  { label: "AI", items: ["Python", "PyTorch", "TensorFlow", "Hugging Face", "scikit-learn", "LLM · RAG"] },
  { label: "Web", items: ["TypeScript", "React", "Next.js", "CesiumJS", "Tailwind CSS"] },
  { label: "Tools", items: ["FastAPI", "Docker", "Git", "Playwright", "Vercel"] },
];

export type EducationItem = {
  period: string;
  title: string;
  /** 이 태그가 붙은 글을 항목 아래 Related posts로 연결 */
  relatedTags?: string[];
};

export const education: EducationItem[] = [
  { period: "2025.10 — 2025.12", title: "항해플러스 프론트엔드 7기", relatedTags: ["JS"] },
  { period: "2024.09", title: "ADsP — 한국데이터산업진흥원" },
  { period: "2021.08", title: "동덕여자대학교 컴퓨터학과 졸업" },
  { period: "2019.11", title: "정보처리기사 — 한국산업인력공단" },
];

export const contacts = [{ label: "GitHub", href: "https://github.com/1lmean" }];
