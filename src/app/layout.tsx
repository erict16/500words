import type { Metadata } from "next";
import {
  Barlow_Semi_Condensed,
  Bitter,
  Figtree,
  Merriweather,
  Montserrat,
  Roboto_Mono,
  Source_Sans_3,
  Zilla_Slab,
} from "next/font/google";
import { AppProvider } from "@/components/AppProvider";
import { Shell } from "@/components/Shell";
import { ThemeSync } from "@/components/ThemeSync";
import "./globals.css";
import "@/styles/app.css";

// 750 uses paid Sentinel SSm (serif) and Gotham / Gotham Narrow (sans).
// Legal Google Fonts / OFL stand-ins only — do not pirate Typography.com files.
// Defaults: Zilla Slab (slab silhouette) + Barlow Semi Condensed (narrow sans).
const zillaSlab = Zilla_Slab({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-zilla-slab",
  weight: ["300", "400", "600", "700"],
});

const merriweather = Merriweather({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-merriweather",
  weight: ["300", "400", "600", "700"],
  preload: false,
});

const bitter = Bitter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bitter",
  weight: ["300", "400", "600", "700"],
  preload: false,
});

const barlow = Barlow_Semi_Condensed({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow-semi-condensed",
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "600", "700"],
  preload: false,
});

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
  weight: ["300", "400", "600", "700"],
  preload: false,
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["300", "400", "600", "700"],
  preload: false,
});

const mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
  weight: ["400", "500"],
});

const fontVariables = [
  zillaSlab.variable,
  merriweather.variable,
  bitter.variable,
  barlow.variable,
  montserrat.variable,
  figtree.variable,
  sourceSans.variable,
  mono.variable,
].join(" ");

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
    <html lang="en" className={`h-full ${fontVariables}`}>
      <body className="min-h-full font-serif">
        <AppProvider>
          <ThemeSync />
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  );
}
