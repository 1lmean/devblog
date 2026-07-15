import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getAllPosts();
  const bio = fs.readFileSync(path.join(process.cwd(), "content/bio.txt"), "utf-8").trim();

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        {/* 소개 */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            1lmean 🍓
          </h1>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-zinc-600 dark:text-zinc-400">
            {bio}
          </p>
        </section>

        {/* 최근 글 */}
        <section className="mb-16">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Recent Posts
          </h1>
          <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
            개발하면서 배우거나 공부한 내용들을 기록합니다. 
          </p>
          {posts.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400">아직 글이 없습니다.</p>
          ) : (
            <ul className="mt-3 flex gap-8 overflow-x-auto">
              {posts.slice(0, 4).map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </ul>
          )}

          {posts.length > 4 ? (
            <Link
              href="/posts"
              className="mt-4 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              모든 글 보기
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </section>

        {/*  주요 프로젝트 */}
        <section className="mb-16">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Featured Projects
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            주요 프로젝트 데모입니다.
          </p>
          <ul className="mt-3 flex gap-8">
            {/* <ProjectCard /> */}
          </ul>
        </section>
      </main>
    </div>
  );
}
