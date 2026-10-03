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

// Pages reachable only from the footer (not in the main nav or home cards).
export const LEGAL_SLUGS = ["mentions-legales"] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

// Every slug served by the [slug] route.
export const CONTENT_SLUGS = [...PAGE_SLUGS, ...LEGAL_SLUGS] as const;
