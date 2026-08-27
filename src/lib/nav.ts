export const WRITE_HREF = "/write";

/** 750 close is `exitWriting(){ this.$router.push("/") }`. Signed-in `/` must not bounce back to write. */
export const EXIT_WRITE_KEY = "fivehundred-exit-write";

export function markLeftWrite() {
  try {
    sessionStorage.setItem(EXIT_WRITE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function didLeaveWrite(): boolean {
  try {
    return sessionStorage.getItem(EXIT_WRITE_KEY) === "1";
  } catch {
    return false;
  }
}

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
