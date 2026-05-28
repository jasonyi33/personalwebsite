import type { Metadata } from "next";
import { JetBrains_Mono, Orbitron, Noto_Sans_JP } from "next/font/google";
import { AudioProvider } from "@/components/os/AudioProvider";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JASON-OS",
  description: "Personal site of Jason Yi — EECS @ UC Berkeley. Rendered as an in-browser NERV-themed operating system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${orbitron.variable} ${notoSansJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}
