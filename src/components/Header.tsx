import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PAGE_SLUGS } from "@/lib/page-slugs";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileMenuToggle } from "./MobileMenuToggle";
import Image from "next/image";
import logoImg from "./logo.webp";
export async function Header() {
    const t = await getTranslations("nav");

    const navLinks = (
        <ul className="nav-list flex flex-col gap-5 text-base md:flex-row md:items-center md:gap-8 md:text-sm">
            {PAGE_SLUGS.map((slug) => (
                <li key={slug}>
                    <Link
                        href={`/${slug}`}
                        className="font-display uppercase tracking-wide text-ink-soft transition-colors hover:text-ochre"
                    >
                        {t(slug)}
                    </Link>
                </li>
            ))}
        </ul>
    );

    return (
        <header className="site-header z-50 border-b border-line bg-paper/90 backdrop-blur">
            <div className="mx-auto flex items-center justify-between px-6">
                <Link
                    href="/"
                    className="font-display text-xl tracking-[0.15em] text-ink logo"
                >
                    <Image src={logoImg} alt="logo" width={120} height={100} />
                    {/*UTOPIX*/}
                </Link>

                <nav className="nav">{navLinks}</nav>

                <div className="flex items-center gap-6">
                    <div className="hidden md:block">
                        <LanguageSwitch />
                    </div>
                    <MobileMenuToggle>
                        <nav>{navLinks}</nav>
                        <div className="mt-6 border-t border-line pt-4">
                            <LanguageSwitch />
                        </div>
                    </MobileMenuToggle>
                </div>
            </div>
        </header>
    );
}
