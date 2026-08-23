"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "./AppProvider";

const LINKS = [
  { href: "/", label: "Write" },
  { href: "/stats", label: "Stats" },
  { href: "/badges", label: "Badges" },
  { href: "/challenge", label: "One month" },
  { href: "/settings", label: "Settings" },
];

export function AppChrome({ children }: { children: React.ReactNode }) {
  const { user, settings, signOut } = useApp();
  const pathname = usePathname();
  const hideEnabled = settings.hideChrome;
  const [idleHidden, setIdleHidden] = useState(false);
  const hidden = hideEnabled && idleHidden;

  useEffect(() => {
    if (!hideEnabled) return;
    let timer: number | null = null;
    const bump = () => {
      setIdleHidden(false);
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdleHidden(true), 2500);
    };
    const onMove = (e: MouseEvent) => {
      if (e.clientY < 64) setIdleHidden(false);
    };
    bump();
    window.addEventListener("keydown", bump);
    window.addEventListener("mousemove", onMove);
    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("keydown", bump);
      window.removeEventListener("mousemove", onMove);
    };
  }, [hideEnabled]);

  if (!user) return <>{children}</>;

  return (
    <>
      <a href="#write" className="skip-link">
        Skip to writing
      </a>
      <header
        className="site-bar sticky top-0 z-10"
        style={{
          opacity: hidden ? 0 : 1,
          pointerEvents: hidden ? "none" : "auto",
          transition: "opacity 160ms ease",
        }}
      >
        <Link href="/" className="site-mark">
          500 Words
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`bar-link ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <button type="button" className="bar-link" onClick={() => void signOut()}>
            Sign out
          </button>
        </nav>
      </header>
      {children}
    </>
  );
}
