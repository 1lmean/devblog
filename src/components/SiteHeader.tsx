import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavButton } from "@/components/NavButton";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-6">
        <nav className="flex items-center gap-2 text-sm">
          <NavButton href="/" className="h-9 w-9" aria-label="홈">
            <Sparkles className="h-4 w-4" />
          </NavButton>
          <NavButton href="/posts" className="h-9 px-3">
            블로그
          </NavButton>
          {/* <NavButton href="/tags" className="h-9 px-3">
            태그
          </NavButton>
          <NavButton href="/categories" className="h-9 px-3">
            카테고리
          </NavButton> */}
          <NavButton href="/projects" className="h-9 px-3">
            프로젝트
          </NavButton>
        </nav>
        <nav className="flex items-center gap-2 text-sm">
          <NavButton as="a" href="/rss.xml" className="h-9 px-3" title="RSS 피드">
            RSS
          </NavButton>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
