"use client";

import { monthKey, monthLabel, shiftMonth } from "@/lib/dates";
import { useApp } from "./AppProvider";
import { BowlingMark } from "./BowlingMark";

export function MonthGrid() {
  const { date, today, monthDays, monthPoints, setDate, lifetime } = useApp();
  const label = monthLabel(date);
  const thisMonth = monthKey(today);
  const daysLeft = monthDays.filter((d) => d.date >= today).length;

  return (
    <div className="month-wrap">
      <div className="month-head">
        <p className="month-name">
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
          {monthKey(date) === thisMonth ? (
            <span className="days-left" data-testid="days-left">
              {daysLeft} {daysLeft === 1 ? "day" : "days"} left
            </span>
          ) : null}
        </p>
        <p className="month-pts">{monthPoints} pts</p>
      </div>
      <div className="month-grid" data-testid="month-grid">
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
              data-mark={day.mark}
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
              <BowlingMark mark={day.mark} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
