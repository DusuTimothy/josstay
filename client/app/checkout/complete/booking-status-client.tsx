"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  LockKeyhole,
  MapPin,
  RefreshCw,
  SearchX,
  ShieldCheck,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { api, getApiErrorMessage } from "@/lib/api";
import { formatDateLong, formatNaira, guestsLabel } from "@/lib/format";
import type { BookingRecord } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

type ViewState = "loading" | "ready" | "missing" | "auth" | "error";

interface BookingEnvelope {
  success: boolean;
  data: BookingRecord;
}

interface StatusContent {
  title: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  tone: "success" | "limited" | "outline" | "verified";
  headingClass: string;
  circleClass: string;
}

function statusContent(booking: BookingRecord): StatusContent {
  switch (booking.status) {
    case "confirmed":
      return {
        title: "You're booked",
        description:
          "Payment received. Show this reference at the front desk when you arrive and the room is yours.",
        icon: CheckCircle2,
        badge: "Confirmed",
        tone: "success",
        headingClass: "text-ocean",
        circleClass: "bg-sage-soft text-success",
      };
    case "completed":
      return {
        title: "Stay completed",
        description:
          "Thank you for staying with JosStay. We hope the city treated you well.",
        icon: ShieldCheck,
        badge: "Completed",
        tone: "outline",
        headingClass: "text-ocean",
        circleClass: "bg-sage-soft text-ocean",
      };
    case "cancelled":
      return {
        title: "Booking cancelled",
        description:
          "This booking was cancelled and nothing further is due on it.",
        icon: XCircle,
        badge: "Cancelled",
        tone: "limited",
        headingClass: "text-charcoal",
        circleClass: "bg-sand text-charcoal",
      };
    case "refunded":
      return {
        title: "Booking refunded",
        description:
          "The payment for this booking was refunded. Your bank may take a few days to post it.",
        icon: ShieldCheck,
        badge: "Refunded",
        tone: "limited",
        headingClass: "text-ocean",
        circleClass: "bg-sand text-charcoal",
      };
    default:
      return {
        title: "Waiting for payment",
        description:
          "Your room is held while Paystack confirms the payment. If you just paid, give it a moment and refresh this page.",
        icon: Clock3,
        badge: "Payment pending",
        tone: "limited",
        headingClass: "text-ocean",
        circleClass: "bg-sand text-charcoal",
      };
  }
}

export interface BookingStatusClientProps {
  reference: string | null;
}

