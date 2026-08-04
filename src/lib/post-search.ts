export type SearchablePost = {
  title: string;
  description?: string;
  searchText?: string;
};

export function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase("ko-KR");
}

export function filterPostsByQuery<T extends SearchablePost>(posts: T[], query: string): T[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return posts;

  return posts.filter((post) => {
    const target = normalizeSearchText(
      [post.title, post.description, post.searchText].filter(Boolean).join(" "),
    );

    return target.includes(normalizedQuery);
  });
}

export function shouldShowTaxonomyFilters(query: string) {
  return normalizeSearchText(query).length === 0;
}

export function markdownToSearchText(markdown: string) {
  return markdown
    .replace(/```[^\n]*\n([\s\S]*?)```/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_\-~|[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
