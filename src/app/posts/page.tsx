import type { Metadata } from "next";
import { PostsFilter } from "@/components/PostsFilter";
import { getSearchablePosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "글 목록",
  description: "Notion으로 작성한 글 목록입니다.",
};

export default async function Posts() {
  const posts = await getSearchablePosts();
  const categories = [...new Set(posts.flatMap((post) => post.category ? [post.category] : []))]
    .sort((a, b) => a.localeCompare(b, "ko"));
  const tags = [...new Set(posts.flatMap((post) => post.tags))]
    .sort((a, b) => a.localeCompare(b, "ko"));

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <PostsFilter categories={categories} tags={tags} posts={posts} />
      </main>
    </div>
  );
}
