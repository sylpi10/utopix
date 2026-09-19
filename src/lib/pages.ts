import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/routing";
import { PAGE_SLUGS } from "@/lib/page-slugs";
import { renderContentHtml } from "@/lib/sanitize";

export const PAGES_CACHE_TAG = "pages";

// Cached until an admin write calls revalidateTag(PAGES_CACHE_TAG, { expire: 0 }).
export async function getPageBySlug(slug: string, locale: Locale) {
    "use cache";
    cacheTag(PAGES_CACHE_TAG);
    cacheLife("max");

    const page = await prisma.page.findUnique({
        where: { slug },
        include: {
            translations: { where: { locale } },
            images: { orderBy: { order: "asc" } },
        },
    });

    if (!page || page.translations.length === 0) return null;

    return {
        id: page.id,
        slug: page.slug,
        order: page.order,
        title: page.translations[0].title,
        // Sanitized here: DOMPurify reads the current time, which is only
        // allowed inside a `use cache` scope.
        contentHtml: renderContentHtml(page.translations[0].content),
        images: page.images,
        metaDescription: page.translations[0].metaDescription ?? null,
        metaKeywords: page.translations[0].metaKeywords ?? null,
    };
}

export async function getSectionCards(locale: Locale) {
    "use cache";
    cacheTag(PAGES_CACHE_TAG);
    cacheLife("max");

    const pages = await prisma.page.findMany({
        where: { slug: { in: [...PAGE_SLUGS] } },
        orderBy: { order: "asc" },
        include: {
            translations: { where: { locale } },
            images: { orderBy: { order: "asc" }, take: 1 },
        },
    });

    return pages.map((page) => ({
        slug: page.slug,
        title: page.translations[0]?.title ?? page.slug,
        cover: page.images[0] ?? null,
    }));
}

// `new Date()` can't run in the static shell; inside `use cache` it's allowed.
export async function getCurrentYear() {
    "use cache";
    cacheLife("days");
    return new Date().getFullYear();
}
