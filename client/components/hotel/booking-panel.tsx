"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { formatDateLong, formatDateRange, formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

export interface BookingPanelProps {
  checkIn: string;
  checkOut: string;
  guestsLabel: string;
  roomName: string;
  nights: number;
  pricePerNight: number;
  total: number;
  freeCancellationUntil?: string;
  onReserve?: () => void;
  reserveHref?: string;
  isLoading?: boolean;
  reserveDisabled?: boolean;
  className?: string;
}

export function BookingPanel({
  checkIn,
  checkOut,
  guestsLabel,
  roomName,
  nights,
  pricePerNight,
  total,
  freeCancellationUntil,
  onReserve,
  reserveHref,
  isLoading,
  reserveDisabled,
  className,
}: BookingPanelProps) {
  return (
    <aside
      className={cn(
        "rounded-lg border border-sand bg-white p-5 shadow-medium lg:sticky lg:top-24",
        className,
      )}
      aria-label="Your stay"
    >
      <h2 className="text-h3 font-semibold text-ocean">Your stay</h2>

      <dl className="mt-4 space-y-2 text-secondary text-charcoal/75">
        <div>
          <dt className="sr-only">Dates</dt>
          <dd>{formatDateRange(checkIn, checkOut)}</dd>
        </div>
        <div>
          <dt className="sr-only">Guests</dt>
          <dd>{guestsLabel}</dd>
        </div>
        <div>
          <dt className="sr-only">Room</dt>
          <dd className="font-medium text-charcoal">{roomName}</dd>
          <dd className="text-metadata text-charcoal/75">
            {formatNaira(pricePerNight)} per night · {nights}{" "}
            {nights === 1 ? "night" : "nights"}
          </dd>
        </div>
      </dl>

      <div className="mt-5 border-t border-sand pt-4">
        <p className="text-2xl font-semibold text-ocean">
          {formatNaira(total)}
        </p>
        <p className="mt-1 text-metadata text-charcoal/75">
          Taxes &amp; fees included
        </p>
      </div>

      {reserveHref ? (
        <Link
          href={reserveHref}
          aria-disabled={reserveDisabled || undefined}
          className={cn(
            buttonVariants({ variant: "primary", size: "md" }),
            "mt-4 w-full",
            reserveDisabled && "pointer-events-none opacity-50",
          )}
        >
          Reserve
        </Link>
      ) : (
        <Button
          type="button"
          fullWidth
          className="mt-4"
          onClick={onReserve}
          isLoading={isLoading}
          disabled={reserveDisabled}
        >
          {isLoading ? "Checking availability" : "Reserve"}
        </Button>
      )}

      <div className="mt-3">
        {freeCancellationUntil ? (
          <p className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1.5 text-metadata font-medium text-success">
            <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
            Free cancellation until {formatDateLong(freeCancellationUntil)}
          </p>
        ) : (
          <p className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1.5 text-metadata font-medium text-success">
            <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
            Cancellation terms shown before payment
          </p>
        )}
      </div>

      <p className="mt-2.5 text-metadata text-charcoal/75">
        You won&apos;t be charged yet.
      </p>
    </aside>
  );
}
