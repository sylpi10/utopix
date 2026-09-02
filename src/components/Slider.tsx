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
}: {
    images: SliderImage[];
    priority?: boolean;
}) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selected, setSelected] = useState(0);

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
                            className="relative aspect-[4/3] min-w-0 flex-[0_0_100%] md:aspect-[16/9]"
                        >
                            <Image
                                src={img.url}
                                alt={img.alt}
                                fill
                                priority={priority && i === 0}
                                sizes="100vw"
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {images.length > 1 && (
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
            )}
        </div>
    );
}
