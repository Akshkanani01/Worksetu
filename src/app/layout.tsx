import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Vercel Analytics અને Speed Insights ઉમેરો
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WorkSetu",
  description: "Workshop Management Platform for Owners and Karigars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        
        {/* Vercel Analytics અને Speed Insights – આ લાઈન્સ ઉમેરેલી છે */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}