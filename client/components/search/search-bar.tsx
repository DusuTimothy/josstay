"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { GUEST_OPTIONS } from "@/lib/constants";
import { todayISO } from "@/lib/format";
import type { SearchValues } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DateField } from "./date-field";

export interface SearchBarProps {
  defaultDestination?: string;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
  defaultGuestsIndex?: number;
  onSubmit?: (values: SearchValues) => void;
  className?: string;
}

export function SearchBar({
  defaultDestination = "",
  defaultCheckIn = "",
  defaultCheckOut = "",
  defaultGuestsIndex = 1,
  onSubmit,
  className,
}: SearchBarProps) {
  const [destination, setDestination] = useState(defaultDestination);
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guestsIndex, setGuestsIndex] = useState(defaultGuestsIndex);
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const guests = GUEST_OPTIONS[guestsIndex] ?? GUEST_OPTIONS[1];
    const values: SearchValues = {
      destination,
      checkIn,
      checkOut,
      adults: guests.adults,
      children: guests.children,
    };

    if (onSubmit) {
      onSubmit(values);
      return;
    }

    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("adults", String(guests.adults));
    params.set("children", String(guests.children));
    router.push(`/search?${params.toString()}`);
  }

  const fieldClass =
    "flex flex-col justify-center rounded-md px-3 py-2 transition-colors hover:bg-sage-soft/40 focus-within:bg-sage-soft/40 md:border-r md:border-sand/70 md:last:border-r-0";

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        "rounded-xl border border-sand bg-white p-2 shadow-large sm:p-2.5",
        className,
      )}
    >
      <div className="grid gap-1 md:grid-cols-[1.4fr_1fr_1fr_0.9fr_auto] md:items-stretch">
        <label className={fieldClass}>
          <span className="block text-metadata font-semibold text-charcoal">
            Destination
          </span>
          <input
            type="text"
            name="destination"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="Where are you going?"
            autoComplete="off"
            className="mt-0.5 w-full min-w-0 bg-transparent text-secondary font-semibold text-charcoal outline-none placeholder:font-normal placeholder:text-charcoal/60"
          />
        </label>

        <div className={fieldClass}>
          <span className="block text-metadata font-semibold text-charcoal">
            Check-in
          </span>
          <DateField
            id="search-check-in"
            name="checkIn"
            value={checkIn}
            min={todayISO()}
            onChange={setCheckIn}
            className="mt-0.5"
          />
        </div>

        <div className={fieldClass}>
          <span className="block text-metadata font-semibold text-charcoal">
            Check-out
          </span>
          <DateField
            id="search-check-out"
            name="checkOut"
            value={checkOut}
            min={checkIn || todayISO()}
            onChange={setCheckOut}
            className="mt-0.5"
          />
        </div>

        <div className={fieldClass}>
          <span className="block text-metadata font-semibold text-charcoal">
            Guests
          </span>
          <div className="relative mt-0.5 flex items-center">
            <select
              name="guests"
              value={guestsIndex}
              onChange={(event) => setGuestsIndex(Number(event.target.value))}
              className="w-full min-w-0 appearance-none bg-transparent pr-6 text-secondary font-semibold text-charcoal outline-none"
            >
              {GUEST_OPTIONS.map((option, index) => (
                <option key={option.label} value={index}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-0 size-4 text-charcoal/50"
              aria-hidden="true"
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="min-h-12 md:h-auto md:self-stretch md:px-6"
        >
          <Search aria-hidden="true" />
          Search
        </Button>
      </div>
    </form>
  );
}
