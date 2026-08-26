import type { Metadata } from "next";
import { Bitter, Roboto_Mono, Source_Sans_3 } from "next/font/google";
import { AppProvider } from "@/components/AppProvider";
import { Shell } from "@/components/Shell";
import { ThemeSync } from "@/components/ThemeSync";
import "./globals.css";
import "@/styles/app.css";

// 750 uses paid Sentinel SSm (serif) and Gotham Narrow (sans). Legal stand-ins:
const serif = Bitter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bitter",
  weight: ["300", "400", "600", "700"],
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["400", "500", "600", "700"],
});

const mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "500 Words",
  description: "Private daily writing. Five hundred words.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#00c853" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full ${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-full font-serif">
        <AppProvider>
          <ThemeSync />
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  );
}
