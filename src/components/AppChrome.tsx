"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx, ui } from "@/lib/css";
import { isLocalUid } from "@/lib/identity";
import { useApp } from "./AppProvider";

const LINKS = [
  { href: "/", label: "Write" },
  { href: "/stats", label: "Stats" },
  { href: "/badges", label: "Badges" },
  { href: "/challenge", label: "One month" },
  { href: "/search", label: "Search" },
  { href: "/settings", label: "Settings" },
];

export function AppChrome({ children }: { children: React.ReactNode }) {
  const { user, signOut, signIn, profile, configured } = useApp();
  const pathname = usePathname();
  const onWrite = pathname === "/";
  const guest = isLocalUid(profile?.uid);

  if (!user) return <>{children}</>;

  const menu = (
    <details className={ui.menu}>
      <summary className={ui.menuSum}>Menu</summary>
      <div className={ui.menuList} role="menu">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            role="menuitem"
            className={cx(ui.menuLink, pathname === link.href && "active")}
          >
            {link.label}
          </Link>
        ))}
        {profile && !guest ? (
          <Link href={`/person/${profile.uid}`} role="menuitem" className={ui.menuLink} data-testid="you-link">
            {profile.displayName}
          </Link>
        ) : null}
        {guest && configured ? (
          <button type="button" role="menuitem" className={ui.menuLink} data-testid="google-signin" onClick={() => void signIn()}>
            Sign in
          </button>
        ) : (
          <button type="button" role="menuitem" className={ui.menuLink} onClick={() => void signOut()}>
            Sign out
          </button>
        )}
      </div>
    </details>
  );

  if (onWrite) {
    return (
      <>
        <a href="#write" className={ui.skip}>
          Skip to writing
        </a>
        <header className={ui.writeTop}>
          <div className={cx(ui.col, ui.writeTopInner)}>
            <Link href="/" className={ui.mark}>
              500 Words
            </Link>
            {menu}
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
            {LINKS.map((link) => (
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
