"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { DEFAULT_SEARCH_FILTERS } from "@/lib/constants";
import { buildSearchParams } from "@/lib/search";
import type { StayQuery } from "@/lib/stay";
import type { HotelSummary, SearchFilters } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { HotelCard } from "@/components/hotel/hotel-card";
import { FilterPanel } from "@/components/search/filter-panel";
import { ResultsHeader } from "@/components/search/results-header";

export interface SearchResultsProps {
  hotels: HotelSummary[];
  total: number;
  initialFilters?: Partial<SearchFilters>;
  destination?: string;
  stay: StayQuery;
  /**
   * The sample fallback cannot ask the server to filter, so it filters in the
   * browser. Live API results are already filtered and paginated.
   */
  applyLocalFilters?: boolean;
}

export function SearchResults({
  hotels,
  total,
  initialFilters,
  destination,
  stay,
  applyLocalFilters = false,
}: SearchResultsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<SearchFilters>({
    ...DEFAULT_SEARCH_FILTERS,
    ...initialFilters,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const results = useMemo(() => {
    if (!applyLocalFilters) return hotels;

    const filtered = hotels.filter((hotel) => {
      if (hotel.pricePerNight < filters.minPrice) return false;
      if (hotel.pricePerNight > filters.maxPrice) return false;
      if (hotel.rating < filters.minRating) return false;
      if (filters.breakfastIncluded && !hotel.breakfastIncluded) return false;
      if (
        filters.freeCancellation &&
        hotel.cancellationPolicy === "strict"
      ) {
        return false;
      }
      if (
        filters.maxDistanceKm > 0 &&
        hotel.distanceKm > filters.maxDistanceKm
      ) {
        return false;
      }
      if (
        !filters.amenities.every((amenity) =>
          hotel.amenities.includes(amenity),
        )
      ) {
        return false;
      }
      if (
        filters.destination &&
        !`${hotel.name} ${hotel.area} ${hotel.city}`
          .toLowerCase()
          .includes(filters.destination.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (filters.sort) {
        case "price_asc":
          return a.pricePerNight - b.pricePerNight;
        case "price_desc":
          return b.pricePerNight - a.pricePerNight;
        case "rating":
          return b.rating - a.rating;
        default:
          return b.reviewCount - a.reviewCount;
      }
    });
  }, [applyLocalFilters, filters, hotels]);

  const count = applyLocalFilters ? results.length : total;

  function navigate(next: SearchFilters) {
    const params = buildSearchParams({
      ...stay,
      destination: next.destination,
      filters: next,
    });

    startTransition(() => {
      router.push(`/search?${params.toString()}`, { scroll: false });
    });
  }

  function handleApply(next: SearchFilters) {
    setFilters(next);
    setMobileFiltersOpen(false);
    navigate(next);
  }

  function handleClear() {
    const next = { ...DEFAULT_SEARCH_FILTERS };
    setFilters(next);
    setMobileFiltersOpen(false);
    navigate(next);
  }

  function handleSort(sort: SearchFilters["sort"]) {
    const next = { ...filters, sort };
    setFilters(next);
    navigate(next);
  }

  return (
    <div
      className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start"
      aria-busy={isPending}
    >
      <div className="hidden lg:block">
        <FilterPanel
          resultCount={count}
          value={filters}
          onApply={handleApply}
          onClear={handleClear}
          className="sticky top-24"
        />
      </div>

      <div className="min-w-0">
        <div className="lg:hidden">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setMobileFiltersOpen((open) => !open)}
            aria-expanded={mobileFiltersOpen}
            aria-controls="mobile-filters"
          >
            <SlidersHorizontal aria-hidden="true" />
            Filters
          </Button>
          {mobileFiltersOpen ? (
            <FilterPanel
              id="mobile-filters"
              resultCount={count}
              value={filters}
              onApply={handleApply}
              onClear={handleClear}
              className="mt-3"
            />
          ) : null}
        </div>

        <ResultsHeader
          count={count}
          sort={filters.sort}
          onSortChange={handleSort}
          destination={destination}
          className="mt-5 lg:mt-0"
        />

        {results.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={SearchX}
            title="No stays match those filters"
            description="Try widening your price range or removing an amenity. Jos has more to offer than this."
            action={
              <Button type="button" variant="ghost" onClick={handleClear}>
                Clear all filters
              </Button>
            }
            className="mt-6"
          />
        )}
      </div>
    </div>
  );
}
