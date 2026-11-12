"use client";

import { useMemo, useState } from "react";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { DEFAULT_SEARCH_FILTERS } from "@/lib/constants";
import type { HotelSummary, SearchFilters } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { HotelCard } from "@/components/hotel/hotel-card";
import { FilterPanel } from "@/components/search/filter-panel";
import { ResultsHeader } from "@/components/search/results-header";

export interface SearchResultsProps {
  hotels: HotelSummary[];
  initialFilters?: Partial<SearchFilters>;
  destination?: string;
}

export function SearchResults({
  hotels,
  initialFilters,
  destination,
}: SearchResultsProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    ...DEFAULT_SEARCH_FILTERS,
    ...initialFilters,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const results = useMemo(() => {
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
  }, [hotels, filters]);

  function patchFilters(next: SearchFilters) {
    setFilters(next);
    setMobileFiltersOpen(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
      <div className="hidden lg:block">
        <FilterPanel
          resultCount={results.length}
          value={filters}
          onApply={patchFilters}
          onClear={() => setFilters(DEFAULT_SEARCH_FILTERS)}
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
              resultCount={results.length}
              value={filters}
              onApply={patchFilters}
              onClear={() => setFilters(DEFAULT_SEARCH_FILTERS)}
              className="mt-3"
            />
          ) : null}
        </div>

        <ResultsHeader
          count={results.length}
          sort={filters.sort}
          onSortChange={(sort) =>
            setFilters((current) => ({ ...current, sort }))
          }
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
              <Button
                type="button"
                variant="ghost"
                onClick={() => setFilters(DEFAULT_SEARCH_FILTERS)}
              >
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
