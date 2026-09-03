"use client";

import { useEffect, useId, useRef } from "react";
import rough from "roughjs";
import Image from "next/image";

export function RoughCircleFrame({
    src,
    alt,
    size = 240,
    color = "#5f6b52",
}: {
    src: string;
    alt: string;
    size?: number;
    color?: string;
}) {
    const svgRef = useRef<SVGSVGElement>(null);
    const uid = useId();

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;
        svg.innerHTML = "";

        const rc = rough.svg(svg);
        const seed = Math.abs(
            [...uid].reduce((acc, ch) => acc + ch.charCodeAt(0), 0),
        );
        const margin = size * 0.045;
        const diameter = size - margin * 2;

        const node = rc.circle(size / 2, size / 2, diameter, {
            stroke: color,
            strokeWidth: 3.5,
            roughness: 2.2,
            bowing: 3,
            seed,
            fill: "none",
        });
        svg.appendChild(node);
    }, [size, color, uid]);

    return (
        <div
            className="relative shrink-0"
            style={{ width: size, height: size }}
        >
            <div
                className="absolute overflow-hidden rounded-full"
                style={{ inset: size * 0.1 }}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={`${size}px`}
                    className="object-cover"
                />
            </div>
            <svg
                ref={svgRef}
                viewBox={`0 0 ${size} ${size}`}
                width={size}
                height={size}
                className="pointer-events-none absolute inset-0"
            />
        </div>
    );
}
