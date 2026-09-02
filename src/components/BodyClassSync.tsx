"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

// Toggles a `home-page` class on <body> so global CSS (globals.scss) can
// target the home page specifically, e.g. `body.home-page .site-header { ... }`.
export function BodyClassSync() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.toggle("home-page", pathname === "/");
  }, [pathname]);

  return null;
}
