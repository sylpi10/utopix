import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PAGE_SLUGS } from "@/lib/page-slugs";

export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-paper-dim">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="font-display text-lg tracking-[0.15em] text-ink">
              UTOPIX
            </p>
            <p className="mt-2 max-w-xs text-sm text-ink-soft">
              {t.rich("common.locationLine", { br: () => <br /> })}
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm md:grid-cols-1">
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
        <p className="mt-10 text-xs text-ink-soft/70">
          © {year} Utopix — {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
