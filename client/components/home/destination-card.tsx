import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Destination } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/ui/smart-image";

export interface DestinationCardProps {
  destination: Destination;
  href?: string;
  featured?: boolean;
  className?: string;
}

export function DestinationCard({
  destination,
  href = `/search?area=${encodeURIComponent(destination.name)}`,
  featured = false,
  className,
}: DestinationCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-lg bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
        featured ? "aspect-[4/3] lg:aspect-auto lg:h-full" : "aspect-[4/3]",
        className,
      )}
    >
      <SmartImage
        src={destination.imageUrl}
        alt={`${destination.name}, ${destination.area}`}
        fill
        sizes={
          featured
            ? "(min-width: 1024px) 66vw, 100vw"
            : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        }
        className="object-cover transition-transform duration-700 ease-calm group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ocean/95 via-ocean/75 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
        <div>
          <p className="flex items-center gap-1.5 text-metadata font-semibold text-ivory/90">
            <MapPin className="size-3" aria-hidden="true" />
            {destination.area}
          </p>
          <h3
            className={cn(
              "mt-1 font-serif font-semibold text-ivory",
              featured ? "text-h2" : "text-h3",
            )}
          >
            {destination.name}
          </h3>
          {featured ? (
            <p className="mt-1 max-w-sm text-secondary text-ivory/90">
              {destination.blurb}
            </p>
          ) : null}
          <p className="mt-1.5 text-metadata font-medium text-ivory/90">
            {destination.propertyCount} properties
          </p>
        </div>
        <span
          className="grid size-9 shrink-0 place-items-center rounded-full border border-ivory/25 bg-ivory/10 text-ivory backdrop-blur-sm transition group-hover:bg-ivory group-hover:text-ocean"
          aria-hidden="true"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
