import type { Metadata } from "next";
import { Suspense } from "react";
import { Patrick_Hand, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BodyClassSync } from "@/components/BodyClassSync";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "../globals.scss";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const patrickHand = Patrick_Hand({
    subsets: ["latin"],
    variable: "--font-patrick-hand",
    weight: "400",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const HOME_CLASS_SCRIPT = `if(/^\\/(${routing.locales.join("|")})?\\/?$/.test(location.pathname))document.body.classList.add("home-page")`;

export const metadata: Metadata = {
    metadataBase: new URL("https://utopix-lozere.fr"),
    title: "Utopix — habitation-sculpture en Lozère",
    description:
        "Utopix, une habitation-sculpture et ses espaces d'exposition à Sainte-Énimie, sur le Causse de Sauveterre, en Lozère.",
};

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    setRequestLocale(locale);

    return (
        <html lang={locale}>
            <body
                className={`${patrickHand.variable} ${inter.variable} font-sans antialiased`}
                suppressHydrationWarning
            >
                {/* The layout is statically prerendered and shared by all
                    routes, so the home-page class can't be set server-side.
                    This runs before first paint to avoid a header flash;
                    BodyClassSync keeps it in sync on client navigation. */}
                <script
                    dangerouslySetInnerHTML={{ __html: HOME_CLASS_SCRIPT }}
                />
                <NextIntlClientProvider>
                    {GA_ID && (
                        <Suspense fallback={null}>
                            <GoogleAnalytics gaId={GA_ID} />
                        </Suspense>
                    )}
                    <BodyClassSync />
                    <div className="flex min-h-screen flex-col main-container">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
