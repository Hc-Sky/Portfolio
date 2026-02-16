"use client";

/**
 * TopBar — macOS-style menu bar.
 * Fixed at the top of the viewport with glassmorphism effect.
 * Left: branding + links that open windows. Right: live clock.
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TopBarProps {
    onOpenWindow: (windowId: string) => void;
}

export default function TopBar({ onOpenWindow }: TopBarProps) {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const formatted =
                now.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                }) +
                "  " +
                now.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
            setTime(formatted);
        };

        updateClock();
        const interval = setInterval(updateClock, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex h-7 items-center justify-between px-5
        bg-black/40 backdrop-blur-2xl border-b border-white/10
        text-[13px] font-medium text-white/90 select-none"
        >
            {/* Left — Branding + Links */}
            <nav className="flex items-center gap-5">
                <span className="font-semibold tracking-tight">HNC OS Portfolio</span>
                <button
                    onClick={() => onOpenWindow("contact")}
                    className="opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:underline"
                >
                    Contact
                </button>
                <button
                    onClick={() => onOpenWindow("resume")}
                    className="opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:underline"
                >
                    Resume
                </button>
            </nav>

            {/* Right — Clock */}
            <div className="opacity-60 tabular-nums text-xs" aria-live="polite">
                {time}
            </div>
        </motion.header>
    );
}
