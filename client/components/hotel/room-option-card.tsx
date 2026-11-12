"use client";

import { BedDouble, Check, Maximize, Users } from "lucide-react";
import { formatNaira } from "@/lib/format";
import type { Room } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AmenityList } from "@/components/hotel/amenity-list";

export interface RoomOptionCardProps {
  room: Room;
  nights: number;
  selected?: boolean;
  availableRooms?: number;
  onSelect?: (room: Room) => void;
  className?: string;
}

export function RoomOptionCard({
  room,
  nights,
  selected = false,
  availableRooms,
  onSelect,
  className,
}: RoomOptionCardProps) {
  const total = room.pricePerNight * Math.max(nights, 1);
  const roomsLeft =
    typeof availableRooms === "number"
      ? availableRooms
      : room.availableRooms;

  return (
    <article
      className={cn(
        "rounded-lg border bg-white p-4 transition sm:p-5",
        selected
          ? "border-ocean ring-2 ring-ocean/10"
          : "border-sand hover:border-sage/70",
        className,
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-hotel font-semibold text-ocean">{room.name}</h3>
          {room.description ? (
            <p className="mt-1 text-secondary text-charcoal/75">
              {room.description}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-secondary text-charcoal/75">
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="size-4 text-sage-deep" aria-hidden="true" />
              {room.bedType}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4 text-sage-deep" aria-hidden="true" />
              {room.maxAdults} adults
              {room.maxChildren > 0 ? ` · ${room.maxChildren} children` : ""}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Maximize className="size-4 text-sage-deep" aria-hidden="true" />
              {room.sizeSqm} m²
            </span>
          </div>

          <AmenityList
            amenities={room.amenities}
            variant="chips"
            limit={4}
            className="mt-3"
          />

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-metadata">
            {room.freeCancellation ? (
              <span className="inline-flex items-center gap-1 font-medium text-success">
                <Check className="size-3.5" aria-hidden="true" />
                Free cancellation
              </span>
            ) : null}
            {room.breakfastIncluded ? (
              <span className="inline-flex items-center gap-1 font-medium text-success">
                <Check className="size-3.5" aria-hidden="true" />
                Breakfast included
              </span>
            ) : null}
            {typeof roomsLeft === "number" && roomsLeft <= 2 ? (
              <span className="font-medium text-warning">
                Only {roomsLeft} left
              </span>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 sm:w-40 sm:text-right">
          <p className="text-metadata text-charcoal/75">Per night</p>
          <p className="text-h3 font-semibold text-ocean">
            {formatNaira(room.pricePerNight)}
          </p>
          <p className="text-metadata text-charcoal/75">
            {formatNaira(total)} for {Math.max(nights, 1)}{" "}
            {Math.max(nights, 1) === 1 ? "night" : "nights"}
          </p>
          <Button
            type="button"
            size="sm"
            variant={selected ? "secondary" : "primary"}
            className="mt-3 w-full"
            onClick={() => onSelect?.(room)}
          >
            {selected ? "Selected" : "Select room"}
          </Button>
        </div>
      </div>
    </article>
  );
}
