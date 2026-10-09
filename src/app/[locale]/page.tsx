import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getCurrentYear, getPageBySlug, getSectionCards } from "@/lib/pages";
import { HOME_SLUG } from "@/lib/page-slugs";
// import { RoughCircleFrame } from "@/components/RoughCircleFrame";
import Image from "next/image";
import type { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const home = await getPageBySlug(HOME_SLUG, locale);
    if (!home) return {};

    const cover = home.images[0];
    const description = home.metaDescription ?? undefined;

    return {
        title: home.title,
        description,
        keywords: home.metaKeywords ?? undefined,
        alternates: {
            canonical: `/${locale}`,
            languages: { fr: "/fr", en: "/en", "x-default": "/fr" },
        },
        openGraph: {
            title: home.title,
            description,
            images: cover
                ? [
                      {
                          url: cover.url,
                          alt:
                              (locale === "fr" ? cover.altFr : cover.altEn) ??
                              home.title,
                      },
                  ]
                : [],
            siteName: "Utopix-Lozere.fr",
            locale: locale === "fr" ? "fr_FR" : "en_US",
            type: "website",
        },
    };
}

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations();
    const [home, cards] = await Promise.all([
        getPageBySlug(HOME_SLUG, locale),
        getSectionCards(locale),
    ]);

    const heroImage = home?.images[0];
    const hero = heroImage && {
        url: heroImage.url,
        alt: (locale === "fr" ? heroImage.altFr : heroImage.altEn) ?? "",
    };

    const contentHtml = home?.contentHtml ?? "";
    const year = await getCurrentYear();

    return (
        <div className="home-page">
            <section className="main-section relative">
                {hero ? (
                    // image unique sans slider avec fetchpriority high
                    <div className="relative h-screen w-full bg-ink/10">
                        <Image
                            src={hero.url}
                            alt={hero.alt}
                            fill
                            preload
                            fetchPriority="high"
                            sizes="100vw"
                            quality={70}
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="aspect-[4/3] w-full bg-paper-dim md:aspect-[16/9]" />
                )}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-ink/25 px-6 text-center">
                    <h1 className="font-display text-4xl tracking-[0.2em] text-paper main-title">
                        UTOPIX
                        <span className="main-tagline">
                            {" "}
                            {/*{t("home.tagline")}*/}
                            {t.rich("home.tagline", {
                                br: () => <br />,
                            })}
                        </span>
                    </h1>
                    <p className="mt-4 max-w-md text-sm text-paper/90 md:text-base main-subtitle">
                        {t.rich("common.locationLine", {
                            br: () => <br />,
                        })}
                    </p>
                </div>
            </section>

            <div className="mx-auto max-w-3xl px-6 py-4 home-presentation">
                <p className="warning px-4 py-3 text-center">
                    {year}: {t("home.notice")}
                </p>
            </div>

            {contentHtml && (
                <section className="mx-auto max-w-2xl px-6 py-12">
                    {home?.title && (
                        <h2 className="font-display text-2xl">{home.title}</h2>
                    )}
                    <div
                        className="mt-6 space-y-5 text-[15px] leading-relaxed text-ink-soft"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                </section>
            )}

            <section className="categories-wrapper mx-auto max-w-6xl px-6 py-12">
                <div className="flex flex-wrap justify-center gap-x-10 gap-y-12">
                    {cards.map((card) =>
                        card.cover ? (
                            <Link
                                key={card.slug}
                                href={`/${card.slug}`}
                                className="group flex flex-col items-center text-center"
                            >
                                <Image
                                    src={card.cover.url}
                                    alt={
                                        (locale === "fr"
                                            ? card.cover.altFr
                                            : card.cover.altEn) ?? ""
                                    }
                                    width={200}
                                    height={200}
                                    quality={65}
                                    className="object-cover category-bubble"
                                />
                                {/*<RoughCircleFrame
                                    src={card.cover.url}
                                    alt={
                                        (locale === "fr"
                                            ? card.cover.altFr
                                            : card.cover.altEn) ?? card.title
                                    }
                                    size={168}
                                />*/}
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
