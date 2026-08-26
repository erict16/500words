"use client";

import { cx, ui } from "@/lib/css";
import { isLocalUid } from "@/lib/identity";
import { monthAbbr, prettyLongDate, shiftMonth } from "@/lib/dates";
import { useApp } from "./AppProvider";
import { WriteKebab } from "./WriteKebab";

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
  const { date, today, monthDays, setDate, lifetime, profile } = useApp();
  const prev = shiftMonth(date, -1);
  const guest = isLocalUid(profile?.uid);
  const streak = lifetime?.currentStreak ?? 0;
  const photo = !guest && profile?.photoURL ? profile.photoURL : "";
  const initial = !guest ? (profile?.displayName || "?").trim().slice(0, 1) : "";

  return (
    <div className={ui.head}>
      <h1 className={cx(ui.date, "font-serif text-[26px] font-bold")} data-testid="write-date">
        {prettyLongDate(date)}
      </h1>
      <div className={cx(ui.calRow, "font-sans")}>
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
        <div className="cal-meta">
          {photo ? (
            <img src={photo} alt="" className={ui.avatar} width={24} height={24} />
          ) : initial ? (
            <span className={cx(ui.avatar, "cal-avatar-fallback")} aria-hidden>
              {initial}
            </span>
          ) : null}
          {!guest ? (
            <p className={ui.streak} data-testid="day-streak">
              {streak} day streak
            </p>
          ) : null}
          <WriteKebab />
        </div>
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
              data-word-count={
                day.mark === "strike" ? "high" : day.mark === "spare" ? "medium" : day.mark === "dot" ? "low" : undefined
              }
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
