import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const navClass =
  "text-[11px] font-medium uppercase tracking-[0.14em] text-accent transition-opacity hover:opacity-60";

export function SiteHeader() {
  return (
    <header id="top">
      <div className="page-shell grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Link
          href="/"
          aria-label="홈"
          className="justify-self-start text-sm font-medium tracking-tight text-foreground"
        >
          1lmean/
        </Link>

        <nav className="flex items-center gap-5 sm:gap-8">
          <Link href="/posts" className={navClass}>
            Blog
          </Link>
          <Link href="/projects" className={navClass}>
            Projects
          </Link>
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          <a
            href="/rss.xml"
            title="RSS 피드"
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
          >
            RSS
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
