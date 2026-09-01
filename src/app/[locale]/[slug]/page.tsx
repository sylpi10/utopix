import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/routing";
import { getPageBySlug } from "@/lib/pages";
import { PAGE_SLUGS } from "@/lib/page-slugs";
import { Slider } from "@/components/Slider";

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
    <article>
      {images.length > 0 && (
        <section className="border-b border-line">
          <Slider images={images} priority />
        </section>
      )}

      <div className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="font-display text-3xl text-ink md:text-4xl">
          {page.title}
        </h1>
        <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-ink-soft">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
