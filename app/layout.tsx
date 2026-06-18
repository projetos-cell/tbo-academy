import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "@/components/providers";
import { Preloader } from "@/components/layout/preloader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ── TBO Academy Design System ──────────────────────────────
// Par editorial: Space Grotesk (display) + JetBrains Mono (mono).
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TBO Academy",
  description: "TBO Academy - Plataforma de aprendizado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <NextTopLoader showSpinner={false} />
        <Providers>
          <Preloader />
          {children}
        </Providers>
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
