import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/routing";
import { getPageBySlug } from "@/lib/pages";
import { PAGE_SLUGS } from "@/lib/page-slugs";
import { Slider } from "@/components/Slider";
import Image from "next/image";
import { renderContentHtml } from "@/lib/sanitize";
import { ContactForm } from "@/components/ContactForm";

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

    const isContactPage = slug === "contact";
    const isInfosPage = slug === "infos";
    const singleImage = images.length === 1;
    const oneImage = singleImage ? images[0] : null;
    const contentHtml = renderContentHtml(page.content);

    return (
        <article className={`${page.slug} article`}>
            <div
                className={`sm:mx-4 md:mx-6 lg:mx-10 my-5 px-6 py-14 content-container`}
            >
                <h1 className="font-display text-3xl text-ink md:text-4xl">
                    {page.title}
                </h1>
                <div
                    className={`content-wrapper ${page.slug}-wrapper ${isContactPage ? "flex align-center gap-8" : ""}`}
                >
                    <div
                        className={`mt-8 space-y-5 text-[15px] leading-relaxed text-ink-soft ${page.slug}-content`}
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                    {slug === "contact" && (
                        <div className="iframe-container">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2851.2508842892626!2d3.3938878!3d44.3869714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b30ac82ad9b933%3A0x4d6a584d0c17c0ea!2sUtopix!5e0!3m2!1sfr!2sfr!4v1788440584293!5m2!1sfr!2sfr"
                                width="400"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                            ></iframe>
                        </div>
                    )}
                </div>
            </div>

            {slug === "contact" && (
                <div className="contact-form sm:mx-4 md:mx-6 lg:mx-10 my-5 px-6 ">
                    <div className="form contact">
                        <ContactForm />
                    </div>
                    {oneImage && (
                        <div className="flex justify-center m-auto">
                            <Image
                                src={oneImage.url}
                                alt={oneImage.alt}
                                width={360}
                                height={280}
                            />
                        </div>
                    )}
                </div>
            )}
            {isInfosPage
                ? oneImage && (
                      <div className="flex justify-center flex-2 mx-auto my-5">
                          <Image
                              className="rounded"
                              src={oneImage.url}
                              alt={oneImage.alt}
                              width={200}
                              height={200}
                          />
                      </div>
                  )
                : images.length > 0 && (
                      <section className="border-b border-line">
                          {slug !== "contact" && (
                              <Slider images={images} priority />
                          )}
                      </section>
                  )}
        </article>
    );
}
