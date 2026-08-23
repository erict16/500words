"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppChrome } from "./AppChrome";
import { SiteFooter } from "./SiteFooter";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = pathname.startsWith("/person/");
  const onWrite = pathname === "/";

  if (isPublic) {
    return (
      <>
        <header className="write-top">
          <div className="site-col write-top-inner">
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
    <AppChrome>
      {children}
      {onWrite ? null : <SiteFooter />}
    </AppChrome>
  );
}
