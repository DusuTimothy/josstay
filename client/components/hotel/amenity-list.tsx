import type { LucideIcon } from "lucide-react";
import {
  Check,
  Coffee,
  Droplets,
  Dumbbell,
  PawPrint,
  ShieldCheck,
  Shirt,
  Snowflake,
  Sparkles,
  SquareParking,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wine,
  Zap,
} from "lucide-react";
import { AMENITIES } from "@/lib/constants";
import type { AmenityKey } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";

const AMENITY_ICONS: Record<AmenityKey, LucideIcon> = {
  wifi: Wifi,
  pool: Waves,
  spa: Sparkles,
  gym: Dumbbell,
  parking: SquareParking,
  breakfast: Coffee,
  restaurant: UtensilsCrossed,
  bar: Wine,
  air_conditioning: Snowflake,
  power: Zap,
  water: Droplets,
  security: ShieldCheck,
  pet_friendly: PawPrint,
  laundry: Shirt,
};

export interface AmenityListProps {
  amenities: AmenityKey[];
  variant?: "list" | "chips" | "row";
  limit?: number;
  className?: string;
}

export function AmenityList({
  amenities,
  variant = "list",
  limit,
  className,
}: AmenityListProps) {
  const visible = limit ? amenities.slice(0, limit) : amenities;

  if (variant === "chips") {
    return (
      <ul className={cn("flex flex-wrap gap-1.5", className)}>
        {visible.map((amenity) => (
          <li key={amenity}>
            <Chip tone="sage">
              <Check className="size-3" aria-hidden="true" />
              {AMENITIES[amenity]}
            </Chip>
          </li>
        ))}
      </ul>
    );
  }

  if (variant === "row") {
    return (
      <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
        {visible.map((amenity) => {
          const Icon = AMENITY_ICONS[amenity];
          return (
            <li
              key={amenity}
              className="inline-flex items-center gap-1.5 text-secondary text-charcoal/80"
            >
              <Icon
                className="size-4 shrink-0 text-sage-deep"
                aria-hidden="true"
              />
              <span>{AMENITIES[amenity]}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {visible.map((amenity) => {
        const Icon = AMENITY_ICONS[amenity];
        return (
          <li
            key={amenity}
            className="flex items-center gap-2.5 text-secondary text-charcoal/80"
          >
            <Icon className="size-4 shrink-0 text-sage-deep" aria-hidden="true" />
            <span>{AMENITIES[amenity]}</span>
          </li>
        );
      })}
    </ul>
  );
}
