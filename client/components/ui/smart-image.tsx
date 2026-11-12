"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SmartImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
}

/**
 * An image that degrades to a branded placeholder instead of a broken image.
 *
 * Hotel photos come from Cloudinary in production, and any of them can be
 * slow, blocked or missing. A listing must still look finished when that
 * happens, so the frame keeps its shape and shows a calm building mark.
 */
export function SmartImage({
  src,
  alt,
  className,
  fill,
  ...props
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-sage-soft/80 text-sage-deep",
          fill ? "absolute inset-0" : "h-full w-full",
          className,
        )}
      >
        <Building2 className="size-8" aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
