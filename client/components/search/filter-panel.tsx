"use client";

import { useState, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  AMENITIES,
  DEFAULT_SEARCH_FILTERS,
  PRICE_MAX,
  PROPERTY_TYPES,
  RATING_FILTERS,
} from "@/lib/constants";
import { formatNaira } from "@/lib/format";
import type { AmenityKey, SearchFilters } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

export interface FilterPanelProps {
  id?: string;
  resultCount: number;
  value?: Partial<SearchFilters>;
  onApply?: (filters: SearchFilters) => void;
  onClear?: () => void;
  className?: string;
}

export function FilterPanel({
  id,
  resultCount,
  value,
  onApply,
  onClear,
  className,
}: FilterPanelProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    ...DEFAULT_SEARCH_FILTERS,
    ...value,
  });

  function patch(partial: Partial<SearchFilters>) {
    setFilters((current) => ({ ...current, ...partial }));
  }

  function toggleArrayValue<T extends string>(list: T[], item: T): T[] {
    return list.includes(item)
      ? list.filter((entry) => entry !== item)
      : [...list, item];
  }

  function handleClear() {
    setFilters(DEFAULT_SEARCH_FILTERS);
    onClear?.();
  }

  return (
    <aside
      id={id}
      aria-label="Filter results"
      className={cn(
        "rounded-lg border border-sand bg-white p-5 shadow-soft",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-sand pb-4">
        <h2 className="flex items-center gap-2 text-secondary font-semibold text-ocean">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filters
        </h2>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-sm text-metadata font-medium text-charcoal/60 underline-offset-4 transition-colors hover:text-ocean hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
        >
          Clear all
        </button>
      </div>

      <FilterSection title="Price per night">
        <div className="flex items-center justify-between text-secondary text-charcoal">
          <span>{formatNaira(0)}</span>
          <span className="font-semibold text-ocean">
            {formatNaira(filters.maxPrice)}
            {filters.maxPrice >= PRICE_MAX ? "+" : ""}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={PRICE_MAX}
          step={10_000}
          value={filters.maxPrice}
          onChange={(event) =>
            patch({ maxPrice: Number(event.target.value) })
          }
          aria-label="Maximum price per night"
          className="mt-2 w-full cursor-pointer accent-ocean"
        />
      </FilterSection>

      <FilterSection title="Guest rating">
        <div className="flex flex-wrap gap-1.5">
          {RATING_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filters.minRating === option.value}
              onClick={() => patch({ minRating: option.value })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-metadata font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                filters.minRating === option.value
                  ? "border-ocean bg-ocean text-ivory"
                  : "border-sand bg-white text-charcoal hover:border-sage",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Property type">
        <div className="space-y-2.5">
          {PROPERTY_TYPES.map((type) => (
            <Checkbox
              key={type}
              label={type}
              checked={filters.propertyTypes.includes(type)}
              onChange={() =>
                patch({
                  propertyTypes: toggleArrayValue(
                    filters.propertyTypes,
                    type,
                  ),
                })
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Amenities">
        <div className="grid grid-cols-1 gap-2.5">
          {(Object.entries(AMENITIES) as Array<[AmenityKey, string]>).map(
            ([key, label]) => (
              <Checkbox
                key={key}
                label={label}
                checked={filters.amenities.includes(key)}
                onChange={() =>
                  patch({
                    amenities: toggleArrayValue(filters.amenities, key),
                  })
                }
              />
            ),
          )}
        </div>
      </FilterSection>

      <FilterSection title="Good to know">
        <div className="space-y-4">
          <Toggle
            label="Breakfast included"
            checked={filters.breakfastIncluded}
            onCheckedChange={(checked) =>
              patch({ breakfastIncluded: checked })
            }
          />
          <Toggle
            label="Free cancellation"
            checked={filters.freeCancellation}
            onCheckedChange={(checked) =>
              patch({ freeCancellation: checked })
            }
          />
        </div>
      </FilterSection>

      <FilterSection title="Distance from centre">
        <Select
          value={filters.maxDistanceKm}
          onChange={(event) =>
            patch({ maxDistanceKm: Number(event.target.value) })
          }
          aria-label="Maximum distance from centre"
        >
          <option value={0}>Any distance</option>
          <option value={1}>Within 1 km</option>
          <option value={3}>Within 3 km</option>
          <option value={5}>Within 5 km</option>
          <option value={10}>Within 10 km</option>
        </Select>
      </FilterSection>

      <Button
        type="button"
        fullWidth
        className="mt-5"
        onClick={() => onApply?.(filters)}
      >
        Show {resultCount.toLocaleString("en-NG")} results
      </Button>
    </aside>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-sand py-4 last:border-b-0">
      <h3 className="mb-3 text-metadata font-semibold uppercase tracking-[0.1em] text-charcoal/65">
        {title}
      </h3>
      {children}
    </section>
  );
}
