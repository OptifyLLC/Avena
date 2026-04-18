import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-accent",
  weight: ["400", "500"],
  style: ["italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Avena — The breath of optimization",
  description:
    "Avena is a real-time voice agent that answers, qualifies, books, and hands off every inbound call — so every caller feels heard, not just handled.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${outfit.variable} ${jetbrainsMono.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body
        className="min-h-full bg-[#050505] text-zinc-100"
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
