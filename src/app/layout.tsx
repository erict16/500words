import type { Metadata } from "next";
import { Sniglet } from "next/font/google";
import { AppProvider } from "@/components/AppProvider";
import { Shell } from "@/components/Shell";
import { ThemeSync } from "@/components/ThemeSync";
import "./globals.css";

const sniglet = Sniglet({
  weight: ["400", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sniglet",
});

export const metadata: Metadata = {
  title: "500 Words",
  description: "Private daily writing. Five hundred words.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full ${sniglet.variable}`}>
      <body className="min-h-full">
        <AppProvider>
          <ThemeSync />
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  );
}
