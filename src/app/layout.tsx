import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import { AppProvider } from "@/components/AppProvider";
import { Shell } from "@/components/Shell";
import { ThemeSync } from "@/components/ThemeSync";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-serif",
});

export const metadata: Metadata = {
  title: "500 Words",
  description: "Private daily writing. Five hundred words.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full ${sourceSerif.variable}`}>
      <body className="min-h-full">
        <AppProvider>
          <ThemeSync />
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  );
}
