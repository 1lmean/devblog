"use client";

import { useState } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatPostDate } from "@/lib/format-date";

type Props = {
  categories: string[];
  tags: string[];
  posts: PostMeta[];
};

export function PostsFilter({ categories, tags, posts }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  const countForCategory = (cat: string) =>
    posts.filter((p) => p.category === cat).length;
  const countForTag = (tag: string) =>
    posts.filter((p) => p.tags.includes(tag)).length;

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  };

  const filtered = posts.filter((p) => {
    if (activeCategory && p.category !== activeCategory) return false;
    if (activeTags.size > 0 && !p.tags.some((t) => activeTags.has(t))) return false;
    return true;
  });

  return (
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

      <section className="mb-12">
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            글 목록
          </h2>
          {(activeCategory || activeTags.size > 0) && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {filtered.length}개
            </span>
          )}
        </div>
        {filtered.length === 0 ? (
          <p className="mt-8 text-zinc-500 dark:text-zinc-400">
            {activeCategory || activeTags.size > 0
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
