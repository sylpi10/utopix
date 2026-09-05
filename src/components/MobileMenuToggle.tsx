"use client";

import { useState } from "react";

export function MobileMenuToggle({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="lg:hidden">
            <button
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label="Menu"
                className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
            >
                <span
                    className={`block h-px w-5 bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
                />
                <span
                    className={`block h-px w-5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`}
                />
                <span
                    className={`block h-px w-5 bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
                />
            </button>
            {open && (
                <div
                    className="mobile-menu fixed inset-x-0 top-[var(--header-h,64px)] z-40 border-t border-line bg-paper px-6 py-6"
                    onClick={() => setOpen(false)}
                >
                    {children}
                </div>
            )}
        </div>
    );
}
