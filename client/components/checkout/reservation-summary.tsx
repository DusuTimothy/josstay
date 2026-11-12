"use client";

import {
  CalendarCheck2,
  LockKeyhole,
  ShieldCheck,
  Undo2,
} from "lucide-react";
import { formatDateLong, formatNaira } from "@/lib/format";
import type { ReservationSummaryData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";

export interface ReservationSummaryProps {
  data: ReservationSummaryData;
  onConfirm?: () => void;
  isProcessing?: boolean;
  className?: string;
}

export function ReservationSummary({
  data,
  onConfirm,
  isProcessing,
  className,
}: ReservationSummaryProps) {
  return (
    <aside
      aria-label="Reservation summary"
      className={cn(
        "rounded-lg border border-sand bg-white p-5 shadow-medium lg:sticky lg:top-24",
        className,
      )}
    >
      <h2 className="text-h3 font-semibold text-ocean">
        Your reservation
      </h2>

      <div className="mt-4 flex gap-3 border-b border-sand pb-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-sand">
          <SmartImage
            src={data.hotelImageUrl}
            alt={data.hotelName}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-ocean">{data.hotelName}</p>
          <p className="text-metadata text-charcoal/75">{data.hotelArea}</p>
          <p className="mt-1.5 text-secondary text-charcoal/75">
            {data.roomName}
          </p>
        </div>
      </div>

      <div className="border-b border-sand py-4">
        <p className="text-secondary text-charcoal/75">
          {formatDateLong(data.checkIn)} – {formatDateLong(data.checkOut)} ·{" "}
          {data.guestsLabel}
        </p>
      </div>

      <dl className="space-y-2.5 border-b border-sand py-4 text-secondary">
        <div className="flex justify-between gap-4">
          <dt className="text-charcoal/75">
            Room ({data.nights} {data.nights === 1 ? "night" : "nights"})
          </dt>
          <dd className="text-right font-medium text-charcoal">
            {formatNaira(data.roomTotal)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-charcoal/75">Taxes &amp; fees</dt>
          <dd className="text-right font-medium text-charcoal">
            {formatNaira(data.taxes)}
          </dd>
        </div>
      </dl>

      <div className="flex items-baseline justify-between gap-4 py-4">
        <span className="text-secondary font-semibold text-charcoal">Total</span>
        <span className="text-2xl font-semibold text-ocean">
          {formatNaira(data.total)}
        </span>
      </div>

      <div className="space-y-2.5 pb-4 text-metadata text-charcoal/75">
        {data.freeCancellationUntil ? (
          <p className="flex items-start gap-1.5">
            <Undo2 className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            Free cancellation until{" "}
            <strong className="font-semibold text-charcoal">
              {formatDateLong(data.freeCancellationUntil)}
            </strong>
          </p>
        ) : null}
        {data.instantConfirmation ? (
          <p className="flex items-start gap-1.5">
            <CalendarCheck2
              className="mt-0.5 size-3.5 shrink-0 text-success"
              aria-hidden="true"
            />
            Instant confirmation.
          </p>
        ) : null}
      </div>

      <Button
        type="button"
        fullWidth
        size="lg"
        onClick={onConfirm}
        isLoading={isProcessing}
      >
        <LockKeyhole aria-hidden="true" />
        Confirm &amp; Pay
      </Button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-metadata text-charcoal/75">
        <ShieldCheck className="size-3.5 text-sage-deep" aria-hidden="true" />
        Secure payment
      </p>
    </aside>
  );
}
