import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { PAGES_CACHE_TAG } from "@/lib/pages";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { slug } = await params;
    const { fr, en } = await request.json();

    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page) {
        return NextResponse.json(
            { error: "Page introuvable" },
            { status: 404 },
        );
    }

    await Promise.all([
        prisma.pageTranslation.upsert({
            where: { pageId_locale: { pageId: page.id, locale: "fr" } },
            update: {
                title: fr.title,
                content: fr.content,
                metaDescription: fr.metaDescription ?? "",
                metaKeywords: fr.metaKeywords ?? "",
            },
            create: {
                pageId: page.id,
                locale: "fr",
                title: fr.title,
                content: fr.content,
            },
        }),
        prisma.pageTranslation.upsert({
            where: { pageId_locale: { pageId: page.id, locale: "en" } },
            update: {
                title: en.title,
                content: en.content,
                metaDescription: en.metaDescription ?? "",
                metaKeywords: en.metaKeywords ?? "",
            },
            create: {
                pageId: page.id,
                locale: "en",
                title: en.title,
                content: en.content,
            },
        }),
    ]);

    revalidateTag(PAGES_CACHE_TAG, { expire: 0 });
    return NextResponse.json({ ok: true });
}
