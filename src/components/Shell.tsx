"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx, ui } from "@/lib/css";
import { AppChrome } from "./AppChrome";
import { SiteFooter } from "./SiteFooter";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = pathname.startsWith("/person/");
  const onWrite = pathname === "/";

  if (isPublic) {
    return (
      <>
        <header className={ui.writeTop}>
          <div className={cx(ui.col, ui.writeTopInner)}>
            <Link href="/" className={ui.mark}>
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
