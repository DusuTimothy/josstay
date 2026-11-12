"use client";

import { useRef } from "react";
import { formatDateMedium } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface DateFieldProps {
  id: string;
  name: string;
  value: string;
  min?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * A date input that reads the way the deck does — "16 Sep 2026" — while
 * keeping the platform date picker underneath for choosing the day.
 */
export function DateField({
  id,
  name,
  value,
  min,
  placeholder = "Add date",
  onChange,
  className,
}: DateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        "relative rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ocean/20",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="block truncate text-secondary font-semibold text-charcoal"
      >
        {value ? formatDateMedium(value) : placeholder}
      </span>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="date"
        value={value}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}
