"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { monthKey, todayInZone } from "@/lib/dates";
import { isFirebaseConfigured } from "@/lib/firebase";
import { loadPublicPerson } from "@/lib/db";
import { useApp } from "@/components/AppProvider";

export default function PersonPage() {
  const params = useParams<{ id: string }>();
  const { settings } = useApp();
  const [row, setRow] = useState<Record<string, unknown> | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const month = monthKey(todayInZone(settings.timezone));
    void loadPublicPerson(month, params.id).then((data) => {
      if (!data) setMissing(true);
      else setRow(data);
    });
  }, [params.id, settings.timezone]);

  if (missing) {
    return (
      <main className="px-6 py-10">
        <p>No public stats for this person this month.</p>
      </main>
    );
  }

  if (!row) {
    return (
      <main className="px-6 py-10 text-[var(--muted)]">Loading…</main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="font-georgia text-3xl">{String(row.displayName)}</h1>
      <p className="mt-4 text-[16px] leading-relaxed">
        {String(row.monthPoints ?? 0)} points this month · {String(row.daysCompleted ?? 0)}{" "}
        days of 500 · {String(row.monthWords ?? 0)} words · streak{" "}
        {String(row.streak ?? 0)}
      </p>
      <p className="mt-6 text-[13px] text-[var(--muted)]">
        Writing stays private. This page is only the scoreboard.
      </p>
    </main>
  );
}
