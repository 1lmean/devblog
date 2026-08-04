import assert from "node:assert/strict";
import test from "node:test";
import {
  filterPostsByQuery,
  markdownToSearchText,
  shouldShowTaxonomyFilters,
} from "./post-search.ts";

const posts = [
  {
    slug: "event-loop",
    title: "JavaScript Event Loop",
    description: "Call stack and task queue notes",
    searchText: "microtask queue promise callback rendering",
  },
  {
    slug: "transformer",
    title: "Transformer 훑어보기",
    description: "attention 구조 정리",
    searchText: "encoder decoder self attention positional encoding",
  },
];

test("filters posts by title, description, and body search text", () => {
  assert.deepEqual(
    filterPostsByQuery(posts, "promise").map((post) => post.slug),
    ["event-loop"],
  );
  assert.deepEqual(
    filterPostsByQuery(posts, "attention").map((post) => post.slug),
    ["transformer"],
  );
  assert.deepEqual(
    filterPostsByQuery(posts, "task queue").map((post) => post.slug),
    ["event-loop"],
  );
});

test("returns every post when the query is blank", () => {
  assert.deepEqual(
    filterPostsByQuery(posts, "  ").map((post) => post.slug),
    ["event-loop", "transformer"],
  );
});

test("converts markdown body to searchable plain text", () => {
  assert.equal(
    markdownToSearchText("# 제목\n\n[링크](https://example.com)\n\n```ts\nconst keyword = 'body';\n```"),
    "제목 링크 const keyword = 'body';",
  );
});

test("hides taxonomy filters while a search query is active", () => {
  assert.equal(shouldShowTaxonomyFilters("본문 검색"), false);
  assert.equal(shouldShowTaxonomyFilters("  "), true);
});
