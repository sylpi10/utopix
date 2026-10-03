import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CONTENT_SLUGS, HOME_SLUG } from "@/lib/page-slugs";
import { PageEditor } from "./PageEditor";

export default async function AdminEditPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const session = await getSession();
    if (!session) redirect("/admin/login");

    const { slug } = await params;
    const validSlugs: string[] = [HOME_SLUG, ...CONTENT_SLUGS];
    if (!validSlugs.includes(slug)) notFound();

    const page = await prisma.page.findUnique({
        where: { slug },
        include: {
            translations: true,
            images: { orderBy: { order: "asc" } },
        },
    });
    if (!page) notFound();

    const fr = page.translations.find((t) => t.locale === "fr") ?? {
        title: "",
        content: "",
        metaDescription: null,
        metaKeywords: null,
    };
    const en = page.translations.find((t) => t.locale === "en") ?? {
        title: "",
        content: "",
        metaDescription: null,
        metaKeywords: null,
    };

    return (
        <PageEditor
            slug={page.slug}
            initialFr={{
                title: fr.title,
                content: fr.content,
                metaDescription: fr.metaDescription ?? "",
                metaKeywords: fr.metaKeywords ?? "",
            }}
            initialEn={{
                title: en.title,
                content: en.content,
                metaDescription: en.metaDescription ?? "",
                metaKeywords: en.metaKeywords ?? "",
            }}
            initialImages={page.images.map((img) => ({
                id: img.id,
                url: img.url,
                altFr: img.altFr ?? "",
                altEn: img.altEn ?? "",
            }))}
        />
    );
}
