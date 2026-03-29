import { getAllPosts } from "@/lib/posts";
import { getSiteUrl } from "@/lib/site";
import { escapeXml } from "@/lib/xml";

export async function GET() {
  const siteUrl = getSiteUrl();
  const posts = await getAllPosts();
  const items = posts
    .map((post) => {
      const url = `${siteUrl}/posts/${post.slug}`;
      const pubDate = new Date(post.date);
      const pub = Number.isNaN(pubDate.getTime())
        ? new Date().toUTCString()
        : pubDate.toUTCString();
      const title = escapeXml(post.title);
      const link = escapeXml(url);
      const desc = post.description ? `<description>${escapeXml(post.description)}</description>` : "";
      const categories = post.category
        ? `\n      <category>${escapeXml(post.category)}</category>`
        : "";
      const tagsXml = post.tags.map((t) => `\n      <category domain="tag">${escapeXml(t)}</category>`).join("");
      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pub}</pubDate>${categories}${tagsXml}
      ${desc}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml("블로그")}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml("Next.js로 만든 개인 블로그")}</description>
    <language>ko-KR</language>
    <atom:link href="${escapeXml(`${siteUrl}/rss.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
