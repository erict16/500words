export const FIRST_WEEK_TIPS = [
  "Don’t stop to edit. Keep the fingers moving.",
  "Nobody reads this but you.",
  "If you’re stuck, type “I don’t know what to write” until you do.",
  "Write like you’re talking to someone who already likes you.",
  "Lists, rants, dreams, leftover thoughts. All of it counts.",
  "You can be boring. Boring is how you get to the good stuff.",
  "Tomorrow you get a blank page. This one doesn’t have to be useful.",
];

export function tipForAccountDay(daysWithAccount: number): string | null {
  if (daysWithAccount < 1 || daysWithAccount > 7) return null;
  return FIRST_WEEK_TIPS[daysWithAccount - 1] ?? null;
}
