import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          블로그
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-200">
            글 목록
          </Link>
          <Link href="/tags" className="hover:text-zinc-900 dark:hover:text-zinc-200">
            태그
          </Link>
          <Link href="/categories" className="hover:text-zinc-900 dark:hover:text-zinc-200">
            카테고리
          </Link>
          <a
            href="/rss.xml"
            className="hover:text-zinc-900 dark:hover:text-zinc-200"
            title="RSS 피드"
          >
            RSS
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
