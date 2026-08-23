"use client";

import { monthAbbr, prettyLongDate, shiftMonth } from "@/lib/dates";
import { useApp } from "./AppProvider";

function Check() {
  return (
    <svg className="day-check" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M3.2 8.4 6.1 11.2 12.8 4.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MonthGrid() {
  const { date, today, monthDays, setDate, lifetime } = useApp();
  const prev = shiftMonth(date, -1);
  const completed = lifetime?.completedEver ?? 0;

  return (
    <div className="write-head">
      <h1 className="write-date" data-testid="write-date">
        {prettyLongDate(date)}
      </h1>
      <div className="cal-row">
        <div className="cal-months">
          <button type="button" className="cal-nav" aria-label="Previous month" onClick={() => setDate(prev)}>
            ◀
          </button>
          <button type="button" className="cal-month" onClick={() => setDate(prev)}>
            {monthAbbr(prev)}
          </button>
          <span className="cal-sep">|</span>
          <span className="cal-month current">{monthAbbr(date)}</span>
        </div>
        <p className="cal-done" data-testid="days-completed">
          {completed} {completed === 1 ? "day" : "days"} completed
        </p>
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
              title={future ? day.date : `${day.date}: ${day.wordCount} words`}
              onClick={() => setDate(day.date)}
              aria-label={`Day ${day.day}${day.mark === "strike" ? ", done" : ""}`}
              aria-current={selected ? "date" : undefined}
            >
              {day.mark === "strike" ? <Check /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
