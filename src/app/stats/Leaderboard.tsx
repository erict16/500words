"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listenLeaderboard } from "@/lib/db";
import { monthKey } from "@/lib/dates";
import { isFirebaseConfigured } from "@/lib/firebase";
import { useApp } from "@/components/AppProvider";

export function Leaderboard() {
  const { today, user } = useApp();
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    return listenLeaderboard(monthKey(today), setRows);
  }, [today]);

  if (rows.length === 0) return null;

  return (
    <section>
      <h2 className="page-h2">This month’s points</h2>
      <ol className="mt-3 space-y-1 text-[15px]">
        {rows.slice(0, 20).map((row, i) => (
          <li key={String(row.uid)} className={row.uid === user?.uid ? "font-medium" : ""}>
            {i + 1}.{" "}
            <Link href={`/person/${row.uid}`} className="underline">
              {String(row.displayName || "Anonymous")}
            </Link>{" "}
            · {String(row.monthPoints ?? 0)} pts
          </li>
        ))}
      </ol>
    </section>
  );
}
