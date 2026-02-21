import type { Metadata } from "next";
import { Inter, Playfair_Display, Caveat, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * Root layout — configures fonts, metadata, and body wrapper.
 * Inter for UI, Playfair Display for serif accent (hero text).
 */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio de Hugo Cohen-Cofflard",
  description:
    "Portfolio interactif de Hugo Cohen-Cofflard — Candidature Master Ingémédia, Toulon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${playfair.variable} ${caveat.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
