"use client";

/**
 * DesktopOnly — mobile fallback component.
 * Displayed when viewport width < 1024px.
 * Shows a clear message directing users to open on desktop.
 */

import { motion } from "framer-motion";

export default function DesktopOnly() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center max-w-md"
            >
                {/* Monitor icon */}
                <div className="text-6xl mb-6" aria-hidden="true">🖥️</div>

                <h1 className="text-2xl font-semibold text-white mb-3">
                    Expérience Desktop
                </h1>

                <p className="text-gray-400 text-base leading-relaxed mb-8">
                    Ouvre ce portfolio sur un ordinateur pour une expérience optimale.
                    L&apos;interface reproduit un environnement de bureau interactif qui nécessite un écran large.
                </p>

                <a
                    href="https://inikaj.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full
            bg-white text-gray-900 font-medium text-sm
            hover:bg-gray-100 transition-colors
            focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                    Voir la référence d&apos;inspiration
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-60">
                        <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </a>

                <p className="text-gray-600 text-xs mt-6">
                    HNC OS Portfolio — Hugo Cohen-Cofflard
                </p>
            </motion.div>
        </div>
    );
}
