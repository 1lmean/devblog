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
  "AI 모델을 시스템에 연결하고, 처리 성능과 기능을 개선해 온 개발자입니다.\n4년간 다채널 영상 인식 파이프라인을 개발하며 객체 탐지·추적·행동 인식, 추론 최적화, NPU 기반 엣지 추론 전환을 수행했습니다. 이후 레이더·AI 분석 결과를 실시간 관제 화면에 통합 표출하는 웹앱을 개발해 인식부터 표출까지 전 구간을 다뤘습니다. 현재는 공공조달 견적 서비스의 AI 성능 검증 자동화와 품질 개선을 맡고 있습니다.\n코드와 데이터를 따라 원인을 좁히고, 수정 결과를 테스트와 측정으로 확인하며 일합니다.";

export const experiences: Experience[] = [
  {
    period: "2026.08 — 재직 중",
    company: "B2G SaaS 스타트업",
    roles: [
      {
        title: "AI Evaluation Engineer",
        period: "2026.08 —",
        summary:
          "공공조달 견적 SaaS의 AI 성능 검증과 품질 개선을 맡고 있습니다. 성능 측정 절차를 자동화하고 품목 매핑 실패 원인을 분석해 코드와 데이터를 보완했습니다. GS인증 1등급 획득, KOLAS 공인시험성적서 발급 예정(2026.11).",
        highlights: [
          {
            title: "견적 요청 분류기 개선 및 모델 비교 검증",
            detail:
              "규칙 기반 분류기의 공사·용역 오분류 문제를 같은 789건 기준으로 규칙·LLM·문장 임베딩(로지스틱 회귀) 분류기를 비교해 검증. LLM 분류기 정확도 84.4% → 95.8%, 외부 API 없는 임베딩 분류기 93.8%(건당 5ms)로 정확도·비용·지연 시간 트레이드오프 비교. 공사 공종 정답 기준 재정의와 ko-sroberta 파인튜닝으로 공종 정확도 61.0% → 82.8%.",
          },
          {
            title: "재현 가능한 AI 성능 검증 자동화 도구 개발",
            detail:
              "시스템 호출 → 출력 수집 → 정답 비교·채점 → 판정 보고서 생성을 한 명령으로 실행하는 Python 도구 개발. 시험 파일 해시 검증, 채점 경계값·요청 누락·중복 검사, 95% 신뢰구간 저장 구현. 사전 측정에서 AI 성능지표 5종 모두 목표 충족, 동일한 파일과 절차로 재실행할 수 있는 시험 패키지 구성.",
          },
          {
            title: "품목 매핑 오류 분석 및 데이터 커버리지 개선",
            detail:
              "오답을 분석해 공백·표기 변형에 따른 매핑 실패와 물품 목록 누락을 구분. 정규화 로직 수정과 입력 변형 테스트를 추가하고 공공 API로 누락 데이터 1,777건 보강. 매핑 F1 98.6%를 3회 동일하게 확인, 커버리지 51.4% → 87.0%로 목표 85% 충족.",
          },
        ],
        stack: ["Python", "LLM API", "Sentence Transformers", "ko-sroberta", "scikit-learn"],
      },
    ],
    relatedTags: ["평가지표", "통계", "재현성"],
  },
  {
    period: "2020.04 — 2025.09",
    company: "AI 비전 솔루션 기업",
    roles: [
      {
        title: "Frontend Engineer · AI 관제 서비스",
        period: "2024.03 — 2025.08",
        summary:
          "레이더 신호·CCTV 영상·AI 분석 결과를 지도 화면에 통합 표출하는 공공 관제 웹앱을 개발했습니다. 침입 판정, 고빈도 데이터 렌더링, 장시간 실행 시 메모리 문제 등 관제 화면의 기능·성능 문제를 해결했습니다.",
        highlights: [
          {
            title: "장시간 실행 시 메모리 증가 및 페이지 응답 불가 해결",
            detail:
              "약 12시간 연속 실행 시 메모리가 2.7~3.2GB까지 증가하던 문제를 프로파일링해 Cesium Entity 정리 누락을 확인하고 생명주기 처리 수정. 메모리 점유율 1GB 미만으로 감소, 응답 불가 문제 해결.",
          },
          {
            title: "고빈도 이벤트 처리 및 화면 갱신 최적화",
            detail:
              "SSE로 초당 50~100건 유입되는 레이더·AI 데이터의 상태 업데이트를 배치 처리하고 Throttling으로 갱신 빈도 조절. 데이터 수신과 화면 갱신 주기를 분리해 UI 프리징과 렌더링 지연 개선.",
          },
          {
            title: "객체 이동 정보 기반 침입 판정 및 알림",
            detail:
              "연속 좌표와 타임스탬프로 속력·이동 방향을 계산하고, 이동 경로와 사용자 설정 경계선의 교차 여부를 판정하는 로직 구현. 경계선 통과 객체를 자동 식별해 알림 표시.",
          },
        ],
        stack: ["React", "TypeScript", "Redux", "CesiumJS", "SSE", "TailwindCSS"],
      },
      {
        title: "AI Vision Engineer · 다채널 CCTV 이상행동 분석",
        period: "2020.04 — 2024.03",
        summary:
          "공항 이상행동 탐지 R&D 과제에서 객체 탐지·추적·포즈 추정·행동 인식을 연결하는 영상 분석 시스템을 개발했습니다. 다채널 비동기 처리 구조 개선, 추론 프레임워크 통합, NPU 전환과 제3자 성능 검증을 수행했습니다.",
        highlights: [
          {
            title: "프로세스 간 데이터 전달 구조 개선 및 다채널 처리 최적화",
            detail:
              "Ray 기반 구조를 Shared Memory·Queue 기반 IPC로 재설계하고 멀티프로세스·멀티스레드 비동기 처리로 영상 복사 비용 절감. 8채널 7~9fps → 9채널 18fps, 최대 16채널 동시 입력 지원.",
          },
          {
            title: "하드웨어 제약에 맞춘 NPU 추론 경로 구현",
            detail:
              "NPU 미지원 연산을 CPU 후처리로 분리하고 NPU 2개 파티션 병렬 실행, FastAPI 비동기 추론 서버 구현. 이미지당 추론 12.37ms → 9.12ms(약 26% 단축), 제3자 평가 Total F1 95.3% · 6종 탐지 항목 모두 기준 90% 통과.",
          },
          {
            title: "객체 이동·자세·상호작용 기반 이상행동 판정 로직 설계",
            detail:
              "포즈 모델 비교로 AlphaPose 채택(프레임당 19.6ms, CenterNet 대비 약 44% 단축). 속도·카메라 거리 보정·사람 간 IoU를 결합해 돌진·역방향·쓰러짐·싸움 판정을 실시간 파이프라인에 통합.",
          },
          {
            title: "학습 데이터와 시간 정보 기반 행동 인식 개선",
            detail:
              "스켈레톤 시퀀스 127,920개 구축과 라벨 기준 재정의, AcT 기반 7개 행동 클래스 인식. 돌진 인식 정확도 92.9% → 97.1%, 8종 이상행동 자동 판정 구현.",
          },
          {
            title: "추론 프레임워크 통합 및 모델 교체 구조 개선",
            detail:
              "TensorFlow로 공개된 Action Transformer를 PyTorch로 포팅해 YOLO 탐지·DeepSORT 추적·AcT 행동 인식을 단일 프레임워크로 통합하고, 탐지·추적·행동 인식 모델을 개별 교체·비교할 수 있게 모듈 분리.",
          },
        ],
        stack: ["Python", "PyTorch", "TensorFlow", "YOLO", "DeepSORT", "AlphaPose", "AcT", "FastAPI"],
      },
    ],
    relatedTags: ["Vision", "CV", "JS", "React"],
  },
];

