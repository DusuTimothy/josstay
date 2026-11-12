"use client";

import { useState } from "react";
import type { HotelImage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/ui/smart-image";

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
    <div className={cn("relative", className)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-sand">
        <SmartImage
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
          className="absolute bottom-3 left-3 flex gap-2"
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
                "relative aspect-[4/3] w-16 shrink-0 overflow-hidden rounded-md border-2 shadow-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:w-20",
                index === active
                  ? "border-ivory"
                  : "border-ivory/40 opacity-80 hover:opacity-100",
              )}
            >
              <SmartImage
                src={image.url}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
