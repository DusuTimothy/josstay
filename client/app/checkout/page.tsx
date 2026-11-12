import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, LockKeyhole, SearchX } from "lucide-react";
import { CheckoutClient } from "./checkout-client";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { fetchHotel, fetchQuote } from "@/lib/server-api";
import { parseRooms } from "@/lib/search";
import { parseStayQuery } from "@/lib/stay";
import type { BookingQuote, HotelDetail } from "@/lib/types";

export const metadata: Metadata = {
  title: "Confirm and pay",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function firstValue(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "We could not price this stay. Please try again.";
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const slug = firstValue(query.slug)?.trim();
  const roomId = firstValue(query.roomId)?.trim();
  const stay = parseStayQuery(query);
  const rooms = parseRooms(query.rooms);

  let hotel: HotelDetail | null = null;
  let quote: BookingQuote | null = null;
  let problem =
    "Choose a room and dates first — this checkout link is incomplete.";

  if (slug && roomId) {
    try {
      hotel = await fetchHotel(slug);

      if (!hotel) {
        problem = "That stay is no longer available.";
      } else {
        const room = hotel.rooms.find((entry) => entry.id === roomId);

        if (!room) {
          problem =
            "That room is not available at this hotel. Please choose another room.";
        } else {
          quote = await fetchQuote({
            hotelId: hotel.id,
            roomId: room.id,
            checkIn: stay.checkIn,
            checkOut: stay.checkOut,
            rooms,
            adults: stay.adults,
            children: stay.children,
          });
          problem = "";
        }
      }
    } catch (error) {
      problem = errorMessage(error);
    }
  }

  const hotelName = hotel?.name;
  const hotelHref = hotel
    ? `/hotels/${hotel.slug}`
    : slug
      ? `/hotels/${slug}`
      : "/search";

  return (
    <div className="pb-20">
      <Container className="py-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-metadata text-charcoal/60">
            <li>
              <Link href="/" className="hover:text-ocean">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <Link href={hotelHref} className="hover:text-ocean">
                {hotelName ?? "Hotel"}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-charcoal">
              Checkout
            </li>
          </ol>
        </nav>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-h1 text-ocean">Confirm and pay</h1>
            <p className="mt-2 max-w-xl text-secondary text-charcoal/65">
              One calm step to go. Your total includes all taxes and fees, and
              the cancellation deadline is shown before you pay.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1.5 text-metadata font-medium text-success">
            <LockKeyhole className="size-3.5" aria-hidden="true" />
            Secure checkout
          </span>
        </div>

        {hotel && quote ? (
          <CheckoutClient
            hotel={hotel}
            room={hotel.rooms.find((room) => room.id === roomId)!}
            quote={quote}
          />
        ) : (
          <EmptyState
            icon={SearchX}
            title="We could not open this checkout"
            description={problem}
            action={
              <Link
                href={hotelHref}
                className={buttonVariants({ variant: "primary", size: "md" })}
              >
                Back to the hotel
              </Link>
            }
            className="mt-8"
          />
        )}
      </Container>
    </div>
  );
}
