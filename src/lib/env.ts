export function isE2E(): boolean {
  return process.env.NEXT_PUBLIC_E2E === "1";
}
