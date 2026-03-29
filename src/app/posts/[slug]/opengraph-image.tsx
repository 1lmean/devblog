import { ImageResponse } from "next/og";
import { formatPostDate } from "@/lib/format-date";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export const alt = "";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fafafa",
            fontSize: 48,
            fontWeight: 600,
            color: "#71717a",
            fontFamily: 'system-ui, "Apple SD Gothic Neo", sans-serif',
          }}
        >
          글을 찾을 수 없음
        </div>
      ),
      { ...size },
    );
  }

  const dateLine = formatPostDate(post.date);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fafafa",
          padding: 72,
          fontFamily: 'system-ui, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {post.category ? (
            <div style={{ fontSize: 22, color: "#71717a", fontWeight: 600 }}>{post.category}</div>
          ) : null}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#18181b",
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
            }}
          >
            {post.title}
          </div>
          {post.description ? (
            <div style={{ fontSize: 24, color: "#52525b", lineHeight: 1.45 }}>{post.description}</div>
          ) : null}
        </div>
        <div style={{ fontSize: 22, color: "#a1a1aa" }}>{dateLine}</div>
      </div>
    ),
    { ...size },
  );
}
