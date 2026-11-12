const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const shortDate = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
});

const longDate = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const mediumDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatNaira(amount: number): string {
  return nairaFormatter.format(Number.isFinite(amount) ? amount : 0);
}

export function formatDateShort(value: string | Date): string {
  return shortDate.format(new Date(value));
}

/** "16 Sep 2026" — the way dates read in the deck's search card. */
export function formatDateMedium(value: string | Date): string {
  return mediumDate.format(new Date(value));
}

export function formatDateLong(value: string | Date): string {
  return longDate.format(new Date(value));
}

export function formatDateRange(start: string | Date, end: string | Date): string {
  const a = new Date(start);
  const b = new Date(end);

  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) {
    return "";
  }

  const sameYear = a.getFullYear() === b.getFullYear();
  const sameMonth = sameYear && a.getMonth() === b.getMonth();
  const aDay = a.getDate();
  const bDay = b.getDate();
  const aMonth = shortDate.format(a).split(" ")[1];
  const bMonth = shortDate.format(b).split(" ")[1];

  if (sameMonth) {
    return `${aDay} – ${bDay} ${aMonth} ${a.getFullYear()}`;
  }

  if (sameYear) {
    return `${aDay} ${aMonth} – ${bDay} ${bMonth} ${a.getFullYear()}`;
  }

  return `${formatDateShort(a)} ${a.getFullYear()} – ${formatDateShort(b)} ${b.getFullYear()}`;
}

export function nightsBetween(checkIn: string | Date, checkOut: string | Date): number {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.max(0, Math.round((end - start) / 86_400_000));
}

export function guestsLabel(adults: number, children = 0): string {
  const adultPart = `${adults} ${adults === 1 ? "adult" : "adults"}`;
  if (!children) return adultPart;
  return `${adultPart} · ${children} ${children === 1 ? "child" : "children"}`;
}

const RATING_LABELS: Array<[number, string]> = [
  [9, "Exceptional"],
  [8, "Excellent"],
  [7, "Very good"],
  [6, "Good"],
  [0, "Pleasant"],
];

export function ratingLabel(score: number): string {
  return RATING_LABELS.find(([min]) => score >= min)?.[1] ?? "Pleasant";
}

export function compactNumber(value: number): string {
  return new Intl.NumberFormat("en-NG").format(value);
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
