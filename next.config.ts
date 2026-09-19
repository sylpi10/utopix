import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    // Inline CSS in <head> instead of render-blocking <link> tags.
    inlineCss: true,
  },
  images: {
    remotePatterns: [],
  },
};

export default withNextIntl(nextConfig);
