"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface Dot {
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
}

interface WorldMapProps {
    dots?: Dot[];
    lineColor?: string;
}

// Convert lat/lng to SVG x/y coordinates (equirectangular projection)
function project(lat: number, lng: number, width: number, height: number) {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
}

// Build a curved SVG path between two points
function getCurvedPath(
    x1: number,
    y1: number,
    x2: number,
    y2: number
): string {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.3;
    return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

export function WorldMap({ dots = [], lineColor = "#0ea5e9" }: WorldMapProps) {
    const SVG_W = 1000;
    const SVG_H = 500;

    const paths = dots.map((dot) => {
        const s = project(dot.start.lat, dot.start.lng, SVG_W, SVG_H);
        const e = project(dot.end.lat, dot.end.lng, SVG_W, SVG_H);
        return {
            d: getCurvedPath(s.x, s.y, e.x, e.y),
            sx: s.x,
            sy: s.y,
            ex: e.x,
            ey: e.y,
            id: `${dot.start.lat}-${dot.start.lng}-${dot.end.lat}-${dot.end.lng}`,
        };
    });

    return (
        <div className="w-full aspect-[2/1] relative select-none">
            <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {paths.map((p) => (
                        <marker
                            key={`marker-${p.id}`}
                            id={`dot-${p.id}`}
                            viewBox="0 0 10 10"
                            refX="5"
                            refY="5"
                            markerWidth="4"
                            markerHeight="4"
                        >
                            <circle cx="5" cy="5" r="5" fill={lineColor} />
                        </marker>
                    ))}
                    <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={lineColor} stopOpacity="0.15" />
                        <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* World map background dots (simplified grid) */}
                <WorldDots width={SVG_W} height={SVG_H} />

                {/* Animated curved lines */}
                {paths.map((p, i) => (
                    <g key={p.id}>
                        {/* Static dim path */}
                        <path
                            d={p.d}
                            fill="none"
                            stroke={lineColor}
                            strokeWidth={1}
                            strokeOpacity={0.15}
                        />

                        {/* Animated bright path */}
                        <motion.path
                            d={p.d}
                            fill="none"
                            stroke={lineColor}
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{
                                duration: 1.5,
                                delay: i * 0.4,
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatType: "loop",
                                repeatDelay: dots.length * 0.4 + 1,
                            }}
                        />

                        {/* Start dot */}
                        <motion.circle
                            cx={p.sx}
                            cy={p.sy}
                            r={4}
                            fill={lineColor}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.4, 1], opacity: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.4 }}
                        />
                        {/* Start pulse ring */}
                        <motion.circle
                            cx={p.sx}
                            cy={p.sy}
                            r={4}
                            fill="none"
                            stroke={lineColor}
                            strokeWidth={1}
                            initial={{ scale: 1, opacity: 0.8 }}
                            animate={{ scale: 3, opacity: 0 }}
                            transition={{
                                duration: 1.5,
                                delay: i * 0.4,
                                repeat: Infinity,
                                repeatDelay: dots.length * 0.4,
                            }}
                        />

                        {/* End dot */}
                        <motion.circle
                            cx={p.ex}
                            cy={p.ey}
                            r={4}
                            fill={lineColor}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.4, 1], opacity: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.4 + 1.5 }}
                        />
                        {/* End pulse ring */}
                        <motion.circle
                            cx={p.ex}
                            cy={p.ey}
                            r={4}
                            fill="none"
                            stroke={lineColor}
                            strokeWidth={1}
                            initial={{ scale: 1, opacity: 0.8 }}
                            animate={{ scale: 3, opacity: 0 }}
                            transition={{
                                duration: 1.5,
                                delay: i * 0.4 + 1.5,
                                repeat: Infinity,
                                repeatDelay: dots.length * 0.4,
                            }}
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
}

// Renders a simplified dot-grid that mimics a world map silhouette
function WorldDots({ width, height }: { width: number; height: number }) {
    // Approximate lat/lng bounding boxes for land masses (simplified)
    const landRegions = [
        // North America
        { latMin: 15, latMax: 75, lngMin: -168, lngMax: -52 },
        // South America
        { latMin: -56, latMax: 13, lngMin: -82, lngMax: -34 },
        // Europe
        { latMin: 35, latMax: 72, lngMin: -10, lngMax: 40 },
        // Africa
        { latMin: -35, latMax: 38, lngMin: -18, lngMax: 52 },
        // Asia
        { latMin: 5, latMax: 78, lngMin: 25, lngMax: 145 },
        // Australia
        { latMin: -44, latMax: -10, lngMin: 113, lngMax: 154 },
        // Greenland
        { latMin: 59, latMax: 84, lngMin: -57, lngMax: -17 },
    ];

    const dots: { x: number; y: number }[] = [];
    const step = 8;

    for (let lat = -80; lat <= 80; lat += step / 5.5) {
        for (let lng = -180; lng <= 180; lng += step / 2.8) {
            const isLand = landRegions.some(
                (r) =>
                    lat >= r.latMin &&
                    lat <= r.latMax &&
                    lng >= r.lngMin &&
                    lng <= r.lngMax
            );
            if (isLand) {
                const { x, y } = project(lat, lng, width, height);
                dots.push({ x, y });
            }
        }
    }

    return (
        <g>
            {dots.map((d, i) => (
                <circle
                    key={i}
                    cx={d.x}
                    cy={d.y}
                    r={1.2}
                    fill="currentColor"
                    className="text-neutral-400 dark:text-neutral-700"
                    opacity={0.5}
                />
            ))}
        </g>
    );
}