export function BookingStatusClient({ reference }: BookingStatusClientProps) {
  const [state, setState] = useState<ViewState>(
    reference ? "loading" : "missing",
  );
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const signInHref = reference
    ? `/sign-in?redirect=${encodeURIComponent(
        `/checkout/complete?reference=${reference}`,
      )}`
    : "/sign-in";

  useEffect(() => {
    if (!reference) {
      setState("missing");
      return;
    }

    const token = window.localStorage.getItem("josstay_token");

    // Booking details are private: a guest must be signed in as the account
    // that made the reservation, so wait for the token before asking.
    if (!token) {
      setState("auth");
      return;
    }

    let active = true;

    setState("loading");
    setError(null);

    api
      .get<BookingEnvelope>(`/bookings/${encodeURIComponent(reference)}`)
      .then(({ data }) => {
        if (!active) return;
        setBooking(data.data);
        setState("ready");
      })
      .catch((requestError: unknown) => {
        if (!active) return;

        if (axios.isAxiosError(requestError)) {
          if (requestError.response?.status === 401) {
            setState("auth");
            return;
          }
          if (requestError.response?.status === 404) {
            setState("missing");
            return;
          }
        }

        setError(getApiErrorMessage(requestError));
        setState("error");
      });

    return () => {
      active = false;
    };
  }, [reference, attempt]);

  if (state === "missing") {
    return (
      <EmptyState
        icon={SearchX}
        title="We couldn't find that booking"
        description={
          reference
            ? "That reference does not match a booking on this account. Check the confirmation message and try again."
            : "This link is missing the booking reference. Open the confirmation message from your booking and use that link."
        }
        action={
          <Link
            href="/search"
            className={buttonVariants({ variant: "primary", size: "md" })}
          >
            Browse hotels
          </Link>
        }
        className="mt-8"
      />
    );
  }

  if (state === "auth") {
    return (
      <EmptyState
        icon={LockKeyhole}
        title="Sign in to see this booking"
        description="For privacy, booking details are only shown to the account that made the reservation."
        action={
          <Link
            href={signInHref}
            className={buttonVariants({ variant: "primary", size: "md" })}
          >
            Sign in
          </Link>
        }
        className="mt-8"
      />
    );
  }

  if (state === "loading") {
    return (
      <Card className="mt-8">
        <CardBody
          className="flex items-center gap-3 p-6 text-secondary text-charcoal/65 sm:p-8"
          aria-busy="true"
          aria-live="polite"
        >
          <Loader2 className="size-5 animate-spin text-sage" aria-hidden="true" />
          Loading your booking…
        </CardBody>
      </Card>
    );
  }

  if (state === "error" || !booking) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="We couldn't load this booking"
        description={error ?? "Please try again in a moment."}
        action={
          <Button
            type="button"
            variant="primary"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Try again
          </Button>
        }
        className="mt-8"
      />
    );
  }

  const status = booking.status;
  const content = statusContent(booking);
  const StatusIcon = content.icon;

  return (
    <Card className="mt-8">
      <CardBody className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sand pb-6">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "grid size-11 shrink-0 place-items-center rounded-full",
                content.circleClass,
              )}
            >
              <StatusIcon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={cn("text-h2", content.headingClass)}>
                  {content.title}
                </h2>
                <Badge tone={content.tone}>{content.badge}</Badge>
              </div>
              <p className="mt-2 max-w-xl text-secondary text-charcoal/70">
                {content.description}
              </p>
            </div>
          </div>

          {status === "pending" ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAttempt((value) => value + 1)}
            >
              <RefreshCw aria-hidden="true" />
              Refresh status
            </Button>
          ) : null}
        </div>

        {booking.hotel ? (
          <div className="flex items-start gap-3 border-b border-sand py-6">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sage-soft text-ocean">
              <MapPin className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="text-hotel font-semibold text-ocean">
                <Link
                  href={`/hotels/${booking.hotel.slug}`}
                  className="hover:underline"
                >
                  {booking.hotel.name}
                </Link>
              </h3>
              <p className="mt-0.5 text-secondary text-charcoal/65">
                {booking.hotel.address}
              </p>
              {booking.room ? (
                <p className="mt-1 text-metadata text-charcoal/60">
                  {booking.room.name} · {booking.room.bedType}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <dl className="grid gap-5 border-b border-sand py-6 sm:grid-cols-2">
          <div>
            <dt className="flex items-center gap-1.5 text-metadata text-charcoal/55">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              Dates
            </dt>
            <dd className="mt-1 font-medium text-charcoal">
              {formatDateLong(booking.checkIn)} –{" "}
              {formatDateLong(booking.checkOut)}
            </dd>
            <dd className="text-metadata text-charcoal/60">
              {booking.nights} {booking.nights === 1 ? "night" : "nights"}
            </dd>
          </div>

          <div>
            <dt className="flex items-center gap-1.5 text-metadata text-charcoal/55">
              <Users className="size-3.5" aria-hidden="true" />
              Guests
            </dt>
            <dd className="mt-1 font-medium text-charcoal">
              {guestsLabel(booking.adults, booking.children)}
            </dd>
            <dd className="text-metadata text-charcoal/60">
              {booking.rooms} {booking.rooms === 1 ? "room" : "rooms"}
            </dd>
          </div>

          <div>
            <dt className="text-metadata text-charcoal/55">Total</dt>
            <dd className="mt-1 font-medium text-charcoal">
              {formatNaira(booking.total)}
            </dd>
            <dd className="text-metadata text-charcoal/60">
              {status === "confirmed" || status === "completed"
                ? "Paid in full"
                : "Includes taxes and fees"}
            </dd>
          </div>

          <div>
            <dt className="text-metadata text-charcoal/55">Reference</dt>
            <dd className="mt-1 select-all font-mono text-secondary font-semibold text-charcoal">
              {booking.reference}
            </dd>
            <dd className="text-metadata text-charcoal/60">
              {booking.guestEmail}
            </dd>
          </div>
        </dl>

        <p className="py-4 text-metadata text-charcoal/60">
          {booking.cancellationDeadline
            ? `Free cancellation until ${formatDateLong(
                booking.cancellationDeadline.slice(0, 10),
              )}.`
            : "This rate is non-refundable."}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {booking.hotel ? (
            <Link
              href={`/hotels/${booking.hotel.slug}`}
              className={buttonVariants({ variant: "primary", size: "md" })}
            >
              View the hotel
            </Link>
          ) : null}
          <Link
            href="/search"
            className={buttonVariants({ variant: "ghost", size: "md" })}
          >
            Find another stay
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
