import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Anciennes URLs du site Jimdo (domaine utopix-lozere.fr avant la refonte) -> nouvelles pages.
// Sans slash final : Next.js le retire deja par un 308 avant de matcher.
const legacyRedirects = [
  ["/utopix/histoire", "/fr/histoire"],
  ["/utopix/construction", "/fr/construction"],
  ["/utopix/extérieur", "/fr/exterieur"],
  ["/utopix/intérieur", "/fr/interieur"],
  ["/utopix/peintures", "/fr/peintures"],
  ["/utopix/sculptures", "/fr/sculptures"],
  ["/utopix/infos-extras", "/fr/infos"],
  ["/utopix/accès-contact", "/fr/contact"],
  ["/utopix", "/fr"],
  ["/english/history", "/en/histoire"],
  ["/english/construction", "/en/construction"],
  ["/english/exteriors", "/en/exterieur"],
  ["/english/interiors", "/en/interieur"],
  ["/english/paintings", "/en/peintures"],
  ["/english/sculptures", "/en/sculptures"],
  ["/english/infos-extras", "/en/infos"],
  ["/english/accès-contact", "/en/contact"],
  ["/english", "/en"],
].flatMap(([from, to]) => {
  const encoded = encodeURI(from);
  return (encoded === from ? [from] : [from, encoded]).map((source) => ({
    source,
    destination: to,
    permanent: true,
  }));
});

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    // Inline CSS in <head> instead of render-blocking <link> tags.
    inlineCss: true,
  },
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      // Canonical host is the non-www one (see canonical/hreflang/sitemap).
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.utopix-lozere.fr" }],
        destination: "https://utopix-lozere.fr/:path*",
        permanent: true,
      },
      ...legacyRedirects,
    ];
  },
};

export default withNextIntl(nextConfig);
