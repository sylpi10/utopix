// Stable, language-independent slugs for every section of the site.
// Order here defines both the seed order and the fallback nav order.
export const PAGE_SLUGS = [
  "histoire",
  "construction",
  "exterieur",
  "interieur",
  "peintures",
  "sculptures",
  "infos",
  "contact",
] as const;

export type PageSlug = (typeof PAGE_SLUGS)[number];

export const HOME_SLUG = "home" as const;
