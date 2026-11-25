import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Row, smallCaps } from "@/components/PageLayout";
import type { Project } from "@/lib/projects";

type Props = {
  project: Project;
  index: number;
  onTechClick?: (tech: string) => void;
  activeTechs?: Set<string>;
  /** 홈처럼 짧게 보여줄 때 썸네일을 숨긴다 */
  compact?: boolean;
};

const externalLink = `${smallCaps} inline-flex items-center gap-1 text-accent transition-opacity hover:opacity-60`;

/** 프로젝트 한 줄. 글 목록(PostRow)과 같은 3단 그리드를 쓴다. */
export function ProjectCard({ project, index, onTechClick, activeTechs, compact = false }: Props) {
  return (
    <Row
      label={<span className="block tabular-nums">{String(index + 1).padStart(2, "0")}</span>}
      meta={<span className="block">{project.tech.slice(0, 2).join(" · ")}</span>}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group block focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
      >
        <h3 className="text-base leading-7 text-foreground sm:text-lg">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
            {project.title}
          </span>
        </h3>
        <p className="mt-1 break-keep text-sm leading-6 text-muted">{project.description}</p>
      </Link>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <Link href={`/projects/${project.slug}`} className={externalLink}>
          Details
        </Link>
        {project.url ? (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className={externalLink}>
            <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
            Live
          </a>
        ) : null}
        {project.github ? (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className={externalLink}>
            <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
            GitHub
          </a>
        ) : null}
      </div>

      {project.tech.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
          {project.tech.map((tech) => (
            <li key={tech}>
              {onTechClick ? (
                <button
                  type="button"
                  onClick={() => onTechClick(tech)}
                  className={activeTechs?.has(tech) ? "text-accent" : "transition-colors hover:text-foreground"}
                >
                  #{tech}
                </button>
              ) : (
                <span>#{tech}</span>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {!compact ? (
        <Link
          href={`/projects/${project.slug}`}
          className="mt-5 block max-w-xl overflow-hidden border border-line"
          tabIndex={-1}
          aria-hidden
        >
          <Image
            src={project.thumbnail}
            alt=""
            width={1680}
            height={958}
            sizes="(min-width: 640px) 576px, calc(100vw - 7rem)"
            className="h-auto w-full"
          />
        </Link>
      ) : null}
    </Row>
  );
}
