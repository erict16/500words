"use client";

import { useApp } from "./AppProvider";

export function GuestHero() {
  const { profile, entry } = useApp();
  const guest = profile?.uid === "local";
  if (!guest) return null;
  if (entry.wordCount > 0) return null;
  return (
    <p className="guest-kicker" data-testid="landing-kicker">
      Practice writing every day. Sign in from Menu when you want this on every device.
    </p>
  );
}
