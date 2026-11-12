import type {
  BookingQuote,
  HotelDetail,
  HotelSummary,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

async function readEnvelope<T>(response: Response): Promise<ApiEnvelope<T>> {
  const payload = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | null;

  if (!response.ok || !payload?.success) {
    throw new ApiRequestError(
      response.status,
      payload?.message ?? `The API returned ${response.status}.`,
    );
  }

  return payload;
}

async function getJson<T>(
  path: string,
  searchParams?: URLSearchParams,
  revalidate = 0,
): Promise<ApiEnvelope<T>> {
  const url = new URL(`${API_BASE}${path}`);
  if (searchParams) url.search = searchParams.toString();

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    ...(revalidate > 0
      ? { next: { revalidate } }
      : { cache: "no-store" as const }),
  });

  return readEnvelope<T>(response);
}

export async function fetchFeaturedHotels(): Promise<HotelSummary[]> {
  const payload = await getJson<HotelSummary[]>("/hotels", undefined, 60);
  return payload.data;
}

export async function fetchHotel(
  slug: string,
): Promise<HotelDetail | null> {
  const url = `${API_BASE}/hotels/${encodeURIComponent(slug)}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (response.status === 404) return null;

  const payload = await readEnvelope<HotelDetail>(response);
  return payload.data;
}

export interface SearchResultPage {
  hotels: HotelSummary[];
  total: number;
  page: number;
  limit: number;
}

export async function fetchSearchResults(
  searchParams: URLSearchParams,
): Promise<SearchResultPage> {
  const payload = await getJson<HotelSummary[]>("/search", searchParams);

  return {
    hotels: payload.data,
    total: payload.meta?.total ?? payload.data.length,
    page: payload.meta?.page ?? 1,
    limit: payload.meta?.limit ?? payload.data.length,
  };
}

export interface QuoteInput {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
}

export async function fetchQuote(input: QuoteInput): Promise<BookingQuote> {
  const response = await fetch(`${API_BASE}/bookings/quote`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  const payload = await readEnvelope<BookingQuote>(response);
  return payload.data;
}
