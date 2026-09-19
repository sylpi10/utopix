import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/routing";
import { PAGE_SLUGS } from "@/lib/page-slugs";

export const getPageBySlug = cache(async (slug: string, locale: Locale) => {
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
        content: page.translations[0].content,
        images: page.images,
        metaDescription: page.translations[0].metaDescription ?? null,
        metaKeywords: page.translations[0].metaKeywords ?? null,
    };
});

export async function getSectionCards(locale: Locale) {
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
