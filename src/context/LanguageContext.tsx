"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Language = "fr" | "en";

interface LanguageContextValue {
    language: Language;
    setLanguage: (language: Language) => void;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
    children,
    defaultLanguage = "fr",
}: {
    children: ReactNode;
    defaultLanguage?: Language;
}) {
    const [language, setLanguage] = useState<Language>(defaultLanguage);

    const value = useMemo(
        () => ({
            language,
            setLanguage,
            toggleLanguage: () =>
                setLanguage((prev) => (prev === "fr" ? "en" : "fr")),
        }),
        [language],
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
}
