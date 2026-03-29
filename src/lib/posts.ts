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

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.tags.includes(tag.trim()));
}

export async function getPostsByCategory(category: string): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.category === category.trim());
}