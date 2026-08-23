"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppChrome } from "./AppChrome";
import { SignInGate } from "./SignInGate";
import { SiteFooter } from "./SiteFooter";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = pathname.startsWith("/person/");
  const onWrite = pathname === "/";

  if (isPublic) {
    return (
      <>
        <header className="site-bar">
          <div className="site-bar-inner site-col">
            <Link href="/" className="site-mark">
              500 Words
            </Link>
          </div>
        </header>
        {children}
        <SiteFooter />
      </>
    );
  }

  return (
    <SignInGate>
      <AppChrome>
        {children}
        {onWrite ? null : <SiteFooter />}
      </AppChrome>
    </SignInGate>
  );
}
