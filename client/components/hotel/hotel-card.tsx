"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { formatNaira } from "@/lib/format";
import type { HotelBadge, HotelSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { AmenityList } from "@/components/hotel/amenity-list";
import { SmartImage } from "@/components/ui/smart-image";

const BADGE_COPY: Record<
  HotelBadge,
  { label: string; tone: "verified" | "favourite" | "limited" }
> = {
  guest_favourite: { label: "Guest favourite", tone: "favourite" },
  limited_availability: { label: "Limited availability", tone: "limited" },
  verified: { label: "Verified", tone: "verified" },
};

export interface HotelCardProps {
  hotel: HotelSummary;
  href?: string;
  isFavourite?: boolean;
  onToggleFavourite?: (hotel: HotelSummary) => void;
  className?: string;
}

export function HotelCard({
  hotel,
  href = `/hotels/${hotel.slug}`,
  isFavourite = false,
  onToggleFavourite,
  className,
}: HotelCardProps) {
  function handleFavourite(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    onToggleFavourite?.(hotel);
  }

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-sand bg-white shadow-soft transition-shadow duration-300 hover:shadow-medium",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <Link
          href={href}
          aria-label={`View ${hotel.name}`}
          className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ocean"
        >
          <SmartImage
            src={hotel.imageUrl}
            alt={hotel.imageAlt ?? hotel.name}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-calm group-hover:scale-[1.03]"
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 bg-gradient-to-b from-charcoal/35 via-charcoal/5 to-transparent p-3">
          <div className="pointer-events-auto flex flex-wrap gap-1.5">
            {hotel.badges?.map((badge) => (
              <Badge
                key={badge}
                tone={BADGE_COPY[badge].tone}
                className="shadow-soft"
              >
                {BADGE_COPY[badge].label}
              </Badge>
            ))}
          </div>
          <button
            type="button"
            onClick={handleFavourite}
            aria-pressed={isFavourite}
            aria-label={
              isFavourite
                ? `Remove ${hotel.name} from favourites`
                : `Save ${hotel.name} to favourites`
            }
            className="pointer-events-auto grid size-9 shrink-0 place-items-center rounded-full bg-white/95 text-charcoal shadow-soft backdrop-blur transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <Heart
              className={cn(
                "size-[18px] transition-colors",
                isFavourite ? "fill-error text-error" : "text-charcoal/70",
              )}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div>
          <h3 className="text-hotel font-semibold text-ocean">
            <Link
              href={href}
              className="rounded-sm transition-colors hover:text-ocean/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {hotel.name}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-secondary text-charcoal/65">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {hotel.area}, {hotel.city}
            <span aria-hidden="true">·</span>
            <span>{hotel.distanceKm.toFixed(1)} km from centre</span>
          </p>
        </div>

        <Rating
          score={hotel.rating}
          reviewCount={hotel.reviewCount}
          size="sm"
          className="mt-3"
        />

        <AmenityList
          amenities={hotel.amenities}
          variant="chips"
          limit={3}
          className="mt-3"
        />

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-metadata text-charcoal/55">From</p>
            <p className="text-h3 font-semibold leading-tight text-ocean">
              {formatNaira(hotel.pricePerNight)}
            </p>
            <p className="text-metadata text-charcoal/55">
              per night · taxes included
            </p>
          </div>
          <Link
            href={href}
            className={buttonVariants({ variant: "primary", size: "sm" })}
          >
            View rooms
          </Link>
        </div>
      </div>
    </article>
  );
}
