"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { routing } from "@/i18n/routing";

export function LanguageSwitch() {
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="flex items-center gap-1 text-sm tracking-wide">
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-ink-soft/40">/</span>}
          <Link
            href={`/${locale}${rest ? `/${rest}` : ""}`}
            className={
              locale === currentLocale
                ? "font-semibold text-ochre-dark"
                : "text-ink-soft hover:text-ink transition-colors"
            }
          >
            {locale.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
