import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "800"], variable: "--font-display" });
const body = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

// The public address, used to build full links for the share preview. Local runs use localhost.
const site = process.env.VERCEL ? "https://aryanjain-dev.vercel.app" : "http://localhost:3000";
const description = "Software engineer at HSBC building Python automation. Runner, musician, origami folder and language learner.";

// The share preview picture comes from app/opengraph-image.tsx (a designed card, not a personal photo).
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "Aryan Jain",
  description,
  openGraph: {
    title: "Aryan Jain · aryan.os",
    description,
    url: site,
    siteName: "aryan.os",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aryan Jain · aryan.os",
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
