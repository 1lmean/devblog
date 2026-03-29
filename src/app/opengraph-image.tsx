import { ImageResponse } from "next/og";

export const alt = "블로그";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(145deg, #18181b 0%, #3f3f46 100%)",
          padding: 80,
          fontFamily: 'system-ui, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          블로그
        </div>
        <div style={{ marginTop: 20, fontSize: 26, color: "#a1a1aa" }}>Next.js · Markdown</div>
      </div>
    ),
    { ...size },
  );
}
