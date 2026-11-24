import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Script from "next/script";

import { getAdsenseClient } from "@/lib/ads";
import { consentBootScript } from "@/lib/consent";
import { siteContact } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const adsenseClient = getAdsenseClient();

export const metadata: Metadata = {
  metadataBase: new URL(siteContact.website),
  title: "Prokrate | Premium Coffee Collection",
  description:
    "Commercial espresso machines, grinders, flavoring, and barista training.",
  ...(adsenseClient
    ? { other: { "google-adsense-account": adsenseClient } }
    : {}),
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  const showAds = Boolean(adsenseClient) && !pathname.startsWith("/admin");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#fff6ee]">
        {children}
        <Script id="consent-boot" strategy="beforeInteractive">
          {consentBootScript}
        </Script>
        {showAds ? (
          <Script
            id="adsense"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
