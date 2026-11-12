import { todayISO } from "./format";

export interface StayQuery {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

function firstValue(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(`${value}T12:00:00Z`));
}

/** Add days to an ISO date, always returning `YYYY-MM-DD`. */
export function addDaysIso(value: string, days: number): string {
  const date = new Date(`${value}T12:00:00Z`);

  if (Number.isNaN(date.getTime())) return value;

  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function defaultStay(): StayQuery {
  const checkIn = addDaysIso(todayISO(), 1);

  return {
    checkIn,
    checkOut: addDaysIso(checkIn, 3),
    adults: 2,
    children: 0,
  };
}

function clampInteger(
  value: string | undefined,
  min: number,
  max: number,
  fallback: number,
): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed)) return fallback;

  return Math.min(max, Math.max(min, parsed));
}

/**
 * Read dates and guest counts from the URL, falling back to sensible defaults
 * when they are missing, in the past or out of order.
 */
export function parseStayQuery(
  searchParams: Record<string, string | string[] | undefined>,
): StayQuery {
  const fallback = defaultStay();
  const today = todayISO();

  const requestedCheckIn = firstValue(searchParams.checkIn);
  const checkIn =
    isIsoDate(requestedCheckIn) && requestedCheckIn >= today
      ? requestedCheckIn
      : fallback.checkIn;

  const requestedCheckOut = firstValue(searchParams.checkOut);
  const checkOut =
    isIsoDate(requestedCheckOut) && requestedCheckOut > checkIn
      ? requestedCheckOut
      : addDaysIso(checkIn, 3);

  return {
    checkIn,
    checkOut,
    adults: clampInteger(
      firstValue(searchParams.adults),
      1,
      16,
      fallback.adults,
    ),
    children: clampInteger(
      firstValue(searchParams.children),
      0,
      8,
      fallback.children,
    ),
  };
}
