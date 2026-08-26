"use client";

import { cx, ui } from "@/lib/css";
import { isLocalUid } from "@/lib/identity";
import { monthAbbr, prettyLongDate, shiftMonth } from "@/lib/dates";
import { dayFillColor, dayWordBand } from "@/lib/words";
import { useApp } from "./AppProvider";
import { useWriteFocus } from "./WriteFocus";
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

function FocusToggle() {
  const { focusMode, toggleFocus } = useWriteFocus();
  return (
    <button
      type="button"
      className={ui.focusToggle}
      data-testid="focus-toggle"
      title={focusMode ? "Exit focus mode (F11 or ESC)" : "Enter focus mode (F11)"}
      aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"}
      aria-pressed={focusMode}
      onClick={toggleFocus}
    >
      {focusMode ? (
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
          <path
            fill="currentColor"
            d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
          <path
            fill="currentColor"
            d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
          />
        </svg>
      )}
    </button>
  );
}

export function MonthGrid() {
  const { date, today, monthDays, setDate, lifetime, profile } = useApp();
  const prev = shiftMonth(date, -1);
  const next = shiftMonth(date, 1);
  const showNext = next.slice(0, 7) <= today.slice(0, 7);
  const guest = isLocalUid(profile?.uid);
  const streak = lifetime?.currentStreak ?? 0;
  const photo = !guest && profile?.photoURL ? profile.photoURL : "";
  const initial = !guest ? (profile?.displayName || "?").trim().slice(0, 1) : "";

  return (
    <div className={ui.head}>
      <h1 className={cx(ui.date, "title-input font-serif")} data-testid="write-date">
        {prettyLongDate(date)}
      </h1>
      <div className="entry-browser-section">
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
            {showNext ? (
              <>
                <span className={ui.calSep}>|</span>
                <button type="button" className={ui.calMonth} onClick={() => setDate(next)}>
                  {monthAbbr(next)} ►
                </button>
              </>
            ) : null}
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
            <FocusToggle />
            <WriteKebab />
          </div>
        </div>
        <div className={ui.monthGrid} data-testid="month-grid">
          {monthDays.map((day) => {
            const future = day.date > today;
            const selected = day.date === date;
            const fill = dayFillColor(day.wordCount);
            const band = dayWordBand(day.wordCount);
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
                data-word-count={band}
                data-testid={day.date === today ? "today-box" : undefined}
                disabled={future}
                title={future ? day.date : `${day.date}: ${day.wordCount} words`}
                onClick={() => setDate(day.date)}
                aria-label={`Day ${day.day}${day.mark === "strike" ? ", done" : ""}`}
                aria-current={selected ? "date" : undefined}
                style={fill ? { backgroundColor: fill, fontWeight: 700 } : undefined}
              >
                {day.mark === "strike" ? <DayCheck /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
