"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

const FALLBACK_THRESHOLD = 450;

// Toggles a `home-page` class on <body> so global CSS (globals.scss) can
// target the home page specifically, e.g. `body.home-page .site-header { ... }`.
// On the home page only, also toggles a `scrolled` class once the user has
// scrolled past the `.home-presentation` block, e.g. to switch the
// transparent home header to a solid one:
// `body.home-page.scrolled .site-header { background: var(--color-paper); }`
export function BodyClassSync() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    useEffect(() => {
        document.body.classList.toggle("home-page", isHome);
    }, [isHome]);

    useEffect(() => {
        if (!isHome) return;

        // offsetTop forces a layout read, so we measure it once (and on
        // resize) instead of on every scroll event — that's what was
        // causing the stutter.
        let threshold = FALLBACK_THRESHOLD;
        const measure = () => {
            const el = document.querySelector<HTMLElement>(".home-presentation");
            threshold = el ? el.offsetTop : FALLBACK_THRESHOLD;
        };

        let ticking = false;
        let isScrolled = false;
        const update = () => {
            const next = window.scrollY > threshold;
            if (next !== isScrolled) {
                isScrolled = next;
                document.body.classList.toggle("scrolled", isScrolled);
            }
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };

        measure();
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", measure);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", measure);
            document.body.classList.remove("scrolled");
        };
    }, [isHome]);

    return null;
}
