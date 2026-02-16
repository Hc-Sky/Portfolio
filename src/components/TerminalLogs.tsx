"use client";

/**
 * TerminalLogs — Typewriter-style terminal narrative display.
 *
 * Characters appear one by one like someone is actually typing.
 * Click anywhere to accelerate the typing speed.
 * Certain date lines are clickable — they open the corresponding app window.
 * Final line: "System status: evolving."
 */

import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Clickable line mappings ─── */

/** Maps terminal line text → desktop item ID for clickable links */
const CLICKABLE_LINES: Record<string, string> = {
    "[2024] HNC Studio.": "hnc-studio",
    "[2025] Nutrika.": "nutrika",
};

/* ─── Log Lines ─── */

const lines: string[] = [
    "> Booting HNC OS...",
    "> Accessing memory archive...",
    "",
    "[2008] First contact with computers.",
    "Opening and rebuilding PCs with my father.",
    "Understanding hardware before software.",
    "",
    "[2013] First HTML experiments.",
    "Recreating websites.",
    "Learning through tutorials.",
    "Trial. Error. Curiosity.",
    "",
    "[2014] Bootloader experimentation.",
    "Linux virtual machines.",
    "Breaking systems to understand them.",
    "",
    "[2015] Exploring macOS installations.",
    "Architecture. Constraints. Compatibility.",
    "",
    "[2016] Blender.",
    "Dream of creating video games.",
    "From 3D models to 3D printing.",
    "",
    "[2018] STI2D — SIN.",
    "Networks. Embedded systems.",
    "Structured technical thinking.",
    "",
    "[2020–2024] BUT Informatique.",
    "System architecture.",
    "Project management.",
    "Real production constraints.",
    "",
    "[Parallel Process] Photography & Video.",
    "Circuit Paul Ricard.",
    "Rallye du Var.",
    "Understanding motion and light.",
    "",
    "[2023] Color grading.",
    "Realizing that light is emotional.",
    "",
    "[2024] HNC Studio.",
    "Creative direction meets development.",
    "",
    "[2025] Nutrika.",
    "Transforming unstructured video into structured data.",
    "System thinking applied.",
    "",
    "[2026] Applying to Ingémédia.",
    "Seeking to explore interaction, narrative systems",
    "and creative technologies further.",
    "",
    "",
    "System status: evolving.",
];

/** Flatten all lines into a single string with newlines, for char-by-char typing */
const fullText = lines.join("\n");

/* ─── Speed constants ─── */
const NORMAL_CHAR_SPEED = 18; // ms per character
const FAST_CHAR_SPEED = 3;    // ms when accelerated
const NEWLINE_PAUSE = 100;    // pause at end of line
const EMPTY_LINE_PAUSE = 180; // pause for blank lines

/* ─── Props ─── */

interface TerminalLogsProps {
    onOpenWindow?: (id: string) => void;
}

/* ─── Component ─── */

export default function TerminalLogs({ onOpenWindow }: TerminalLogsProps) {
    const [charIndex, setCharIndex] = useState(0);
    const [isAccelerated, setIsAccelerated] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isDone = charIndex >= fullText.length;

    /** Type characters one at a time */
    useEffect(() => {
        if (isDone) return;

        const currentChar = fullText[charIndex];
        const prevChar = charIndex > 0 ? fullText[charIndex - 1] : "";

        // Determine delay for next char
        let delay: number;
        if (isAccelerated) {
            delay = FAST_CHAR_SPEED;
        } else if (currentChar === "\n" && prevChar === "\n") {
            delay = EMPTY_LINE_PAUSE;
        } else if (prevChar === "\n") {
            delay = NEWLINE_PAUSE;
        } else {
            delay = NORMAL_CHAR_SPEED;
        }

        const timer = setTimeout(() => {
            setCharIndex((prev) => prev + 1);
        }, delay);

        return () => clearTimeout(timer);
    }, [charIndex, isAccelerated, isDone]);

    /** Auto-scroll to bottom */
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [charIndex]);

    /** Click to accelerate */
    const handleClick = useCallback(() => {
        if (!isDone) setIsAccelerated(true);
    }, [isDone]);

    // Split visible text into lines for rendering
    const visibleText = fullText.slice(0, charIndex);
    const visibleLines = visibleText.split("\n");

    return (
        <div
            ref={scrollRef}
            onClick={handleClick}
            className="overflow-y-auto cursor-pointer select-text"
            style={{
                backgroundColor: "#0f0f12",
                padding: "20px 24px",
                minHeight: 360,
                maxHeight: "calc(75vh - 48px)",
                fontFamily:
                    "var(--font-jetbrains), 'JetBrains Mono', 'IBM Plex Mono', 'SF Mono', Monaco, Consolas, monospace",
                fontSize: 13,
                lineHeight: 1.7,
            }}
        >
            {visibleLines.map((line, i) => {
                const targetId = CLICKABLE_LINES[line];
                const isClickable = !!targetId && onOpenWindow;

                return (
                    <div
                        key={i}
                        style={{
                            ...getLineStyle(line),
                            ...(isClickable
                                ? { cursor: "pointer", textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.3)", textUnderlineOffset: "3px" }
                                : {}),
                        }}
                        onClick={
                            isClickable
                                ? (e) => {
                                    e.stopPropagation();
                                    onOpenWindow(targetId);
                                }
                                : undefined
                        }
                        onMouseEnter={
                            isClickable
                                ? (e) => {
                                    (e.currentTarget as HTMLElement).style.color = "#60a5fa";
                                }
                                : undefined
                        }
                        onMouseLeave={
                            isClickable
                                ? (e) => {
                                    (e.currentTarget as HTMLElement).style.color = "#f4f4f5";
                                }
                                : undefined
                        }
                    >
                        {line || "\u00A0"}
                    </div>
                );
            })}

            {/* Blinking cursor */}
            {!isDone && (
                <span
                    className="animate-pulse inline-block"
                    style={{
                        width: 7,
                        height: 15,
                        backgroundColor: "#e4e4e7",
                        marginLeft: 2,
                        verticalAlign: "text-bottom",
                        opacity: 0.7,
                    }}
                />
            )}
        </div>
    );
}

/** Per-line styling based on content */
function getLineStyle(line: string): React.CSSProperties {
    if (line.startsWith(">")) {
        return { color: "#a1a1aa" };
    }
    if (line.match(/^\[.+\]/)) {
        return { color: "#f4f4f5", fontWeight: 600, marginTop: 2 };
    }
    if (line === "System status: evolving.") {
        return {
            color: "#e4e4e7",
            fontWeight: 600,
            letterSpacing: "0.02em",
            marginTop: 4,
        };
    }
    return { color: "#a1a1aa" };
}
