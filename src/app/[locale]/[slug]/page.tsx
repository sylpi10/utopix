import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/routing";
import { getPageBySlug } from "@/lib/pages";
import { PAGE_SLUGS } from "@/lib/page-slugs";
import { Slider } from "@/components/Slider";
import { sanitizeHtml } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
    return PAGE_SLUGS.map((slug) => ({ slug }));
}

export default async function SectionPage({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}) {
    const { locale, slug } = await params;

    if (!PAGE_SLUGS.includes(slug as (typeof PAGE_SLUGS)[number])) {
        notFound();
    }

    const page = await getPageBySlug(slug, locale);
    if (!page) notFound();

    const images = page.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: (locale === "fr" ? img.altFr : img.altEn) ?? "",
    }));

    const paragraphs = page.content
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);

    return (
        <article className={`${page.slug} article`}>
            <div className="mx-auto max-w-2xl px-6 py-14">
                <h1 className="font-display text-3xl text-ink md:text-4xl">
                    {page.title}
                </h1>
                <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-ink-soft">
                    {paragraphs.map((div, i) => (
                        <div
                            key={i}
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(div),
                            }}
                        />
                    ))}
                </div>
                {slug === "contact" && (
                    <div>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2851.2508842892626!2d3.3938878!3d44.3869714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b30ac82ad9b933%3A0x4d6a584d0c17c0ea!2sUtopix!5e0!3m2!1sfr!2sfr!4v1788440584293!5m2!1sfr!2sfr"
                            width="600"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                        ></iframe>
                    </div>
                )}
            </div>

            {images.length > 0 && (
                <section className="border-b border-line">
                    <Slider images={images} priority />
                </section>
            )}
        </article>
    );
}
