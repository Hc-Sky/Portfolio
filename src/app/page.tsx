"use client";

/**
 * Home page — entry point for the HNC OS Portfolio.
 * Detects viewport width to render <Desktop /> (>= 1024px) or <DesktopOnly /> fallback.
 * Listens for resize events to switch dynamically.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Desktop from "@/components/Desktop";
import DesktopOnly from "@/components/DesktopOnly";
import BootLoader from "@/components/BootLoader";
import useBootSequence from "@/hooks/useBootSequence";

const DESKTOP_BREAKPOINT = 1024;

export default function Home() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const { isBootVisible, isDesktopReady, progress, showStarting } = useBootSequence({
    enabled: true,
  });

  useEffect(() => {
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Avoid flash of content while detecting viewport
  if (isDesktop === null) {
    return (
      <div className="min-h-screen bg-gray-900" aria-busy="true" />
    );
  }

  if (!isDesktop) {
    return <DesktopOnly />;
  }

  return (
    <>
      <AnimatePresence>
        {isBootVisible && (
          <BootLoader progress={progress} showStarting={showStarting} />
        )}
      </AnimatePresence>

      {isDesktopReady && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Desktop />
        </motion.div>
      )}
    </>
  );
}
