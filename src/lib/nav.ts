export const WRITE_HREF = "/write";

export function isWritePath(pathname: string | null | undefined): boolean {
  return pathname === WRITE_HREF;
}

export function isLandingPath(pathname: string | null | undefined): boolean {
  return pathname === "/";
}

export const NAV_LINKS = [
  { href: WRITE_HREF, label: "Write" },
  { href: "/stats", label: "Stats" },
  { href: "/badges", label: "Badges" },
  { href: "/challenge", label: "One month" },
  { href: "/search", label: "Search" },
  { href: "/settings", label: "Settings" },
] as const;
