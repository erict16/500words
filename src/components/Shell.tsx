"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppChrome } from "./AppChrome";
import { SignInGate } from "./SignInGate";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = pathname.startsWith("/person/");

  if (isPublic) {
    return (
      <>
        <header className="site-bar">
          <Link href="/" className="site-mark">
            500 Words
          </Link>
        </header>
        {children}
      </>
    );
  }

  return (
    <SignInGate>
      <AppChrome>{children}</AppChrome>
    </SignInGate>
  );
}
