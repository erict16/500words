"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx, ui } from "@/lib/css";
import { isLocalUid } from "@/lib/identity";
import { NAV_LINKS } from "@/lib/nav";
import { useApp } from "./AppProvider";

export function WriteKebab() {
  const { signOut, signIn, profile } = useApp();
  const pathname = usePathname();
  const guest = isLocalUid(profile?.uid);

  return (
    <details className={ui.kebab}>
      <summary className={ui.kebabSum} aria-label="More" data-testid="write-kebab">
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
          <circle cx="12" cy="6" r="1.8" fill="currentColor" />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
          <circle cx="12" cy="18" r="1.8" fill="currentColor" />
        </svg>
      </summary>
      <div className={ui.menuList} role="menu">
        {NAV_LINKS.map((link) => (
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
        {guest ? (
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
}
