/**
 * /about 페이지 데이터.
 * 회사명은 공개하지 않는다 — company에는 업종 설명만 적는다.
 * relatedTags에 적은 태그가 붙은 글은 해당 경력 아래 "Related posts"로 자동 연결된다
 * (Notion 글 태그와 정확히 일치해야 함).
 */

export type Role = {
  title: string;
  duration?: string;
  summary: string;
  highlights: string[];
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
  "AI 비전 엔지니어로 4년 동안 탐지·추적·행동 인식 모델을 만들었고, 같은 회사에서 그 결과를 보여주는 관제 화면을 1.5년 동안 개발했습니다.\n지금은 SaaS 제품의 GS·KOLAS 인증을 맡아 소프트웨어와 모델을 어떻게 평가하고 증명하는지를 다루고 있습니다.";

export const experiences: Experience[] = [
  {
    period: "2026.08 — 재직 중",
    company: "B2G SaaS 스타트업",
    roles: [
      {
        title: "선임 · 기술 PM / 개발",
        summary: "공공조달 SaaS 제품의 인증과 정부지원사업을 맡고 있습니다.",
        highlights: [
          "GS인증 시험 대응 — 시험 문서와 사용자 매뉴얼 작성",
          "KOLAS 인증 평가 지표 체계 설계",
          "직접생산확인 · 수출바우처 수행기관 신청 절차 조사와 진행",
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
        duration: "약 1.5년",
        summary: "AI 비전 파이프라인 결과를 실시간으로 보여주는 모니터링·관제 화면을 개발했습니다.",
        highlights: [
          "React · TypeScript · CesiumJS 기반 실시간 모니터링 시스템 개발, SSE로 이벤트 스트림 처리",
          "장시간 실행 시 Chrome 메모리 누수 원인 추적 — 3.2GB → 1GB 미만으로 감소",
          "관제 시스템 침입 감지 로직 구현 — 속도·방향 벡터 계산, 경계선 교차 판별",
        ],
        stack: ["React", "TypeScript", "Redux", "CesiumJS", "SSE", "TailwindCSS"],
      },
      {
        title: "AI Vision Engineer",
        duration: "약 4년",
        summary: "공항·해양·리테일 분야 영상 분석 솔루션의 탐지·추적·행동 인식 모델을 개발했습니다.",
        highlights: [
          "공항 실시간 이상행동 감지 (국가 R&D, 4년) — 객체 탐지 · 추적 · 포즈 추정 · 행동 인식, Mahalanobis 거리 기반 이상행동 판별",
          "탐지 모델 세대 교체 YOLO v3 → v3-SPP → v4 → v7 → v9",
          "해양 선박 CCTV 안전 분석 (AI 바우처)",
          "불법투기 감지 모델의 NPU 포팅 실험 — 일부 연산 미지원으로 대체 구조를 시도하고 GPU 대비 벤치마크 진행",
          "추론 파이프라인 구조 재설계 — Ray 기반에서 Python Shared Memory + Queue IPC 멀티프로세스로 전환",
        ],
        stack: ["Python", "PyTorch", "YOLO", "DeepSORT", "AlphaPose", "AcT"],
      },
    ],
    relatedTags: ["Vision", "CV", "JS", "React"],
  },
];

export const skills: SkillGroup[] = [
  { label: "Vision / ML", items: ["PyTorch", "YOLO v3–v9", "DeepSORT", "AlphaPose", "Action Recognition", "NPU 포팅", "RAG · LLM"] },
  { label: "Frontend", items: ["React", "TypeScript", "Next.js", "Redux", "CesiumJS", "SSE", "TailwindCSS"] },
  { label: "Tools", items: ["Python", "Git / GitLab", "Playwright"] },
];

export const education = [
  { period: "2024.09", title: "ADsP (데이터분석 준전문가)" },
  { period: "2021.08", title: "동덕여자대학교 컴퓨터학과 졸업" },
  { period: "2019.11", title: "정보처리기사" },
];

export const contacts = [{ label: "GitHub", href: "https://github.com/1lmean" }];
