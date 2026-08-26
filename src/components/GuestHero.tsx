"use client";

import { ui } from "@/lib/css";
import { isLocalUid } from "@/lib/identity";
import { useApp } from "./AppProvider";

export function GuestHero() {
  const { profile, entry } = useApp();
  const guest = isLocalUid(profile?.uid);
  if (!guest) return null;
  if (entry.wordCount > 0) return null;
  return (
    <p className={ui.kicker} data-testid="landing-kicker">
      Practice writing every day. Sign in when you want this on every device.
    </p>
  );
}
