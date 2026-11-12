"use client";

import { SORT_OPTIONS } from "@/lib/constants";
import type { SortOption } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/select";

export interface ResultsHeaderProps {
  count: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  destination?: string;
  className?: string;
}

export function ResultsHeader({
  count,
  sort,
  onSortChange,
  destination,
  className,
}: ResultsHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <h1 className="text-h2 font-semibold text-ocean">
          {count.toLocaleString("en-NG")}{" "}
          {count === 1 ? "property" : "properties"} found
        </h1>
        <p className="mt-1 text-secondary text-charcoal/75">
          {destination ? `Stays in ${destination}` : "Stays in Jos, Plateau State"}
          {" · "}Prices include taxes and fees
        </p>
      </div>

      <label className="flex items-center gap-2 text-secondary text-charcoal/75">
        <span className="shrink-0">Sort by</span>
        <Select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          className="min-w-44"
          aria-label="Sort results"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
}
