"use client";

import Link from "next/link";
import {
  CalendarDays,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import {
  formatDateLong,
  formatDateRange,
  formatNaira,
} from "@/lib/format";
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
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-serif text-h3 font-semibold text-ocean">
          Your stay
        </h2>
        <span className="text-metadata text-charcoal/75">
          {nights} {nights === 1 ? "night" : "nights"}
        </span>
      </div>

      <dl className="mt-5 space-y-3 text-secondary">
        <div className="flex items-start gap-2.5">
          <CalendarDays
            className="mt-0.5 size-4 shrink-0 text-sage-deep"
            aria-hidden="true"
          />
          <div>
            <dt className="sr-only">Dates</dt>
            <dd className="font-medium text-charcoal">
              {formatDateRange(checkIn, checkOut)}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Users
            className="mt-0.5 size-4 shrink-0 text-sage-deep"
            aria-hidden="true"
          />
          <div>
            <dt className="sr-only">Guests</dt>
            <dd className="font-medium text-charcoal">{guestsLabel}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Wallet
            className="mt-0.5 size-4 shrink-0 text-sage-deep"
            aria-hidden="true"
          />
          <div>
            <dt className="sr-only">Room</dt>
            <dd className="font-medium text-charcoal">{roomName}</dd>
            <dd className="text-metadata text-charcoal/75">
              {formatNaira(pricePerNight)} per night
            </dd>
          </div>
        </div>
      </dl>

      <div className="mt-5 flex items-baseline justify-between border-t border-sand pt-4">
        <span className="text-secondary font-medium text-charcoal">Total</span>
        <div className="text-right">
          <span className="text-2xl font-semibold text-ocean">
            {formatNaira(total)}
          </span>
          <p className="text-metadata text-charcoal/75">
            Taxes and fees included
          </p>
        </div>
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

      <div className="mt-3 space-y-2 text-metadata text-charcoal/75">
        {freeCancellationUntil ? (
          <p className="flex items-start gap-1.5">
            <ShieldCheck
              className="mt-0.5 size-3.5 shrink-0 text-success"
              aria-hidden="true"
            />
            Free cancellation until{" "}
            <strong className="font-semibold text-charcoal">
              {formatDateLong(freeCancellationUntil)}
            </strong>
          </p>
        ) : (
          <p className="flex items-start gap-1.5">
            <ShieldCheck
              className="mt-0.5 size-3.5 shrink-0 text-success"
              aria-hidden="true"
            />
            Cancellation terms are shown before payment.
          </p>
        )}
        <p>You won&apos;t be charged yet.</p>
      </div>
    </aside>
  );
}
