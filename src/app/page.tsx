"use client";

/**
 * Home page — entry point for the HNC OS Portfolio.
 * Detects viewport width to render <Desktop /> (>= 1024px) or <DesktopOnly /> fallback.
 * Listens for resize events to switch dynamically.
 */

import { useEffect, useState } from "react";
import Desktop from "@/components/Desktop";
import DesktopOnly from "@/components/DesktopOnly";

const DESKTOP_BREAKPOINT = 1024;

export default function Home() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

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

  return isDesktop ? <Desktop /> : <DesktopOnly />;
}
