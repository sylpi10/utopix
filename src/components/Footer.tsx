import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LEGAL_SLUGS, PAGE_SLUGS } from "@/lib/page-slugs";
import { getCurrentYear } from "@/lib/pages";
import logoImg from "./logo-ochre-dark.webp";
import Image from "next/image";

export async function Footer() {
    const t = await getTranslations();
    const year = await getCurrentYear();

    return (
        <footer className="border-t border-line bg-paper-dim">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <div className="flex flex-col gap-8 md:flex-row md:justify-between">
                    <div>
                        <p className="font-display text-lg tracking-[0.15em] text-ink">
                            UTOPIX
                        </p>
                        <p className="mt-2 max-w-xs text-sm text-ink-soft">
                            {t.rich("common.locationLine", {
                                br: () => <br />,
                            })}
                        </p>
                        <Image
                            src={logoImg}
                            alt="logo utopix"
                            width={140}
                            height={60}
                        />
                    </div>
                    <nav className="grid lg:grid-cols-2 gap-x-8 gap-y-2 text-sm md:grid-cols-1">
                        {PAGE_SLUGS.map((slug) => (
                            <Link
                                key={slug}
                                href={`/${slug}`}
                                className="font-display text-ink-soft transition-colors hover:text-ochre"
                            >
                                {t(`nav.${slug}`)}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-10 gap4 text-xs text-ink-soft/70">
                    <span>© {year} </span>
                    <Link target="_blank" href="https://sylvainpillet.com">
                        Syl Pi
                    </Link>{" "}
                    — {t("footer.rights")}
                    {LEGAL_SLUGS.map((slug) => (
                        <span key={slug}>
                            {" · "}
                            <Link
                                href={`/${slug}`}
                                className="transition-colors hover:text-ochre"
                            >
                                {t(`footer.${slug}`)}
                            </Link>
                        </span>
                    ))}
                </div>
            </div>
        </footer>
    );
}
