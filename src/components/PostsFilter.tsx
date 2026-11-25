"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import type { SearchablePostMeta } from "@/lib/posts";
import { PostRow } from "@/components/PostRow";
import { PageHeader, Row, SectionHeading, chipClass, smallCaps } from "@/components/PageLayout";
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

  const resetButton = `${smallCaps} text-accent transition-opacity hover:opacity-60`;
  const filterLabel = (title: string, onReset: (() => void) | null) => (
    <span className="flex flex-col items-start gap-1">
      <span className="uppercase">{title}</span>
      {onReset ? (
        <button type="button" onClick={onReset} className={resetButton}>
          Reset
        </button>
      ) : null}
    </span>
  );

  return (
    <>
      <PageHeader title="blog" subtitle="개발하면서 배우거나 공부한 내용을 기록합니다." />

      <div className="mt-12">
        <Row as="div" label={<span className="uppercase">Search</span>} dense>
          <div className="relative">
            <label htmlFor="post-search" className="sr-only">
              검색
            </label>
            <Search
              className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              strokeWidth={1.5}
            />
            <input
              id="post-search"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="제목, 설명, 본문 검색"
              className="h-8 w-full bg-transparent pl-7 pr-9 text-sm text-foreground outline-none placeholder:text-muted"
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
        </Row>

        {showTaxonomyFilters && (
          <>
            <Row
              as="div"
              dense
              label={filterLabel("Category", activeCategory ? () => setActiveCategory(null) : null)}
            >
              {categories.length === 0 ? (
                <p className="text-sm text-muted">등록된 카테고리가 없습니다.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                      className={chipClass(activeCategory === cat)}
                    >
                      {cat}
                      <span className="text-[10px] tabular-nums opacity-60">{countForCategory(cat)}</span>
                    </button>
                  ))}
                </div>
              )}
            </Row>

            <Row
              as="div"
              dense
              label={filterLabel("Tags", activeTags.size > 0 ? () => setActiveTags(new Set()) : null)}
            >
              {tags.length === 0 ? (
                <p className="text-sm text-muted">등록된 태그가 없습니다.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button key={tag} onClick={() => toggleTag(tag)} className={chipClass(activeTags.has(tag))}>
                      #{tag}
                      <span className="text-[10px] tabular-nums opacity-60">{countForTag(tag)}</span>
                    </button>
                  ))}
                </div>
              )}
            </Row>
          </>
        )}
      </div>

      <section className="mt-20 pb-16">
        <SectionHeading title="Posts" count={hasActiveFilter ? filtered.length : posts.length} />
        {filtered.length === 0 ? (
          <p className="py-8 text-sm text-muted sm:pl-[17rem]">
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
