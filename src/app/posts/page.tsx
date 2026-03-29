import Link from "next/link";
import { TagLinks } from "@/components/TagLinks";
import { formatPostDate } from "@/lib/format-date";
import { getAllPosts } from "@/lib/posts";

export default async function Posts() {
  const posts = await getAllPosts();

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          글 목록
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Notion으로 작성한 글 목록입니다.
        </p>
        <ul className="mt-10 divide-y divide-zinc-200 dark:divide-zinc-800">
          {posts.map((post) => (
            <li key={post.slug} className="py-6 first:pt-0">
              <div>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-600"
                >
                  <h2 className="text-lg font-semibold text-zinc-900 group-hover:underline dark:text-zinc-50">
                    {post.title}
                  </h2>
                  <time
                    dateTime={post.date}
                    className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400"
                  >
                    {formatPostDate(post.date)}
                  </time>
                  {post.description ? (
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {post.description}
                    </p>
                  ) : null}
                </Link>
                <TagLinks tags={post.tags} className="mt-3" />
              </div>
            </li>
          ))}
        </ul>
        {posts.length === 0 ? (
          <p className="mt-8 text-zinc-500 dark:text-zinc-400">
            아직 글이 없습니다. <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">content/posts</code>에{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">.md</code> 파일을 추가해 보세요.
          </p>
        ) : null}
      </main>
    </div>
  );
}
