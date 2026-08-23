"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const guest = profile?.uid === "local";

  if (!user) return <>{children}</>;

  const menu = (
    <details className="write-menu">
      <summary className="write-menu-sum">Menu</summary>
      <div className="write-menu-list" role="menu">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            role="menuitem"
            className={`menu-link ${pathname === link.href ? "active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
        {profile && !guest ? (
          <Link href={`/person/${profile.uid}`} role="menuitem" className="menu-link" data-testid="you-link">
            {profile.displayName}
          </Link>
        ) : null}
        {guest && configured ? (
          <button type="button" role="menuitem" className="menu-link" data-testid="google-signin" onClick={() => void signIn()}>
            Sign in
          </button>
        ) : (
          <button type="button" role="menuitem" className="menu-link" onClick={() => void signOut()}>
            Sign out
          </button>
        )}
      </div>
    </details>
  );

  if (onWrite) {
    return (
      <>
        <a href="#write" className="skip-link">
          Skip to writing
        </a>
        <header className="write-top">
          <div className="site-col write-top-inner">
            <Link href="/" className="site-mark">
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
      <a href="#write" className="skip-link">
        Skip to writing
      </a>
      <header className="site-bar sticky top-0 z-10">
        <div className="site-bar-inner site-col">
          <Link href="/" className="site-mark">
            500 Words
          </Link>
          <nav className="bar-nav" aria-label="App">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`bar-link ${pathname === link.href ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            {profile && !guest ? (
              <Link href={`/person/${profile.uid}`} className="bar-link" data-testid="you-link">
                {profile.displayName}
              </Link>
            ) : null}
            {guest && configured ? (
              <button type="button" className="bar-link" data-testid="google-signin" onClick={() => void signIn()}>
                Sign in
              </button>
            ) : (
              <button type="button" className="bar-link" onClick={() => void signOut()}>
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
