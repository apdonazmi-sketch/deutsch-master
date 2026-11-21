import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import SwRegister from "@/components/SwRegister";
import SoundFx from "@/components/SoundFx";

export const metadata: Metadata = {
  title: "DEUTSCH MASTER AI — مدرّسك الألماني الشخصي",
  applicationName: "Deutsch Master",
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Deutsch Master", statusBarStyle: "black-translucent" },
  description: "نظام ذكي متكامل لتعلم الألمانية من الصفر حتى C2 — مدرّس صوتي، خطة شخصية، ومحاكاة للحياة الحقيقية في ألمانيا.",
};

export const viewport: Viewport = {
  themeColor: "#0b0b0e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink text-cream antialiased"><SwRegister /><SoundFx />{children}</body>
    </html>
  );
}
