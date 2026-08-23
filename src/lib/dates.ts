export function todayInZone(timeZone: string, now = new Date()): string {
  return formatDateInZone(now, timeZone);
}

export function formatDateInZone(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

export function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function parseDate(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month, day };
}

export function addDays(dateStr: string, delta: number): string {
  const { year, month, day } = parseDate(dateStr);
  const date = new Date(Date.UTC(year, month - 1, day + delta));
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function monthLabel(dateStr: string): string {
  const { year, month } = parseDate(dateStr);
  return new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function isFutureDay(dateStr: string, today: string): boolean {
  return dateStr > today;
}

export function hourInZone(timeZone: string, now = new Date()): number {
  const hour = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    hour12: false,
  }).format(now);
  return Number.parseInt(hour, 10) % 24;
}

export function shiftMonth(dateStr: string, delta: number): string {
  const { year, month } = parseDate(dateStr);
  const d = new Date(year, month - 1 + delta, 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}

export function datesInMonth(yearMonth: string): string[] {
  const [year, month] = yearMonth.split("-").map(Number);
  const count = daysInMonth(year, month - 1);
  return Array.from({ length: count }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    return `${yearMonth}-${day}`;
  });
}
