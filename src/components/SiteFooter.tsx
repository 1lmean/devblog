import { ArrowUp, ArrowUpRight } from "lucide-react";

const linkClass =
  "inline-flex items-center gap-1 text-accent transition-opacity hover:opacity-60";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="page-shell relative py-14">
        <a
          href="#top"
          aria-label="맨 위로"
          className="absolute right-4 top-6 text-muted transition-colors hover:text-foreground sm:right-6 md:right-8"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
        </a>

        <dl className="grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-6 text-sm leading-6 sm:grid-cols-[7rem_1fr] sm:gap-x-6 sm:pl-[8.5rem]">
          <dt className="text-[11px] uppercase tracking-wide text-muted">Links</dt>
          <dd className="flex flex-col">
            <a
              href="https://github.com/1lmean"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              GitHub
            </a>
            <a href="/rss.xml" className={linkClass}>
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              RSS
            </a>
          </dd>

          <dt className="sr-only">Copyright</dt>
          <dd className="col-start-2 text-muted">
            ©{new Date().getFullYear()} 1lmean
          </dd>
        </dl>
      </div>
    </footer>
  );
}
