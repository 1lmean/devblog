import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { Providers } from "@/app/providers";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "블로그",
    template: "%s · 블로그",
  },
  description: "Next.js로 만든 개인 블로그",
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "블로그",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <SiteHeader />
          {children}
          <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800">
            <div className="page-shell py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
              © {new Date().getFullYear()}
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
