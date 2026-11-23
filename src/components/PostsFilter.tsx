"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import type { SearchablePostMeta } from "@/lib/posts";
import { PostRow } from "@/components/PostRow";
import { filterPostsByQuery, shouldShowTaxonomyFilters } from "@/lib/post-search";

type Props = {
  categories: string[];
  tags: string[];
  posts: SearchablePostMeta[];
};

export function PostsFilter({ categories, tags, posts }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const countForCategory = (cat: string) =>
    posts.filter((p) => p.category === cat).length;
  const countForTag = (tag: string) =>
    posts.filter((p) => p.tags.includes(tag)).length;

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const filteredByTaxonomy = posts.filter((p) => {
    if (activeCategory && p.category !== activeCategory) return false;
    if (activeTags.size > 0 && !p.tags.some((t) => activeTags.has(t))) return false;
    return true;
  });
  const filtered = filterPostsByQuery(filteredByTaxonomy, searchQuery);
  const hasActiveFilter = Boolean(activeCategory || activeTags.size > 0 || searchQuery.trim());
  const showTaxonomyFilters = shouldShowTaxonomyFilters(searchQuery);

  const sectionTitle = "text-xl font-normal tracking-tight text-foreground";
  const resetButton =
    "text-[10px] font-medium uppercase tracking-[0.12em] text-accent transition-opacity hover:opacity-60";
  const toggleClass = (active: boolean) =>
    [
      "inline-flex items-baseline gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
      active
        ? "border-foreground bg-foreground text-background"
        : "border-line text-foreground hover:border-foreground",
    ].join(" ");

  return (
    <>
      <section className="pt-8 sm:pt-12">
        <h1 className="border-b border-line pb-1 text-6xl font-light leading-none tracking-[-0.05em] text-foreground sm:text-8xl">
          blog
        </h1>
        <div className="relative mt-10">
          <label htmlFor="post-search" className="sr-only">
            검색
          </label>
          <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.5} />
          <input
            id="post-search"
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="제목, 설명, 본문 검색"
            className="h-12 w-full border-b border-line bg-transparent pl-7 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-foreground"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="검색어 지우기"
              title="검색어 지우기"
              className="absolute right-0 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center text-muted transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </section>

      {showTaxonomyFilters && (
        <section className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-[15rem_1fr]">
          <div className="flex items-baseline gap-3 sm:block">
            <h2 className="text-[11px] uppercase tracking-wide text-muted">Category</h2>
            {activeCategory && (
              <button onClick={() => setActiveCategory(null)} className={`${resetButton} sm:mt-1`}>
                Reset
              </button>
            )}
          </div>
          {categories.length === 0 ? (
            <p className="text-sm text-muted">등록된 카테고리가 없습니다.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={toggleClass(activeCategory === cat)}
                >
                  {cat}
                  <span className="font-mono text-[10px] opacity-60">{countForCategory(cat)}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex items-baseline gap-3 sm:block">
            <h2 className="text-[11px] uppercase tracking-wide text-muted">Tags</h2>
            {activeTags.size > 0 && (
              <button onClick={() => setActiveTags(new Set())} className={`${resetButton} sm:mt-1`}>
                Reset
              </button>
            )}
          </div>
          {tags.length === 0 ? (
            <p className="text-sm text-muted">등록된 태그가 없습니다.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button key={tag} onClick={() => toggleTag(tag)} className={toggleClass(activeTags.has(tag))}>
                  #{tag}
                  <span className="font-mono text-[10px] opacity-60">{countForTag(tag)}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="mt-20 pb-16">
        <div className="flex items-baseline gap-3 border-b border-line pb-4">
          <h2 className={sectionTitle}>Posts</h2>
          <span className="font-mono text-xs text-muted">
            ({hasActiveFilter ? filtered.length : posts.length})
          </span>
        </div>
        {filtered.length === 0 ? (
          <p className="py-8 text-sm text-muted">
            {hasActiveFilter ? "조건에 맞는 글이 없습니다." : "아직 글이 없습니다."}
          </p>
        ) : (
          <ul>
            {filtered.map((post) => (
              <PostRow key={post.slug} post={post} onTagClick={toggleTag} activeTags={activeTags} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
