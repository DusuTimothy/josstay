"use client";

import { useState } from "react";
import Image from "next/image";
import type { HotelImage } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface HotelGalleryProps {
  images: HotelImage[];
  hotelName: string;
  className?: string;
}

export function HotelGallery({
  images,
  hotelName,
  className,
}: HotelGalleryProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-sand">
        <Image
          src={current.url}
          alt={current.alt || `${hotelName} photo ${active + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label={`${hotelName} photo gallery`}
        >
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View photo ${index + 1} of ${images.length}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-md border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:w-24",
                index === active
                  ? "border-ocean"
                  : "border-transparent opacity-75 hover:opacity-100",
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
