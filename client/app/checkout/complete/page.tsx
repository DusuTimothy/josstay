import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { BookingStatusClient } from "./booking-status-client";

export const metadata: Metadata = {
  title: "Booking status",
  description: "Check the status of your JosStay booking.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Paystack returns the guest here after checkout with the booking reference in
 * the query string. The page reads the stored session token and shows the
 * booking that belongs to it.
 */
export default async function BookingStatusPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const rawReference = Array.isArray(query.reference)
    ? query.reference[0]
    : query.reference;
  const reference = rawReference?.trim() || null;

  return (
    <div className="pb-20">
      <Container className="py-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-metadata text-charcoal/75">
            <li>
              <Link href="/" className="hover:text-ocean">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-charcoal">
              Booking status
            </li>
          </ol>
        </nav>

        <div className="mt-6 max-w-2xl">
          <h1 className="text-h1 text-ocean">Your booking</h1>
          <p className="mt-2 text-secondary text-charcoal/75">
            Everything about this stay in one place — reference, dates, guests
            and payment status.
          </p>
        </div>

        <BookingStatusClient reference={reference} />
      </Container>
    </div>
  );
}
