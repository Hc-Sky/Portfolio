"use client";

import { useEffect, useRef, useState } from "react";

const BOOT_KEY = "hc_boot_seen";
const PROGRESS_DURATION = 2200;
const STARTING_DURATION = 300;

interface UseBootSequenceOptions {
    enabled?: boolean;
}

interface BootSequenceState {
    isBootVisible: boolean;
    isDesktopReady: boolean;
    progress: number;
    showStarting: boolean;
}

export default function useBootSequence({ enabled = true }: UseBootSequenceOptions): BootSequenceState {
    const [isBootVisible, setIsBootVisible] = useState(false);
    const [isDesktopReady, setIsDesktopReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showStarting, setShowStarting] = useState(false);
    const rafRef = useRef<number | null>(null);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const isDesktop = window.innerWidth >= 1024;

        if (!enabled || !isDesktop) {
            setIsBootVisible(false);
            setIsDesktopReady(true);
            setProgress(1);
            setShowStarting(false);
            return;
        }

        const hasSeen = sessionStorage.getItem(BOOT_KEY) === "1";
        if (hasSeen) {
            setIsBootVisible(false);
            setIsDesktopReady(true);
            setProgress(1);
            setShowStarting(false);
            return;
        }

        setIsBootVisible(true);
        setIsDesktopReady(false);
        setProgress(0);
        setShowStarting(false);

        const start = performance.now();

        const tick = (now: number) => {
            const elapsed = now - start;
            const nextProgress = Math.min(elapsed / PROGRESS_DURATION, 1);
            setProgress(nextProgress);

            if (nextProgress < 1) {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            setShowStarting(true);
            timeoutRef.current = window.setTimeout(() => {
                setShowStarting(false);
                setIsBootVisible(false);
                setIsDesktopReady(true);
                sessionStorage.setItem(BOOT_KEY, "1");
            }, STARTING_DURATION);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
            }
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, [enabled]);

    return { isBootVisible, isDesktopReady, progress, showStarting };
}
