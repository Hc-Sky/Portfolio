"use client";

/**
 * Desktop — main desktop view with centralized window manager.
 * Manages window state: open/close, focus/z-index, minimize/restore.
 * Clicking the desktop background closes all windows (like inikaj.com).
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MenuBar from "./MenuBar";
import Dock from "./Dock";
import DesktopIcon from "./DesktopIcon";
import Window from "./Window";
import StickyNote from "./StickyNote";
import { getContactWindow, getDesktopItems, getFinderWindow } from "@/data/desktopItems";
import type { WindowConfig } from "@/data/desktopItems";
import { useLanguage } from "@/context/LanguageContext";

/* ─── Window Manager Types ─── */

export interface WindowState {
    id: string;
    config: WindowConfig;
    isMinimized: boolean;
    /** Stacking order — higher = on top */
    z: number;
    /** Cascade offset (for initial positioning only) */
    cascadeIndex: number;
}

/** Parallax offset from mouse position */
interface ParallaxOffset {
    x: number;
    y: number;
}

const WINDOW_OFFSETS: Array<{ x: number; y: number }> = [
    { x: -260, y: 20 },
    { x: 0, y: 28 },
    { x: 260, y: 20 },
    { x: -220, y: 110 },
    { x: 40, y: 118 },
    { x: 280, y: 100 },
];

function getWindowInitialOffset(index: number) {
    const base = WINDOW_OFFSETS[index % WINDOW_OFFSETS.length];
    const wave = Math.floor(index / WINDOW_OFFSETS.length);

    return {
        x: base.x + wave * 24,
        y: base.y + wave * 20,
    };
}

