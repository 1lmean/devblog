"use client";

import type React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { slugify } from "@/lib/toc";

function getHeadingText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(getHeadingText).join("");
  if (children !== null && typeof children === "object" && "props" in children) {
    return getHeadingText((children.props as { children?: React.ReactNode }).children);
  }
  return "";
}

const components: Components = {
  h1: ({ children, ...props }) => (
    <h1
      id={slugify(getHeadingText(children))}
      className="mt-10 text-3xl font-bold tracking-tight text-foreground first:mt-0"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      id={slugify(getHeadingText(children))}
      className="mt-10 text-2xl font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      id={slugify(getHeadingText(children))}
      className="mt-8 text-xl font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h3>
  ),
  p: (props) => (
    <p className="mt-4 leading-7 text-zinc-700 dark:text-zinc-300" {...props} />
  ),
  a: (props) => (
    <a
      className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-400"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="my-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300" {...props} />
  ),
  ol: (props) => (
    <ol className="my-4 list-decimal space-y-2 pl-6 text-zinc-700 dark:text-zinc-300" {...props} />
  ),
  li: (props) => <li className="leading-7" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-4 border-l-4 border-zinc-300 pl-4 italic text-zinc-600 dark:border-zinc-600 dark:text-zinc-400"
      {...props}
    />
  ),
  code: (props) => {
    const { className, children, ...rest } = props;
    const inline = !className;
    if (inline) {
      return (
        <code
          className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
          {...rest}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  },
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-10 border-zinc-200 dark:border-zinc-700" {...props} />,
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border border-zinc-200 bg-zinc-100 px-3 py-2 font-semibold dark:border-zinc-700 dark:bg-zinc-800" {...props} />
  ),
  td: (props) => (
    <td className="border border-zinc-200 px-3 py-2 dark:border-zinc-700" {...props} />
  ),
};

export function Markdown({ content }: { content: string }) {
  return (
    <article className="markdown-content max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: false }]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
