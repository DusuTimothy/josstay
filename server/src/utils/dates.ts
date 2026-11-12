export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  const end = Date.parse(`${checkOut}T00:00:00Z`);

  if (Number.isNaN(start) || Number.isNaN(end)) return 0;

  return Math.max(0, Math.round((end - start) / 86_400_000));
}

export function isPastDate(value: string): boolean {
  const date = Date.parse(`${value}T23:59:59Z`);
  return Number.isNaN(date) || date < Date.now();
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

/**
 * Last day a guest can cancel for free, as `YYYY-MM-DD`.
 * Strict rooms are non-refundable. Adjust these windows when the hotel
 * agreement is finalised.
 */
export function cancellationDeadline(
  checkIn: string,
  policy: "flexible" | "moderate" | "strict",
): string | null {
  if (policy === "strict") return null;

  const daysBefore = policy === "flexible" ? 1 : 3;
  const date = new Date(`${checkIn}T15:00:00Z`);
  date.setUTCDate(date.getUTCDate() - daysBefore);

  return date.toISOString().slice(0, 10);
}