export default function Desktop() {
    /* ─── State ─── */
    const [windows, setWindows] = useState<Record<string, WindowState>>({});
    const [topZ, setTopZ] = useState(100);
    const [parallax, setParallax] = useState<ParallaxOffset>({ x: 0, y: 0 });
    const { language } = useLanguage();

    const desktopItems = getDesktopItems(language);

    useEffect(() => {
        setWindows((prev) => {
            const items = getDesktopItems(language);
            const next: Record<string, WindowState> = {};

            Object.values(prev).forEach((state) => {
                let config = state.config;
                if (state.id === "contact") {
                    config = getContactWindow(language);
                } else if (state.id === "finder") {
                    config = getFinderWindow(language);
                } else {
                    const item = items.find((i) => i.id === state.id);
                    if (item) config = item.window;
                }

                next[state.id] = { ...state, config };
            });

            return next;
        });
    }, [language]);

    /** Ref for drag constraint bounds (the desktop container) */
    const constraintsRef = useRef<HTMLDivElement>(null);

    /* ─── Mouse Parallax Effect ─── */
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const nx = (e.clientX / innerWidth - 0.5) * 2;
            const ny = (e.clientY / innerHeight - 0.5) * 2;
            setParallax({ x: nx * 8, y: ny * 6 });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    /* ─── Window Manager Actions ─── */

    /** Open a window (or focus if already open, or restore if minimized) */
    const openWindow = useCallback(
        (windowId: string) => {
            setWindows((prev) => {
                const existing = prev[windowId];

                // Already open — focus it (and restore if minimized)
                if (existing) {
                    const newZ = topZ + 1;
                    setTopZ(newZ);
                    return {
                        ...prev,
                        [windowId]: {
                            ...existing,
                            z: newZ,
                            isMinimized: false,
                        },
                    };
                }

                // Find config
                let config: WindowConfig | null = null;
                const item = getDesktopItems(language).find((i) => i.id === windowId);
                if (item) config = item.window;
                else if (windowId === "contact") config = getContactWindow(language);
                else if (windowId === "finder") config = getFinderWindow(language);
                if (!config) return prev;

                const count = Object.keys(prev).length;
                const newZ = topZ + 1;
                setTopZ(newZ);

                return {
                    ...prev,
                    [windowId]: {
                        id: windowId,
                        config,
                        isMinimized: false,
                        z: newZ,
                        cascadeIndex: count,
                    },
                };
            });
        },
        [topZ, language],
    );

    /** Close a window — remove from state */
    const closeWindow = useCallback((windowId: string) => {
        setWindows((prev) => {
            const next = { ...prev };
            delete next[windowId];
            return next;
        });
    }, []);

    /** Close all open windows — triggered by desktop background click */
    const closeAllWindows = useCallback(() => {
        setWindows({});
    }, []);

    /** Focus a window — bring to front */
    const focusWindow = useCallback(
        (windowId: string) => {
            setWindows((prev) => {
                const existing = prev[windowId];
                if (!existing) return prev;
                const newZ = topZ + 1;
                setTopZ(newZ);
                return {
                    ...prev,
                    [windowId]: { ...existing, z: newZ },
                };
            });
        },
        [topZ],
    );

    /** Minimize a window — hide but keep in state */
    const minimizeWindow = useCallback((windowId: string) => {
        setWindows((prev) => {
            const existing = prev[windowId];
            if (!existing) return prev;
            return {
                ...prev,
                [windowId]: { ...existing, isMinimized: true },
            };
        });
    }, []);

    /** Restore a minimized window — show and focus */
    const restoreWindow = useCallback(
        (windowId: string) => {
            setWindows((prev) => {
                const existing = prev[windowId];
                if (!existing) return prev;
                const newZ = topZ + 1;
                setTopZ(newZ);
                return {
                    ...prev,
                    [windowId]: {
                        ...existing,
                        isMinimized: false,
                        z: newZ,
                    },
                };
            });
        },
        [topZ],
    );

    /* ─── Derived State ─── */
    const windowList = Object.values(windows);
    const visibleWindows = windowList.filter((w) => !w.isMinimized);
    const maxZ = windowList.reduce((max, w) => Math.max(max, w.z), -1);

    // IDs for dock integration
    const openWindowIds = windowList.map((w) => w.id);
    const minimizedWindowIds = windowList
        .filter((w) => w.isMinimized)
        .map((w) => w.id);

    const [heroHover, setHeroHover] = useState<{ x: number; y: number } | null>(null);

    return (
        <div
            ref={constraintsRef}
            className="relative w-screen h-screen overflow-hidden bg-desktop select-none"
            /* Click desktop background → close all windows (like inikaj.com)
               Use onMouseDown (not onClick) to avoid drag-end click events
               bubbling up and closing windows after a drag release. */
            onMouseDown={closeAllWindows}
        >
            {/* Grid background with subtle parallax */}
            <div
                className="absolute inset-0 grid-bg transition-transform duration-700 ease-out"
                style={{
                    transform: `translate(${parallax.x * 0.5}px, ${parallax.y * 0.5}px)`,
                }}
                aria-hidden="true"
            />

            {/* Subtle radial ambient glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 40%, rgba(100,160,255,0.06) 0%, transparent 70%)",
                }}
                aria-hidden="true"
            />

            {/* Menu bar — stop propagation so clicking it doesn't close windows */}
            <div onMouseDown={(e) => e.stopPropagation()}>
                <MenuBar onOpenWindow={openWindow} />
            </div>

            {/* Sticky Note — stop propagation */}
            <div onMouseDown={(e) => e.stopPropagation()}>
                <StickyNote />
            </div>

            {/* Hero text with parallax */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                    className="absolute inset-0 flex flex-col items-center justify-center z-0
          transition-transform duration-700 ease-out"
                style={{
                    transform: `translate(${parallax.x}px, ${parallax.y}px)`,
                }}
            >
                <div
                    className="pointer-events-auto flex flex-col items-center justify-center"
                    onMouseMove={(event) => setHeroHover({ x: event.clientX, y: event.clientY })}
                    onMouseLeave={() => setHeroHover(null)}
                >
                    <p className="text-xl font-light text-white/30 tracking-[0.25em] lowercase mb-3">
                        <HoverLetters
                            text= {"welcome to my"}
                            maxScale={1.35}
                            radius={70}
                            baseOpacity={0.45}
                            maxOpacity={1}
                            weightMax={700}
                            hoverPoint={heroHover}
                        />
                    </p>
                    <h1
                        className="text-8xl md:text-[120px] leading-none select-none"
                        style={{
                            fontFamily:
                                "var(--font-playfair), 'Playfair Display', Georgia, serif",
                            fontStyle: "italic",
                            color: "rgba(255,255,255,0.06)",
                        }}
                    >
                        <HoverLetters text="portfolio." hoverPoint={heroHover} />
                    </h1>
                </div>
            </motion.div>

            {/* Desktop icons — stop propagation so clicking icons doesn't close windows */}
            {desktopItems.map((item, index) => (
                <div key={item.id} onMouseDown={(e) => e.stopPropagation()}>
                    <DesktopIcon
                        id={item.id}
                        label={item.label}
                        type={item.type}
                        position={item.position}
                        index={index}
                        onClick={() => {
                            if (item.type !== "trash") openWindow(item.id);
                        }}
                    />
                </div>
            ))}

            {/* Open windows */}
            <AnimatePresence>
                {visibleWindows.map((w) => {
                    const initialOffset = getWindowInitialOffset(w.cascadeIndex);

                    return (
                    <Window
                        key={w.id}
                        windowId={w.id}
                        config={w.config}
                        onClose={() => closeWindow(w.id)}
                        onFocus={() => focusWindow(w.id)}
                        onMinimize={() => minimizeWindow(w.id)}
                        onOpenWindow={openWindow}
                        zIndex={w.z}
                        isFocused={w.z === maxZ && windowList.length > 0}
                        initialOffset={initialOffset}
                        constraintsRef={constraintsRef}
                    />
                    );
                })}
            </AnimatePresence>

            {/* Dock — stop propagation */}
            <div onMouseDown={(e) => e.stopPropagation()}>
                <Dock
                    onOpenWindow={openWindow}
                    onRestoreWindow={restoreWindow}
                    openWindowIds={openWindowIds}
                    minimizedWindowIds={minimizedWindowIds}
                />
            </div>
        </div>
    );
}

function HoverLetters({
    text,
    maxScale = 1.22,
    radius = 90,
    baseOpacity = 0.6,
    maxOpacity = 1,
    weightMax = 700,
    hoverPoint = null,
}: {
    text: string;
    maxScale?: number;
    radius?: number;
    baseOpacity?: number;
    maxOpacity?: number;
    weightMax?: number;
    hoverPoint?: { x: number; y: number } | null;
}) {
    const containerRef = useRef<HTMLSpanElement | null>(null);
    const charRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const rafRef = useRef<number | null>(null);
    const [scales, setScales] = useState<number[]>(() => text.split("").map(() => 1));

    useEffect(() => {
        setScales(text.split("").map(() => 1));
        charRefs.current = [];
    }, [text]);

    const handleMove = (clientX: number, clientY: number) => {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
            const localRadius = radius;
            const localMaxScale = maxScale;
            const nextScales = charRefs.current.map((el) => {
                if (!el) return 1;
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const dx = clientX - centerX;
                const dy = clientY - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const t = Math.max(0, 1 - distance / localRadius);
                return 1 + t * (localMaxScale - 1);
            });
            setScales(nextScales);
        });
    };

    useEffect(() => {
        if (hoverPoint === null) {
            setScales(text.split("").map(() => 1));
            return;
        }
        handleMove(hoverPoint.x, hoverPoint.y);
    }, [hoverPoint, text]);

    return (
        <span ref={containerRef} className="inline-block">
            {text.split("").map((char, index) => {
                const isSpace = char === " ";
                const scale = scales[index] ?? 1;
                const intensity = Math.min(
                    Math.max((scale - 1) / Math.max(maxScale - 1, 0.001), 0),
                    1,
                );
                const opacity = baseOpacity + intensity * (maxOpacity - baseOpacity);
                const weight = 400 + Math.round(intensity * (weightMax - 400));

                return (
                    <span
                        key={`${char}-${index}`}
                        ref={(node) => {
                            charRefs.current[index] = node;
                        }}
                        className="inline-block transition-transform duration-150 ease-out will-change-transform"
                        style={{
                            transform: `scale(${scale})`,
                            width: isSpace ? "0.32em" : undefined,
                            color: `rgba(255,255,255,${opacity})`,
                            fontWeight: weight,
                        }}
                        aria-hidden={isSpace}
                    >
                        {isSpace ? "\u00A0" : char}
                    </span>
                );
            })}
        </span>
    );
}
