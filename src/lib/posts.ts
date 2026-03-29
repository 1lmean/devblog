import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostMeta = {
  title: string;
  date: string;
  description?: string;
  slug: string;
  tags: string[];
  category?: string;
};

export type Post = PostMeta & { content: string };

function parseTags(data: Record<string, unknown>): string[] {
  const t = data.tags;
  if (Array.isArray(t)) return t.map((x) => String(x).trim()).filter(Boolean);
  if (typeof t === "string") {
    return t
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function parseCategory(data: Record<string, unknown>): string | undefined {
  const c = data.category;
  if (c == null) return undefined;
  const s = String(c).trim();
  return s || undefined;
}

function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const d = data as Record<string, unknown>;
  const meta: PostMeta = {
    slug,
    title: String(d.title ?? ""),
    date: String(d.date ?? ""),
    tags: parseTags(d),
  };
  if (d.description != null) meta.description = String(d.description);
  const category = parseCategory(d);
  if (category !== undefined) meta.category = category;
  return { ...meta, content };
}

export function getAllPosts(): PostMeta[] {
  const slugs = getPostSlugs();
  const posts: PostMeta[] = [];
  for (const slug of slugs) {
    const p = getPostBySlug(slug);
    if (!p?.title) continue;
    const { content: _, ...meta } = p;
    posts.push(meta);
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllTags(): string[] {
  const seen = new Set<string>();
  for (const p of getAllPosts()) {
    for (const t of p.tags) seen.add(t);
  }
  return [...seen].sort((a, b) => a.localeCompare(b, "ko"));
}

export function getPostsByTag(tag: string): PostMeta[] {
  const needle = tag.trim();
  return getAllPosts().filter((p) => p.tags.some((t) => t === needle));
}

export function getAllCategories(): string[] {
  const seen = new Set<string>();
  for (const p of getAllPosts()) {
    if (p.category) seen.add(p.category);
  }
  return [...seen].sort((a, b) => a.localeCompare(b, "ko"));
}

export function getPostsByCategory(category: string): PostMeta[] {
  const needle = category.trim();
  return getAllPosts().filter((p) => p.category === needle);
}
