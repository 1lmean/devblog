import Link from "next/link";

export function PostBackButton() {
  return (
    <Link
      href="/posts"
      className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent transition-opacity hover:opacity-60"
    >
      ← Blog
    </Link>
  );
}
