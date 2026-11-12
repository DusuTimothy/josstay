"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import { GUEST_OPTIONS } from "@/lib/constants";
import { todayISO } from "@/lib/format";
import type { SearchValues } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    "flex flex-col justify-center rounded-md border border-transparent px-3 py-2 transition-colors hover:border-sand focus-within:border-sand focus-within:bg-white";

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        "rounded-xl border border-sand bg-white p-2 shadow-large sm:p-2.5",
        className,
      )}
    >
      <div className="grid gap-1 md:grid-cols-[1.5fr_1fr_1fr_0.9fr_auto] md:items-stretch">
        <label className={fieldClass}>
          <span className="text-metadata font-medium text-charcoal/60">
            Where are you going?
          </span>
          <span className="mt-1 flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-sage" aria-hidden="true" />
            <input
              type="text"
              name="destination"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="Jos, Nigeria"
              autoComplete="off"
              className="min-w-0 w-full bg-transparent text-secondary font-medium text-charcoal outline-none placeholder:text-charcoal/40"
            />
          </span>
        </label>

        <label className={fieldClass}>
          <span className="text-metadata font-medium text-charcoal/60">
            Check-in
          </span>
          <span className="mt-1 flex items-center gap-2">
            <CalendarDays
              className="size-4 shrink-0 text-sage"
              aria-hidden="true"
            />
            <input
              type="date"
              name="checkIn"
              value={checkIn}
              min={todayISO()}
              onChange={(event) => setCheckIn(event.target.value)}
              className="min-w-0 w-full bg-transparent text-secondary font-medium text-charcoal outline-none"
            />
          </span>
        </label>

        <label className={fieldClass}>
          <span className="text-metadata font-medium text-charcoal/60">
            Check-out
          </span>
          <span className="mt-1 flex items-center gap-2">
            <CalendarDays
              className="size-4 shrink-0 text-sage"
              aria-hidden="true"
            />
            <input
              type="date"
              name="checkOut"
              value={checkOut}
              min={checkIn || todayISO()}
              onChange={(event) => setCheckOut(event.target.value)}
              className="min-w-0 w-full bg-transparent text-secondary font-medium text-charcoal outline-none"
            />
          </span>
        </label>

        <label className={fieldClass}>
          <span className="text-metadata font-medium text-charcoal/60">
            Guests
          </span>
          <span className="mt-1 flex items-center gap-2">
            <Users className="size-4 shrink-0 text-sage" aria-hidden="true" />
            <select
              name="guests"
              value={guestsIndex}
              onChange={(event) => setGuestsIndex(Number(event.target.value))}
              className="min-w-0 w-full appearance-none bg-transparent text-secondary font-medium text-charcoal outline-none"
            >
              {GUEST_OPTIONS.map((option, index) => (
                <option key={option.label} value={index}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
        </label>

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
