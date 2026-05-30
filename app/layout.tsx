import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AudioProvider } from "@/components/os/AudioProvider";
import { ThemeProvider } from "@/components/os/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jasonyi.live'),
  title: "jasonyi.live",
  description: "Personal site of Jason Yi — EECS @ UC Berkeley. An in-browser desktop.",
};

const themeBootstrap = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var preferred = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', preferred);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AudioProvider>{children}</AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
