"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import {
  AMENITIES,
  DEFAULT_SEARCH_FILTERS,
  PRICE_MAX,
  PROPERTY_TYPES,
} from "@/lib/constants";
import { formatNaira } from "@/lib/format";
import type { AmenityKey, SearchFilters } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

const RATING_OPTIONS = [
  { value: 9, label: "9+" },
  { value: 8, label: "8+" },
  { value: 7, label: "7+" },
  { value: 6, label: "6+" },
  { value: 0, label: "Any" },
];

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

  const minPrice = Math.min(filters.minPrice, filters.maxPrice);

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
        <h2 className="text-secondary font-semibold text-ocean">Filters</h2>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-sm text-metadata font-medium text-charcoal/75 underline-offset-4 transition-colors hover:text-ocean hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
        >
          Clear all
        </button>
      </div>

      <FilterSection title="Price range">
        <div className="flex items-center justify-between text-metadata text-charcoal/75">
          <span>{formatNaira(minPrice)}</span>
          <span>
            {formatNaira(filters.maxPrice)}
            {filters.maxPrice >= PRICE_MAX ? "+" : ""}
          </span>
        </div>
        <PriceRange
          min={minPrice}
          max={filters.maxPrice}
          onChange={(nextMin, nextMax) =>
            patch({ minPrice: nextMin, maxPrice: nextMax })
          }
        />
      </FilterSection>

      <FilterSection title="Guest rating">
        <div className="flex flex-wrap gap-1.5">
          {RATING_OPTIONS.map((option) => (
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

      <CollapsibleSection title="Property type">
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
      </CollapsibleSection>

      <CollapsibleSection title="Amenities">
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
      </CollapsibleSection>

      <div className="border-b border-sand py-4">
        <Toggle
          label="Breakfast included"
          checked={filters.breakfastIncluded}
          onCheckedChange={(checked) => patch({ breakfastIncluded: checked })}
        />
      </div>

      <div className="border-b border-sand py-4">
        <Toggle
          label="Free cancellation"
          checked={filters.freeCancellation}
          onCheckedChange={(checked) => patch({ freeCancellation: checked })}
        />
      </div>

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

/**
 * Two thumbs on one track. The inputs sit on top of each other and only the
 * thumbs take pointer events, so each end can be dragged independently.
 */
function PriceRange({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const step = 10_000;
  const percent = (value: number) => (value / PRICE_MAX) * 100;

  const thumb =
    "pointer-events-none absolute inset-x-0 top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ocean [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ocean [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-soft";

  return (
    <div className="relative mt-3 h-5">
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-sand" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-ocean"
        style={{
          left: `${percent(min)}%`,
          right: `${100 - percent(max)}%`,
        }}
      />
      <input
        type="range"
        min={0}
        max={PRICE_MAX}
        step={step}
        value={min}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), max);
          onChange(value, max);
        }}
        aria-label="Minimum price per night"
        className={thumb}
      />
      <input
        type="range"
        min={0}
        max={PRICE_MAX}
        step={step}
        value={max}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), min);
          onChange(min, value);
        }}
        aria-label="Maximum price per night"
        className={cn(thumb, "z-10")}
      />
    </div>
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
      <h3 className="mb-3 text-secondary font-semibold text-charcoal">
        {title}
      </h3>
      {children}
    </section>
  );
}

function CollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="border-b border-sand py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-sm text-left text-secondary font-semibold text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
      >
        {title}
        <ChevronDown
          className={cn(
            "size-4 text-charcoal/60 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      {open ? <div className="mt-3">{children}</div> : null}
    </section>
  );
}
