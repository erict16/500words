"use client";

import { cx, ui } from "@/lib/css";
import { monthAbbr, prettyLongDate, shiftMonth } from "@/lib/dates";
import { useApp } from "./AppProvider";

export function DayCheck() {
  return (
    <svg className={ui.dayCheck} viewBox="0 0 16 16" aria-hidden>
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
    <div className={ui.head}>
      <h1 className={ui.date} data-testid="write-date">
        {prettyLongDate(date)}
      </h1>
      <div className={ui.calRow}>
        <div className={ui.calMonths}>
          <button type="button" className={ui.calNav} aria-label="Previous month" onClick={() => setDate(prev)}>
            ◀
          </button>
          <button type="button" className={ui.calMonth} onClick={() => setDate(prev)}>
            {monthAbbr(prev)}
          </button>
          <span className={ui.calSep}>|</span>
          <span className={cx(ui.calMonth, "current")}>{monthAbbr(date)}</span>
        </div>
        <p className={ui.calDone} data-testid="days-completed">
          {completed} {completed === 1 ? "day" : "days"} completed
        </p>
      </div>
      <div className={ui.monthGrid} data-testid="month-grid">
        {monthDays.map((day) => {
          const future = day.date > today;
          const selected = day.date === date;
          const cls = cx(
            ui.dayBox,
            day.mark,
            day.date === today && "today",
            future && "future",
            selected && "selected",
          );
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
              {day.mark === "strike" ? <DayCheck /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
