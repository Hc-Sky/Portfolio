"use client";

/**
 * StickyNote — Premium handwritten sticky note with highlighter marks.
 * Uses Caveat font for a natural hand-written feel, with fluorescent
 * highlighter strokes on certain items for a "marked with a sharpie" look.
 */

import { motion } from "framer-motion";

const todos: { text: string; done: boolean; highlight?: string }[] = [
    { text: "Intégrer le Master Ingémédia", done: false, highlight: "#bbf7d0" },
    { text: "Boire de l'eau", done: false },
    { text: "Finir ce portfolio", done: true, highlight: "#fde68a" },
    { text: "Devenir un meilleur dev", done: false },
    { text: "Explorer de nouvelles technos", done: true },
    { text: "World domination", done: false, highlight: "#c4b5fd" },
    { text: "Bien manger", done: true },
    { text: "Voyager quelque part de nouveau", done: false },
];

export default function StickyNote() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            whileHover={{
                scale: 1.04,
                rotate: -0.5,
                y: -4,
                boxShadow:
                    "4px 8px 20px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.08)",
            }}
            transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
            drag
            dragSnapToOrigin
            dragElastic={0.5}
            dragMomentum={false}
            dragTransition={{
                bounceStiffness: 300,
                bounceDamping: 15,
            }}
            className="absolute top-14 left-6 z-10 cursor-grab active:cursor-grabbing"
            style={{
                width: 260,
                backgroundColor: "#fef49c",
                borderRadius: 4,
                padding: "16px 18px",
                boxShadow:
                    "2px 4px 12px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                fontFamily: "var(--font-caveat), 'Caveat', cursive",
            }}
        >
            {/* Title */}
            <p
                style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    marginBottom: 6,
                    lineHeight: 1.2,
                    borderBottom: "2px solid rgba(0,0,0,0.08)",
                    paddingBottom: 4,
                }}
            >
                To do:
            </p>

            {/* Items */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                {todos.map((item) => (
                    <p
                        key={item.text}
                        style={{
                            fontSize: 18,
                            fontWeight: 500,
                            color: item.done ? "#888" : "#1a1a1a",
                            lineHeight: 1.55,
                            textDecoration: item.done
                                ? "line-through"
                                : "none",
                            textDecorationColor: item.done
                                ? "#aaa"
                                : undefined,
                            margin: 0,
                            padding: "1px 0",
                            position: "relative",
                            /* Highlighter effect — a semi-transparent background 
                               that looks like a swipe of fluorescent marker */
                            ...(item.highlight
                                ? {
                                    background: `linear-gradient(to right, ${item.highlight}90, ${item.highlight}50)`,
                                    borderRadius: 2,
                                    padding: "1px 4px",
                                    marginLeft: -4,
                                    marginRight: -4,
                                }
                                : {}),
                        }}
                    >
                        {item.text}
                    </p>
                ))}
            </div>
        </motion.div>
    );
}
