"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx, ui } from "@/lib/css";
import { isLocalUid } from "@/lib/identity";
import { NAV_LINKS } from "@/lib/nav";
import { useApp } from "./AppProvider";

export function LandingMenu() {
  const { signOut, signIn, profile, configured } = useApp();
  const pathname = usePathname();
  const guest = isLocalUid(profile?.uid);

  return (
    <details className="landing-menu">
      <summary className="landing-menu-sum" data-testid="landing-menu">
        Menu
      </summary>
      <div className={cx(ui.menuList, "landing-menu-list")} role="menu">
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
          <Link href={`/person/${profile.uid}`} role="menuitem" className={ui.menuLink}>
            {profile.displayName}
          </Link>
        ) : null}
        {guest && configured ? (
          <button
            type="button"
            role="menuitem"
            className={ui.menuLink}
            data-testid="landing-signin"
            onClick={() => void signIn()}
          >
            Sign in
          </button>
        ) : !guest ? (
          <button type="button" role="menuitem" className={ui.menuLink} onClick={() => void signOut()}>
            Sign out
          </button>
        ) : null}
      </div>
    </details>
  );
}