export const sideProjects = [
  {
    period: "2026.06 —",
    title: "한문철피티 (hmcpt) — 판례 검색 기반 AI 웹 서비스",
    href: "/projects/hmcpt",
    summary:
      "교통사고 상황을 입력하면 유사 판례를 검색하고 과실비율 판단 근거를 제시하는 RAG 서비스. 데이터 수집·검색 평가·LLM 연동·웹 개발부터 클라우드 배포까지 단독 수행.",
    highlights: [
      "공개 판례 1,681건 · 32,544청크를 임베딩해 Chroma 벡터DB 구성, FastAPI · Next.js로 API와 웹 구현 후 Cloud Run · Vercel 배포",
      "정답 라벨이 없는 환경에서 판례 간 인용관계를 대리 정답으로 삼아 자동평가 구현 — recall@3 45% · recall@10 69%",
      "경량 LLM 의도 분류와 외부 API 실패 시 규칙 기반 자동 전환, IP 단위 요청 제한 구현 — 관련 테스트 25건 통과",
    ],
  },
];

export const skills: SkillGroup[] = [
  {
    label: "AI / Backend",
    items: [
      "Python", "PyTorch", "TensorFlow", "OpenCV", "Hugging Face", "Sentence Transformers",
      "scikit-learn", "LLM API 분류 · 다중 판정", "임베딩 분류기 파인튜닝", "객체 탐지 · 추적 · 행동 인식",
      "NPU 추론 최적화", "Shared Memory · Queue IPC", "FastAPI", "Chroma 기반 RAG",
    ],
  },
  {
    label: "Web",
    items: ["TypeScript", "JavaScript", "React", "Next.js", "Redux", "CesiumJS", "Chart.js", "Tailwind CSS"],
  },
  {
    label: "Tools",
    items: ["Playwright", "Vitest", "Storybook", "Linux", "CUDA", "Docker", "Git / GitLab", "Cloud Run", "Vercel"],
  },
];

export const education = [
  { period: "2024.09", title: "ADsP — 한국데이터산업진흥원" },
  { period: "2021.08", title: "동덕여자대학교 컴퓨터학과 졸업" },
  { period: "2019.11", title: "정보처리기사 — 한국산업인력공단" },
];

export const contacts = [{ label: "GitHub", href: "https://github.com/1lmean" }];
