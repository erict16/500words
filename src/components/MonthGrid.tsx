"use client";

import { monthKey, monthLabel, shiftMonth } from "@/lib/dates";
import { useApp } from "./AppProvider";

export function MonthGrid() {
  const { date, today, monthDays, monthPoints, setDate, lifetime } = useApp();
  const label = monthLabel(date);
  const thisMonth = monthKey(today);

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[13px] text-[var(--muted)]">
          <button
            type="button"
            className="chrome-link mr-2"
            aria-label="Previous month"
            onClick={() => setDate(shiftMonth(date, -1))}
          >
            ‹
          </button>
          {label}
          {monthKey(date) < thisMonth ? (
            <button
              type="button"
              className="chrome-link ml-2"
              aria-label="Next month"
              onClick={() => {
                const next = shiftMonth(date, 1);
                setDate(next > today ? today : next);
              }}
            >
              ›
            </button>
          ) : null}
          {lifetime?.currentStreak ? ` · ${lifetime.currentStreak} day streak` : ""}
        </p>
        <p className="text-[13px] tabular-nums text-[var(--muted)]">{monthPoints} pts</p>
      </div>
      <div className="flex flex-wrap gap-[3px]">
        {monthDays.map((day) => {
          const future = day.date > today;
          const selected = day.date === date;
          const cls = [
            "day-box",
            day.mark,
            day.date === today ? "today" : "",
            future ? "future" : "",
            selected ? "selected" : "",
            day.madeUp ? "madeup" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={day.date}
              type="button"
              className={cls}
              data-date={day.date}
              data-testid={day.date === today ? "today-box" : undefined}
              disabled={future}
              title={
                future
                  ? day.date
                  : `${day.date}: ${day.wordCount} words${day.points ? ` · ${day.points} pts` : ""}`
              }
              onClick={() => setDate(day.date)}
              aria-label={`Day ${day.day}${day.mark === "strike" ? ", strike" : day.mark === "spare" ? ", spare" : ""}`}
              aria-current={selected ? "date" : undefined}
            >
              <span className="num">{day.day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
