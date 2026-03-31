"use client";

import { useRouter } from "next/navigation";

export function PostBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
    >
      ← 목록
    </button>
  );
}
