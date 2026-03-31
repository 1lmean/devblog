import type { Metadata } from "next";
import { PostsFilter } from "@/components/PostsFilter";
import { getAllPosts, getAllTags, getAllCategories } from "@/lib/posts";

export const metadata: Metadata = {
  title: "글 목록",
  description: "Notion으로 작성한 글 목록입니다.",
};

export default async function Posts() {
  const [categories, tags, posts] = await Promise.all([
    getAllCategories(),
    getAllTags(),
    getAllPosts(),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <PostsFilter categories={categories} tags={tags} posts={posts} />
      </main>
    </div>
  );
}
