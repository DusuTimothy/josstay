import { Star } from "lucide-react";
import { compactNumber, ratingLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface StarsProps {
  score: number;
  className?: string;
}

export function Stars({ score, className }: StarsProps) {
  const filled = Math.round(score / 2);

  return (
    <span
      role="img"
      aria-label={`${score.toFixed(1)} out of 10`}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "size-3.5",
            index < filled
              ? "fill-gold text-gold"
              : "fill-transparent text-gold/35",
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export interface RatingProps {
  score: number;
  reviewCount?: number;
  label?: string;
  showStars?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/**
 * A gold star, the score, the descriptor and the review count — the order
 * the deck uses on every listing.
 */
export function Rating({
  score,
  reviewCount,
  label,
  showStars = false,
  size = "md",
  className,
}: RatingProps) {
  const descriptor = label ?? ratingLabel(score);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-1.5 gap-y-1",
        className,
      )}
    >
      <Star
        className={cn(
          "fill-gold text-gold",
          size === "sm" ? "size-3.5" : "size-4",
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          "font-semibold text-charcoal",
          size === "sm" ? "text-metadata" : "text-secondary",
        )}
      >
        {score.toFixed(1)}
      </span>
      <span
        className={cn(
          "text-charcoal/75",
          size === "sm" ? "text-metadata" : "text-secondary",
        )}
      >
        {descriptor}
      </span>
      {showStars ? <Stars score={score} /> : null}
      {typeof reviewCount === "number" ? (
        <span className="text-metadata text-charcoal/75">
          ({compactNumber(reviewCount)} reviews)
        </span>
      ) : null}
    </div>
  );
}
