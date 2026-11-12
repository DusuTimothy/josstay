import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRight, Building2, Check } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { DestinationCard } from "@/components/home/destination-card";
import { HotelCard } from "@/components/hotel/hotel-card";
import { TrustStrip } from "@/components/layout/trust-strip";
import { Button, buttonVariants } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { POPULAR_DESTINATIONS } from "@/lib/constants";
import { guestOptionIndex } from "@/lib/search";
import { SAMPLE_HOTELS } from "@/lib/sample-data";
import { defaultStay } from "@/lib/stay";
import { fetchFeaturedHotels } from "@/lib/server-api";

export default async function HomePage() {
  let featured = SAMPLE_HOTELS;
  const stay = defaultStay();

  try {
    const hotels = await fetchFeaturedHotels();
    if (hotels.length > 0) featured = hotels;
  } catch (error) {
    // Home is statically generated, so a build without the API must still
    // succeed. The sample stays are replaced on the next revalidation.
    console.error("[home] API unavailable, using sample hotels:", error);
  }

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <Image
          src="/images/hero/hero-jos.jpg"
          alt="A lit hotel pool at blue hour in Jos"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-ocean/95 via-ocean/88 to-ocean/55"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-2/3 bg-gradient-to-b from-ocean/55 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ivory via-ivory/80 to-transparent"
        />

        <Container className="relative pb-28 pt-16 sm:pb-32 sm:pt-20 lg:pb-36 lg:pt-28">
          <div className="max-w-2xl">
            <Chip tone="sage" className="bg-white/15 text-ivory backdrop-blur-sm">
              Plateau State, Nigeria
            </Chip>
            <h1 className="mt-5 text-h1 text-ivory">
              Find somewhere that feels like home.
            </h1>
            <p className="mt-4 max-w-xl text-body text-ivory/90 sm:text-lg">
              Discover hotels designed around the way you travel. Clear prices,
              verified stays and instant confirmation — all in one calm place.
            </p>
          </div>
        </Container>
      </section>

      <Container className="relative z-10 -mt-16 sm:-mt-20">
        <SearchBar
          className="shadow-large"
          defaultCheckIn={stay.checkIn}
          defaultCheckOut={stay.checkOut}
          defaultGuestsIndex={guestOptionIndex(stay.adults, stay.children)}
        />

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-secondary text-charcoal/75">
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-4 text-sage-deep" aria-hidden="true" />
            Verified hotels
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-4 text-sage-deep" aria-hidden="true" />
            Taxes included
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-4 text-sage-deep" aria-hidden="true" />
            Free cancellation on most stays
          </span>
        </div>
      </Container>

      <section id="destinations" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Discover"
            title="Popular in Jos"
            description="Start with the areas guests return to — from the quiet streets of Rayfield to the views at Shere Hills."
            action={
              <Link
                href="/search"
                className="inline-flex items-center gap-1.5 text-secondary font-semibold text-ocean underline-offset-4 hover:underline"
              >
                View all hotels
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            }
          />

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {POPULAR_DESTINATIONS.map((destination) => (
              <DestinationCard
                key={destination.name}
                destination={destination}
                variant="strip"
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Stay a while"
            title="Stays guests return to"
            description="A few places in Jos with the details that matter: steady power, honest prices and a warm welcome."
            action={
              <Link
                href="/search"
                className="inline-flex items-center gap-1.5 text-secondary font-semibold text-ocean underline-offset-4 hover:underline"
              >
                Browse all stays
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            }
          />

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 3).map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ocean py-16 text-ivory sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <p className="text-metadata font-semibold uppercase tracking-[0.16em] text-gold">
              The JosStay promise
            </p>
            <h2 className="mt-3 text-h2 text-ivory">
              Confidence, built into every booking.
            </h2>
            <p className="mt-4 max-w-xl text-body text-ivory/85">
              We visit every hotel, check that the photos match and confirm the
              map pin in person. Prices include taxes, and the cancellation
              deadline is always shown before you pay.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/search"
                className={buttonVariants({ variant: "secondary", size: "md" })}
              >
                Find a stay
              </Link>
              <Link
                href="/trust"
                className="inline-flex h-11 items-center gap-1.5 rounded-md border border-ivory/25 px-5 text-button font-semibold text-ivory transition-colors hover:bg-ivory/10"
              >
                How we build trust
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <TrustStrip variant="cards" inverted />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="overflow-hidden rounded-xl border border-sand bg-white shadow-soft">
            <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-sage-soft text-ocean">
                  <Building2 className="size-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-h2 text-ocean">
                  Run a hotel in Jos?
                </h2>
                <p className="mt-3 max-w-xl text-secondary text-charcoal/75">
                  Join a platform built for this city. Manage your rooms, block
                  dates in seconds and receive payouts directly through
                  Paystack.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  href="/partners"
                  className={buttonVariants({ variant: "primary", size: "lg" })}
                >
                  List your hotel
                </Link>
                <Link
                  href="/partners"
                  className={buttonVariants({ variant: "ghost", size: "lg" })}
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-metadata font-semibold uppercase tracking-[0.16em] text-sage-deep">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-h2 text-ocean">{title}</h2>
        <p className="mt-2 text-secondary text-charcoal/75">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
