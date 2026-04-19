import { Client, isFullPage, type PageObjectResponse } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

/** Property shapes we read from the Notion data source (names must match the DB). */
type BlogDbProperties = {
  Slug?: { rich_text?: Array<{ plain_text: string }> };
  Title?: { title?: Array<{ plain_text: string }> };
  Date?: { date?: { start: string } | null };
  Description?: { rich_text?: Array<{ plain_text: string }> };
  Tags?: { multi_select?: Array<{ name: string }> };
  Category?: { select?: { name: string } | null };
};

function propsAsBlog(page: PageObjectResponse): BlogDbProperties {
  return page.properties as unknown as BlogDbProperties;
}

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

// ── Notion color → CSS value ───────────────────────────────────────────────
const NOTION_COLORS: Record<string, string> = {
  gray: "#9b9a97", brown: "#64473a", orange: "#d9730d",
  yellow: "#dfab01", green: "#0f7b6c", blue: "#0b6e99",
  purple: "#6940a5", pink: "#ad1a72", red: "#e03e3e",
  gray_background: "#f1f1ef", brown_background: "#f4eeee",
  orange_background: "#fbecdd", yellow_background: "#fbf3db",
  green_background: "#edf3ec", blue_background: "#e7f3f8",
  purple_background: "#f4f0f9", pink_background: "#f9f0f5",
  red_background: "#fde8e8",
};

type RichTextItem = {
  plain_text: string;
  annotations: {
    bold: boolean; italic: boolean; strikethrough: boolean;
    underline: boolean; code: boolean; color: string;
  };
  href?: string | null;
};

function processRichText(richText: RichTextItem[]): string {
  return richText.map((rt) => {
    const { plain_text, annotations, href } = rt;
    const color = annotations.color;
    const hasColor = color !== "default";

    let text = plain_text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");

    if (annotations.code)          text = `<code>${text}</code>`;
    if (annotations.bold)          text = `<strong>${text}</strong>`;
    if (annotations.italic)        text = `<em>${text}</em>`;
    if (annotations.strikethrough) text = `<del>${text}</del>`;
    if (annotations.underline)     text = `<u>${text}</u>`;
    if (href)                      text = `<a href="${href}">${text}</a>`;

    if (hasColor) {
      const style = color.endsWith("_background")
        ? `background-color:${NOTION_COLORS[color] ?? "transparent"}`
        : `color:${NOTION_COLORS[color] ?? "inherit"}`;
      text = `<span style="${style}">${text}</span>`;
    }

    return text;
  }).join("");
}

function needsColorHtml(richText: RichTextItem[], blockColor?: string): boolean {
  if (blockColor && blockColor !== "default") return true;
  return richText.some((rt) => rt.annotations.color !== "default");
}

// Register color-aware transformer for paragraph blocks
n2m.setCustomTransformer("paragraph", async (block: unknown) => {
  const b = block as { paragraph: { rich_text: RichTextItem[]; color: string } };
  const { rich_text, color: blockColor } = b.paragraph ?? {};
  if (!rich_text?.length) return "";
  if (!needsColorHtml(rich_text, blockColor)) return false;

  const content = processRichText(rich_text);

  if (blockColor && blockColor !== "default") {
    const style = blockColor.endsWith("_background")
      ? `background-color:${NOTION_COLORS[blockColor]};padding:0.25em 0.5em;border-radius:4px`
      : `color:${NOTION_COLORS[blockColor]}`;
    return `<p style="${style}">${content}</p>`;
  }

  return `<p>${content}</p>`;
});

/** Notion API v5+ queries collections via data sources, not database_id. */
let primaryDataSourceId: Promise<string> | null = null;

async function getPrimaryDataSourceId(): Promise<string> {
  if (!primaryDataSourceId) {
    primaryDataSourceId = (async () => {
      const db = await notion.databases.retrieve({
        database_id: DATABASE_ID,
      });
      const id = "data_sources" in db ? db.data_sources?.[0]?.id : undefined;
      if (!id) {
        throw new Error(
          "Notion database is missing data_sources; cannot list posts.",
        );
      }
      return id;
    })();
  }
  return primaryDataSourceId;
}

export type PostMeta = {
  title: string;
  date: string;
  description?: string;
  slug: string;
  tags: string[];
  category?: string;
};

export type Post = PostMeta & { content: string };

export async function getAllPosts(): Promise<PostMeta[]> {
  const data_source_id = await getPrimaryDataSourceId();
  const response = await notion.dataSources.query({
    data_source_id,
    result_type: "page",
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Date", direction: "descending" }],
  });

  return response.results.filter(isFullPage).map((page) => {
    const props = propsAsBlog(page);
    return {
      slug: props.Slug?.rich_text?.[0]?.plain_text ?? page.id,
      title: props.Title?.title?.[0]?.plain_text ?? "",
      date: props.Date?.date?.start ?? "",
      description: props.Description?.rich_text?.[0]?.plain_text,
      tags: props.Tags?.multi_select?.map((t) => t.name) ?? [],
      category: props.Category?.select?.name,
    };
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const data_source_id = await getPrimaryDataSourceId();
  const response = await notion.dataSources.query({
    data_source_id,
    result_type: "page",
    filter: { property: "Slug", rich_text: { equals: slug } },
  });

  const page = response.results.find(isFullPage);
  if (!page) return null;

  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const content = n2m.toMarkdownString(mdBlocks).parent;
  const props = propsAsBlog(page);

  return {
    slug,
    title: props.Title?.title?.[0]?.plain_text ?? "",
    date: props.Date?.date?.start ?? "",
    description: props.Description?.rich_text?.[0]?.plain_text,
    tags: props.Tags?.multi_select?.map((t) => t.name) ?? [],
    category: props.Category?.select?.name,
    content,
  };
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const seen = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => seen.add(t)));
  return [...seen].sort((a, b) => a.localeCompare(b, "ko"));
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const seen = new Set<string>();
  posts.forEach((p) => { if (p.category) seen.add(p.category); });
  return [...seen].sort((a, b) => a.localeCompare(b, "ko"));
}

