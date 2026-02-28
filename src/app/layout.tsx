import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "../provider";
import ConditionalNavigation from "../components";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import dynamic from "next/dynamic";

const FloatingCompareBar = dynamic(
  () => import("@/components/compare/FloatingCompareBar")
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gem World | Premium Jewelry Marketplace",
  description: "Discover the world's finest jewelry, diamonds, gemstones, and luxury watches. Shop from trusted sellers worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppProviders>
            <FloatingCompareBar />
            {children}
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
