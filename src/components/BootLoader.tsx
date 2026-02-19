"use client";

import { motion } from "framer-motion";

interface BootLoaderProps {
    progress: number;
    showStarting: boolean;
}

export default function BootLoader({ progress, showStarting }: BootLoaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b0b0f]"
            aria-busy="true"
            role="status"
        >
            <div className="flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-center">
                    <span className="text-white/90 font-semibold tracking-tight text-lg">HC</span>
                </div>

                <div className="space-y-1">
                    <div className="text-white/90 text-[15px] font-medium tracking-tight">
                        Hugo Cohen (Cofflard)
                    </div>
                    <div className="text-white/50 text-[12px] font-medium tracking-[0.08em] uppercase">
                        Portfolio
                    </div>
                </div>

                <div className="w-[260px] h-[6px] rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                        className="h-full rounded-full bg-white/70"
                        style={{ width: `${Math.round(progress * 100)}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showStarting ? 1 : 0 }}
                    transition={{ duration: 0.1, ease: "linear" }}
                    className="text-white/50 text-[12px]"
                >
                    Starting…
                </motion.div>
            </div>
        </motion.div>
    );
}
