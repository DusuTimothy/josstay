import {
  AMENITIES,
  DEFAULT_SEARCH_FILTERS,
  GUEST_OPTIONS,
  PRICE_MAX,
} from "./constants";
import type {
  AmenityKey,
  SearchFilters,
  SortOption,
} from "./types";
import { parseStayQuery, type StayQuery } from "./stay";

export interface SearchState extends StayQuery {
  destination: string;
  filters: SearchFilters;
}

const SORT_VALUES: SortOption[] = [
  "recommended",
  "price_asc",
  "price_desc",
  "rating",
];

function firstValue(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function readNumber(
  value: string | string[] | undefined,
  fallback: number,
  min: number,
  max: number,
): number {
  const parsed = Number(firstValue(value));

  if (!Number.isFinite(parsed)) return fallback;

  return Math.min(max, Math.max(min, parsed));
}

function readCsv(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(",") : value;
  if (!raw) return [];

  return Array.from(
    new Set(
      raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function readBoolean(value: string | string[] | undefined): boolean {
  return firstValue(value) === "true";
}

export function parseSearchState(
  searchParams: Record<string, string | string[] | undefined>,
): SearchState {
  const stay = parseStayQuery(searchParams);

  const minPrice = readNumber(
    searchParams.minPrice,
    DEFAULT_SEARCH_FILTERS.minPrice,
    0,
    PRICE_MAX,
  );
  const maxPrice = readNumber(
    searchParams.maxPrice,
    DEFAULT_SEARCH_FILTERS.maxPrice,
    minPrice,
    PRICE_MAX,
  );

  const requestedSort = firstValue(searchParams.sort) as SortOption | undefined;
  const sort =
    requestedSort && SORT_VALUES.includes(requestedSort)
      ? requestedSort
      : DEFAULT_SEARCH_FILTERS.sort;

  const amenityKeys = new Set(Object.keys(AMENITIES));

  return {
    ...stay,
    destination: firstValue(searchParams.destination)?.trim() ?? "",
    filters: {
      destination: firstValue(searchParams.destination)?.trim() ?? "",
      minPrice,
      maxPrice,
      minRating: readNumber(
        searchParams.minRating,
        DEFAULT_SEARCH_FILTERS.minRating,
        0,
        10,
      ),
      propertyTypes: readCsv(searchParams.propertyTypes),
      amenities: readCsv(searchParams.amenities).filter((value) =>
        amenityKeys.has(value),
      ) as AmenityKey[],
      breakfastIncluded: readBoolean(searchParams.breakfastIncluded),
      freeCancellation: readBoolean(searchParams.freeCancellation),
      maxDistanceKm: readNumber(
        searchParams.maxDistanceKm,
        DEFAULT_SEARCH_FILTERS.maxDistanceKm,
        0,
        100,
      ),
      sort,
    },
  };
}

/**
 * Build the canonical search URL. Defaults are omitted so shared links stay
 * short, and arrays are comma-separated so the Express validator can parse
 * both forms.
 */
export function buildSearchParams(state: SearchState): URLSearchParams {
  const params = new URLSearchParams();
  const { filters, destination } = state;

  if (destination) params.set("destination", destination);

  params.set("checkIn", state.checkIn);
  params.set("checkOut", state.checkOut);
  params.set("adults", String(state.adults));
  params.set("children", String(state.children));

  if (filters.minPrice > 0) {
    params.set("minPrice", String(filters.minPrice));
  }
  if (filters.maxPrice < PRICE_MAX) {
    params.set("maxPrice", String(filters.maxPrice));
  }
  if (filters.minRating > 0) {
    params.set("minRating", String(filters.minRating));
  }
  if (filters.propertyTypes.length > 0) {
    params.set("propertyTypes", filters.propertyTypes.join(","));
  }
  if (filters.amenities.length > 0) {
    params.set("amenities", filters.amenities.join(","));
  }
  if (filters.breakfastIncluded) {
    params.set("breakfastIncluded", "true");
  }
  if (filters.freeCancellation) {
    params.set("freeCancellation", "true");
  }
  if (filters.maxDistanceKm > 0) {
    params.set("maxDistanceKm", String(filters.maxDistanceKm));
  }
  if (filters.sort !== "recommended") {
    params.set("sort", filters.sort);
  }

  return params;
}

/** Keep the guest dropdown in sync with URL guest counts. */
export function guestOptionIndex(adults: number, children: number): number {
  const index = GUEST_OPTIONS.findIndex(
    (option) => option.adults === adults && option.children === children,
  );

  return index === -1 ? 1 : index;
}

export function parseRooms(
  value: string | string[] | undefined,
  fallback = 1,
): number {
  return readNumber(value, fallback, 1, 5);
}
