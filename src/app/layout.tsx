import type { Metadata } from "next";
import { AppProvider } from "@/components/AppProvider";
import { AppChrome } from "@/components/AppChrome";
import { SignInGate } from "@/components/SignInGate";
import { ThemeSync } from "@/components/ThemeSync";
import "./globals.css";

export const metadata: Metadata = {
  title: "500 Words",
  description: "Private daily writing. Five hundred words.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <AppProvider>
          <ThemeSync />
          <SignInGate>
            <AppChrome>{children}</AppChrome>
          </SignInGate>
        </AppProvider>
      </body>
    </html>
  );
}
