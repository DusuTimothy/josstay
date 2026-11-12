import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MapPin, ShieldCheck } from "lucide-react";
import { AmenityList } from "@/components/hotel/amenity-list";
import { BookingPanel } from "@/components/hotel/booking-panel";
import { HotelGallery } from "@/components/hotel/hotel-gallery";
import { RoomOptionCard } from "@/components/hotel/room-option-card";
import { TrustStrip } from "@/components/layout/trust-strip";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Rating } from "@/components/ui/rating";
import { formatDateRange, nightsBetween } from "@/lib/format";
import { SAMPLE_HOTEL, SAMPLE_HOTELS } from "@/lib/sample-data";
import { absoluteUrl, hotelJsonLd } from "@/lib/seo";
import type { HotelDetail } from "@/lib/types";

const CHECK_IN = "2026-11-20";
const CHECK_OUT = "2026-11-23";
const FREE_CANCELLATION_UNTIL = "2026-11-19";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function detailForSlug(slug: string): HotelDetail {
  const summary =
    SAMPLE_HOTELS.find((hotel) => hotel.slug === slug) ?? SAMPLE_HOTEL;
  return { ...SAMPLE_HOTEL, ...summary };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const hotel = detailForSlug(slug);

  return {
    title: hotel.name,
    description: hotel.description,
    openGraph: {
      title: hotel.name,
      description: hotel.description,
      images: [{ url: hotel.imageUrl }],
    },
    alternates: {
      canonical: `/hotels/${hotel.slug}`,
    },
  };
}

export default async function HotelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const hotel = detailForSlug(slug);
  const nights = nightsBetween(CHECK_IN, CHECK_OUT);
  const total = hotel.pricePerNight * nights;
  const jsonLd = hotelJsonLd(hotel, absoluteUrl(`/hotels/${hotel.slug}`));

  return (
    <div className="pb-20">
      <Container className="py-6">
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
              <Link href="/search" className="hover:text-ocean">
                Hotels in Jos
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-charcoal">
              {hotel.name}
            </li>
          </ol>
        </nav>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div className="min-w-0">
            <HotelGallery images={hotel.images} hotelName={hotel.name} />

            <header className="mt-6 border-b border-sand pb-6">
              <div className="flex flex-wrap items-center gap-2">
                {hotel.badges?.includes("verified") ? (
                  <Badge
                    tone="verified"
                    icon={<ShieldCheck className="size-3.5" aria-hidden="true" />}
                  >
                    Verified by JosStay
                  </Badge>
                ) : null}
                {hotel.badges?.includes("guest_favourite") ? (
                  <Badge tone="favourite">Guest favourite</Badge>
                ) : null}
              </div>

              <h1 className="mt-3 text-h1 text-ocean">{hotel.name}</h1>

              <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-secondary text-charcoal/65">
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                {hotel.address}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Rating
                  score={hotel.rating}
                  reviewCount={hotel.reviewCount}
                  size="md"
                />
                <span className="text-metadata text-charcoal/55">
                  {hotel.distanceKm.toFixed(1)} km from the city centre
                </span>
              </div>
            </header>

            <section className="border-b border-sand py-6" aria-labelledby="about">
              <h2 id="about" className="text-h2 text-ocean">
                About this stay
              </h2>
              <p className="mt-3 max-w-prose text-body text-charcoal/75">
                {hotel.description}
              </p>
            </section>

            <section
              className="border-b border-sand py-6"
              aria-labelledby="amenities"
            >
              <h2 id="amenities" className="text-h2 text-ocean">
                What this place offers
              </h2>
              <AmenityList amenities={hotel.amenities} className="mt-4" />
            </section>

            <section className="border-b border-sand py-6" aria-labelledby="rooms">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="rooms" className="text-h2 text-ocean">
                    Choose your room
                  </h2>
                  <p className="mt-1 text-secondary text-charcoal/60">
                    {formatDateRange(CHECK_IN, CHECK_OUT)} · {nights} nights · 2
                    adults
                  </p>
                </div>
                <p className="text-metadata text-charcoal/55">
                  Prices include taxes and fees
                </p>
              </div>

              <div className="mt-5 space-y-4">
                {hotel.rooms.map((room) => (
                  <RoomOptionCard
                    key={room.id}
                    room={room}
                    nights={nights}
                  />
                ))}
              </div>
            </section>

            <section className="py-6" aria-labelledby="location">
              <h2 id="location" className="text-h2 text-ocean">
                Location
              </h2>
              <p className="mt-2 text-secondary text-charcoal/65">
                {hotel.address}
              </p>

              <div className="relative mt-4 overflow-hidden rounded-lg border border-sand bg-sage-soft">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-40 [background-image:linear-gradient(#7F9C8D_1px,transparent_1px),linear-gradient(90deg,#7F9C8D_1px,transparent_1px)] [background-size:32px_32px]"
                />
                <div className="relative flex min-h-56 flex-col items-center justify-center gap-3 p-8 text-center">
                  <span className="grid size-11 place-items-center rounded-full bg-ocean text-ivory shadow-medium">
                    <MapPin className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-secondary font-semibold text-ocean">
                      {hotel.name}
                    </p>
                    <p className="text-metadata text-charcoal/60">
                      {hotel.latitude.toFixed(4)}, {hotel.longitude.toFixed(4)}
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary font-semibold text-ocean underline underline-offset-4"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>

              <TrustStrip className="mt-6" />
            </section>
          </div>

          <BookingPanel
            checkIn={CHECK_IN}
            checkOut={CHECK_OUT}
            guestsLabel="2 adults"
            roomName={hotel.rooms[0]?.name ?? "Room"}
            nights={nights}
            pricePerNight={hotel.pricePerNight}
            total={total}
            freeCancellationUntil={FREE_CANCELLATION_UNTIL}
            reserveHref="/checkout"
          />
        </div>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
