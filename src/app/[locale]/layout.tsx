import type { Metadata } from "next";
import { Patrick_Hand, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BodyClassSync } from "@/components/BodyClassSync";
import "../globals.scss";

const patrickHand = Patrick_Hand({
    subsets: ["latin"],
    variable: "--font-patrick-hand",
    weight: "400",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
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

    return (
        <html lang={locale}>
            <body
                className={`${patrickHand.variable} ${inter.variable} font-sans antialiased`}
            >
                <NextIntlClientProvider>
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
