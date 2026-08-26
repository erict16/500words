"use client";

import { cx, ui } from "@/lib/css";
import { isLocalUid } from "@/lib/identity";
import { monthAbbr, prettyLongDate, shiftMonth } from "@/lib/dates";
import { dayFillColor, dayWordBand } from "@/lib/words";
import { useApp } from "./AppProvider";
import { useWriteFocus } from "./WriteFocus";

/** Live 750: span.today-checkmark / .patched-checkmark with ✔ #fff 14px */
export function DayCheck() {
  return (
    <span className={cx(ui.dayCheck, "today-checkmark")} aria-hidden>
      ✔
    </span>
  );
}

/** mdi-fullscreen — live EntryBrowser .focus-toggle-btn */
const MDI_FULLSCREEN =
  "M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z";

function FocusToggle() {
  const { toggleFocus } = useWriteFocus();
  return (
    <button
      type="button"
      className={cx(ui.focusToggle, "ml-2")}
      data-testid="focus-toggle"
      title="Enter focus mode (F11)"
      aria-label="Enter focus mode"
      onClick={toggleFocus}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
        <path fill="currentColor" d={MDI_FULLSCREEN} />
      </svg>
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
              ◄ {monthAbbr(prev)}
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
