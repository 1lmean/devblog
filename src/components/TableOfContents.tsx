"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";

export function TableOfContents({ items, showTitle = true }: { items: TocItem[]; showTitle?: boolean }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 0 },
    );

    for (const { id } of items) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const baseLevel = Math.min(...items.map((item) => item.level));

  return (
    <nav aria-label="목차">
      {showTitle ? (
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.12em] text-muted">Contents</p>
      ) : null}
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - baseLevel) * 12}px` }}
          >
            <a
              href={`#${item.id}`}
              className={[
                "block text-sm leading-snug transition-colors",
                item.level === baseLevel ? "" : "text-[13px]",
                activeId === item.id
                  ? "text-foreground"
                  : "text-muted hover:text-foreground",
              ].join(" ")}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
