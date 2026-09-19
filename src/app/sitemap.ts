import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";
import { HOME_SLUG, PAGE_SLUGS } from "@/lib/page-slugs";

export const dynamic = "force-dynamic";

const BASE_URL = "https://utopix-lozere.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const pages = await prisma.page.findMany({
        where: { slug: { in: [HOME_SLUG, ...PAGE_SLUGS] } },
        select: { slug: true, updatedAt: true },
    });

    return pages.flatMap((page) => {
        const path = page.slug === HOME_SLUG ? "" : `/${page.slug}`;
        const languages = {
            ...Object.fromEntries(
                routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
            ),
            "x-default": `${BASE_URL}/${routing.defaultLocale}${path}`,
        };
        return routing.locales.map((locale) => ({
            url: `${BASE_URL}/${locale}${path}`,
            lastModified: page.updatedAt,
            alternates: { languages },
        }));
    });
}
