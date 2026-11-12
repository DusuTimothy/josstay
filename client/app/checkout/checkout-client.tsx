"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AlertCircle, CheckCircle2, LockKeyhole } from "lucide-react";
import { api, getApiErrorMessage } from "@/lib/api";
import { formatDateLong, formatNaira, guestsLabel } from "@/lib/format";
import type {
  BookingQuote,
  CreateBookingResult,
  GuestDetails,
  HotelDetail,
  ReservationSummaryData,
  Room,
} from "@/lib/types";
import { GuestForm } from "@/components/checkout/guest-form";
import { PaymentForm } from "@/components/checkout/payment-form";
import { ReservationSummary } from "@/components/checkout/reservation-summary";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
interface AuthMeResponse {
  success: boolean;
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

interface CreateBookingEnvelope {
  success: boolean;
  data: CreateBookingResult;
}

export interface CheckoutClientProps {
  hotel: HotelDetail;
  room: Room;
  quote: BookingQuote;
}

export function CheckoutClient({ hotel, room, quote }: CheckoutClientProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [guest, setGuest] = useState<Partial<GuestDetails>>({});
  const [guestKey, setGuestKey] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreateBookingResult | null>(null);

  useEffect(() => {
    let active = true;

    if (!window.localStorage.getItem("josstay_token")) return;

    api
      .get<AuthMeResponse>("/auth/me")
      .then(({ data }) => {
        if (!active) return;
        const user = data.data;
        setGuest({
          fullName: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          phone: user.phone ?? "",
        });
        setGuestKey((key) => key + 1);
      })
      .catch(() => {
        // The guest can still fill the form manually.
      });

    return () => {
      active = false;
    };
  }, []);

  const summary: ReservationSummaryData = {
    hotelName: hotel.name,
    hotelArea: `${hotel.area}, ${hotel.city}`,
    hotelImageUrl: hotel.imageUrl,
    roomName: room.name,
    checkIn: quote.checkIn,
    checkOut: quote.checkOut,
    guestsLabel: guestsLabel(quote.adults, quote.children),
    nights: quote.nights,
    roomTotal: quote.roomTotal,
    taxes: quote.taxes,
    total: quote.total,
    freeCancellationUntil: quote.freeCancellationUntil,
    instantConfirmation: true,
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const guestName = String(form.get("fullName") ?? "").trim();
    const guestEmail = String(form.get("email") ?? "").trim();
    const guestPhone = String(form.get("phone") ?? "").trim();

    if (!guestName || !guestEmail || !guestPhone) {
      setError("Add the guest name, email and phone number to continue.");
      return;
    }

    const token = window.localStorage.getItem("josstay_token");

    if (!token) {
      const redirect = `${window.location.pathname}${window.location.search}`;
      router.push(`/sign-in?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    try {
      setIsProcessing(true);

      const { data } = await api.post<CreateBookingEnvelope>("/bookings", {
        hotelId: hotel.id,
        roomId: room.id,
        checkIn: quote.checkIn,
        checkOut: quote.checkOut,
        rooms: quote.rooms,
        adults: quote.adults,
        children: quote.children,
        guestName,
        guestEmail,
        guestPhone,
      });

      const result = data.data;

      if (result.payment?.authorizationUrl) {
        window.location.assign(result.payment.authorizationUrl);
        return;
      }

      setCreated(result);
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
        const redirect = `${window.location.pathname}${window.location.search}`;
        router.push(`/sign-in?redirect=${encodeURIComponent(redirect)}`);
        return;
      }

      setError(getApiErrorMessage(requestError));
    } finally {
      setIsProcessing(false);
    }
  }

  if (created) {
    const holdTime = new Date(created.holdExpiresAt).toLocaleTimeString(
      "en-NG",
      { hour: "numeric", minute: "2-digit" },
    );

    return (
      <Card className="mt-8">
        <CardBody className="flex flex-col items-start gap-4 p-6 sm:p-8">
          <span className="grid size-11 place-items-center rounded-full bg-sage-soft text-success">
            <CheckCircle2 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-h2 text-ocean">Your room is held</h2>
            <p className="mt-2 max-w-xl text-secondary text-charcoal/70">
              Booking reference{" "}
              <strong className="font-semibold text-charcoal">
                {created.booking.reference}
              </strong>
              . We have held {room.name} at {hotel.name} until {holdTime} today.
            </p>
          </div>

          <dl className="grid w-full gap-3 rounded-md border border-sand bg-ivory p-4 text-secondary sm:grid-cols-3">
            <div>
              <dt className="text-metadata text-charcoal/55">Dates</dt>
              <dd className="font-medium text-charcoal">
                {formatDateLong(created.booking.checkIn)} –{" "}
                {formatDateLong(created.booking.checkOut)}
              </dd>
            </div>
            <div>
              <dt className="text-metadata text-charcoal/55">Guests</dt>
              <dd className="font-medium text-charcoal">
                {guestsLabel(
                  created.booking.adults,
                  created.booking.children,
                )}
              </dd>
            </div>
            <div>
              <dt className="text-metadata text-charcoal/55">Total</dt>
              <dd className="font-medium text-charcoal">
                {formatNaira(created.booking.total)}
              </dd>
            </div>
          </dl>

          {created.payment ? (
            <a
              href={created.payment.authorizationUrl}
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              <LockKeyhole aria-hidden="true" />
              Continue to payment
            </a>
          ) : (
            <p className="max-w-xl text-secondary text-charcoal/65">
              Online payment is not configured in this environment yet. Your
              booking is pending and the room is held while payment is set up.
            </p>
          )}

          <Link
            href={`/hotels/${hotel.slug}`}
            className={buttonVariants({ variant: "ghost", size: "md" })}
          >
            Back to the hotel
          </Link>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
      >
        {error ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-error/25 bg-error/5 px-3.5 py-3 text-secondary text-error"
          >
            <AlertCircle
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <span>{error}</span>
          </div>
        ) : null}

        <Card>
          <CardBody>
            <GuestForm
              key={guestKey}
              defaultValues={guest}
              disabled={isProcessing}
            />
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <PaymentForm disabled={isProcessing} />
          </CardBody>
        </Card>

        <p className="px-1 text-metadata text-charcoal/55">
          By confirming, you agree to the JosStay terms and the hotel&apos;s
          cancellation policy. Payment is processed securely by Paystack.
        </p>
      </form>

      <ReservationSummary
        data={summary}
        onConfirm={() => formRef.current?.requestSubmit()}
        isProcessing={isProcessing}
      />
    </div>
  );
}
