"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import "./slider.scss";

export type SliderImage = {
    id: number;
    url: string;
    alt: string;
};

export function Slider({
    images,
    priority = false,
    eagerCount = 1,
}: {
    images: SliderImage[];
    priority?: boolean;
    /** Number of leading slides to load eagerly instead of lazily (default: just the first). */
    eagerCount?: number;
}) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selected, setSelected] = useState(0);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback(
        (i: number) => emblaApi?.scrollTo(i),
        [emblaApi],
    );

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
        emblaApi.on("select", onSelect);
        onSelect();
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi]);

    if (images.length === 0) return null;

    return (
        <div className="relative slider">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex slider-container">
                    {images.map((img, i) => (
                        <div
                            key={img.id}
                            className="relative aspect-[4/3] min-w-0 flex-[0_0_100%] bg-ink/10 md:aspect-[16/9]"
                        >
                            <Image
                                src={img.url}
                                alt={img.alt}
                                fill
                                priority={priority && i < eagerCount}
                                sizes="100vw"
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {images.length > 1 && (
                <>
                    <button
                        onClick={scrollPrev}
                        aria-label="Image précédente"
                        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/40 text-paper transition-colors hover:bg-ink/70"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        onClick={scrollNext}
                        aria-label="Image suivante"
                        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/40 text-paper transition-colors hover:bg-ink/70"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>

                    <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                        {images.map((img, i) => (
                            <button
                                key={img.id}
                                onClick={() => scrollTo(i)}
                                aria-label={`Image ${i + 1}`}
                                className={`h-1.5 rounded-full transition-all ${
                                    i === selected
                                        ? "w-6 bg-paper"
                                        : "w-1.5 bg-paper/50"
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
