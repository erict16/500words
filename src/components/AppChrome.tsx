"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx, ui } from "@/lib/css";
import { isLocalUid } from "@/lib/identity";
import { NAV_LINKS, isWritePath } from "@/lib/nav";
import { useApp } from "./AppProvider";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const { user, signOut, signIn, profile, configured } = useApp();
  const pathname = usePathname();
  const onWrite = isWritePath(pathname);
  const guest = isLocalUid(profile?.uid);

  if (!user) return <>{children}</>;

  if (onWrite) {
    return (
      <>
        <a href="#write" className={ui.skip}>
          Skip to writing
        </a>
        <header className={cx(ui.writeTop, "bg-[color:var(--paper)]/90")}>
          <div className={cx(ui.writeTopInner, "flex w-full items-center justify-between px-4")}>
            <Link href="/" className={cx(ui.mark, "font-serif text-[20px] font-bold leading-[30px]")} id="logo">
              500 Words
            </Link>
            <Link
              href={guest ? "/" : "/stats"}
              className={cx(ui.close, "text-[color:var(--muted)] hover:text-[color:var(--ink)]")}
              aria-label="Close"
              data-testid="write-close"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                <path
                  fill="currentColor"
                  d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </Link>
          </div>
        </header>
        {children}
      </>
    );
  }

  return (
    <>
      <a href="#write" className={ui.skip}>
        Skip to writing
      </a>
      <header className={cx(ui.bar, "sticky top-0 z-10")}>
        <div className={cx(ui.barInner, ui.col)}>
          <Link href="/" className={ui.mark}>
            500 Words
          </Link>
          <nav className={ui.barNav} aria-label="App">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cx(ui.barLink, pathname === link.href && "active")}
              >
                {link.label}
              </Link>
            ))}
            {profile && !guest ? (
              <Link href={`/person/${profile.uid}`} className={ui.barLink} data-testid="you-link">
                {profile.displayName}
              </Link>
            ) : null}
            {guest && configured ? (
              <button type="button" className={ui.barLink} data-testid="google-signin" onClick={() => void signIn()}>
                Sign in
              </button>
            ) : (
              <button type="button" className={ui.barLink} onClick={() => void signOut()}>
                Sign out
              </button>
            )}
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}
