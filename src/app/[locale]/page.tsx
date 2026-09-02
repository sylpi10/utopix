import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getPageBySlug, getSectionCards } from "@/lib/pages";
import { HOME_SLUG } from "@/lib/page-slugs";
import { Slider } from "@/components/Slider";
import { RoughCircleFrame } from "@/components/RoughCircleFrame";

export const dynamic = "force-dynamic";

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const t = await getTranslations();
    const [home, cards] = await Promise.all([
        getPageBySlug(HOME_SLUG, locale),
        getSectionCards(locale),
    ]);

    const heroImages =
        home?.images.map((img) => ({
            id: img.id,
            url: img.url,
            alt: (locale === "fr" ? img.altFr : img.altEn) ?? "",
        })) ?? [];

    const paragraphs = (home?.content ?? "")
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);

    return (
        <div className="home-page">
            <section className="main-section relative">
                {heroImages.length > 0 ? (
                    <Slider images={heroImages} priority />
                ) : (
                    <div className="aspect-[4/3] w-full bg-paper-dim md:aspect-[16/9]" />
                )}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-ink/25 px-6 text-center">
                    <h1 className="font-display text-4xl tracking-[0.2em] text-paper md:text-6xl">
                        UTOPIX
                    </h1>
                    <p className="mt-4 max-w-md text-sm text-paper/90 md:text-base">
                        {t("common.locationLine")}
                    </p>
                </div>
            </section>

            <div className="mx-auto max-w-3xl px-6 py-4">
                <p className="rounded-md border border-ochre/30 bg-ochre/10 px-4 py-3 text-center text-sm text-ochre-dark">
                    {t("home.notice")}
                </p>
            </div>

            {paragraphs.length > 0 && (
                <section className="mx-auto max-w-2xl px-6 py-12">
                    {home?.title && (
                        <h2 className="font-display text-2xl text-ink">
                            {home.title}
                        </h2>
                    )}
                    <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-ink-soft">
                        {paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                </section>
            )}

            <section className="mx-auto max-w-6xl px-6 py-12">
                <div className="flex flex-wrap justify-center gap-x-10 gap-y-12">
                    {cards.map((card) =>
                        card.cover ? (
                            <Link
                                key={card.slug}
                                href={`/${card.slug}`}
                                className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
                            >
                                <RoughCircleFrame
                                    src={card.cover.url}
                                    alt={
                                        (locale === "fr"
                                            ? card.cover.altFr
                                            : card.cover.altEn) ?? card.title
                                    }
                                    size={168}
                                />
                                <p className="mt-3 font-display text-xl text-ink">
                                    {card.title}
                                </p>
                            </Link>
                        ) : (
                            <Link
                                key={card.slug}
                                href={`/${card.slug}`}
                                className="group flex flex-col items-center text-center"
                            >
                                <div
                                    className="flex items-center justify-center rounded-full border-2 border-dashed border-line text-ink-soft"
                                    style={{ width: 168, height: 168 }}
                                >
                                    {card.title}
                                </div>
                                <p className="mt-3 font-display text-xl text-ink">
                                    {card.title}
                                </p>
                            </Link>
                        ),
                    )}
                </div>
            </section>
        </div>
    );
}
