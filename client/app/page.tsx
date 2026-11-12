import Link from "next/link";
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
import { SAMPLE_HOTELS } from "@/lib/sample-data";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-sand/60">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,#DCE7E0_0%,#F7F4ED_52%,#F7F4ED_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 top-8 size-80 rounded-full border border-sage/20"
        />
        <div
          aria-hidden="true"
          className="absolute -left-32 bottom-0 size-72 rounded-full border border-gold/15"
        />

        <Container className="relative py-14 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <Chip tone="sage" className="bg-white/70">
              Now booking in Jos, Plateau State
            </Chip>
            <h1 className="mt-5 text-h1 text-ocean">
              Find somewhere that feels like home.
            </h1>
            <p className="mt-4 max-w-xl text-base text-charcoal/70 sm:text-lg">
              Discover hotels designed around the way you travel. Clear prices,
              verified stays and instant confirmation — all in one calm place.
            </p>
          </div>

          <SearchBar className="mt-8 max-w-5xl" />

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-secondary text-charcoal/65">
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-sage" aria-hidden="true" />
              Verified hotels
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-sage" aria-hidden="true" />
              Taxes included
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-sage" aria-hidden="true" />
              Free cancellation on most stays
            </span>
          </div>
        </Container>
      </section>

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

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_DESTINATIONS.map((destination, index) => (
              <DestinationCard
                key={destination.name}
                destination={destination}
                featured={index === 0}
                className={
                  index === 0
                    ? "sm:col-span-2 lg:aspect-[2.1/1]"
                    : undefined
                }
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
            {SAMPLE_HOTELS.slice(0, 3).map((hotel) => (
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
            <p className="mt-4 max-w-xl text-body text-ivory/70">
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
                <p className="mt-3 max-w-xl text-secondary text-charcoal/70">
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
        <p className="text-metadata font-semibold uppercase tracking-[0.16em] text-sage">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-h2 text-ocean">{title}</h2>
        <p className="mt-2 text-secondary text-charcoal/65">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
