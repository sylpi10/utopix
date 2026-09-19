import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ["fr", "en"],
    defaultLocale: "fr",
    // evite erreur conflit de hreflang
    alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
