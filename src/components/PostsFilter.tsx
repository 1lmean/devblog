"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { SearchablePostMeta } from "@/lib/posts";
import { formatPostDate } from "@/lib/format-date";
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

  return (
    <>
      <section className="mb-12">
        <label
          htmlFor="post-search"
          className="mb-3 block text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          검색
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
          <input
            id="post-search"
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="제목, 설명, 본문 검색"
            className="h-11 w-full rounded-md border border-zinc-200 bg-white px-10 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="검색어 지우기"
              title="검색어 지우기"
              className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>

      {showTaxonomyFilters && (
        <>
          <section className="mb-16">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                카테고리
              </h2>
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory(null)}
                  className="text-xs text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  초기화
                </button>
              )}
            </div>
            {categories.length === 0 ? (
              <p className="mt-6 text-zinc-500 dark:text-zinc-400">등록된 카테고리가 없습니다.</p>
            ) : (
              <div className="mt-6 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={[
                      "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                      activeCategory === cat
                        ? "border-zinc-800 bg-zinc-800 text-zinc-50 dark:border-zinc-200 dark:bg-zinc-200 dark:text-zinc-900"
                        : "border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900",
                    ].join(" ")}
                  >
                    {cat}
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {countForCategory(cat)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="mb-16">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                태그
              </h2>
              {activeTags.size > 0 && (
                <button
                  onClick={() => setActiveTags(new Set())}
                  className="text-xs text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  초기화
                </button>
              )}
            </div>
            {tags.length === 0 ? (
              <p className="mt-6 text-zinc-500 dark:text-zinc-400">등록된 태그가 없습니다.</p>
            ) : (
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                      activeTags.has(tag)
                        ? "bg-zinc-800 text-zinc-50 dark:bg-zinc-200 dark:text-zinc-900"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
                    ].join(" ")}
                  >
                    #{tag}
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {countForTag(tag)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <section className="mb-12">
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            글 목록
          </h2>
          {hasActiveFilter && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {filtered.length}개
            </span>
          )}
        </div>
        {filtered.length === 0 ? (
          <p className="mt-8 text-zinc-500 dark:text-zinc-400">
            {hasActiveFilter
              ? "조건에 맞는 글이 없습니다."
              : "아직 글이 없습니다."}
          </p>
        ) : (
          <ul className="mt-10 divide-y divide-zinc-200 dark:divide-zinc-800">
            {filtered.map((post) => (
              <li key={post.slug} className="py-6 first:pt-0">
                <Link
                  href={`/posts/${post.slug}`}
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-600"
                >
                  <h3 className="text-lg font-semibold text-zinc-900 group-hover:underline dark:text-zinc-50">
                    {post.title}
                  </h3>
                  <time
                    dateTime={post.date}
                    className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400"
                  >
                    {formatPostDate(post.date)}
                  </time>
                  {post.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {post.description}
                    </p>
                  )}
                </Link>
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
