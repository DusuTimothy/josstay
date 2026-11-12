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

export function Rating({
  score,
  reviewCount,
  label,
  showStars = true,
  size = "md",
  className,
}: RatingProps) {
  const descriptor = label ?? ratingLabel(score);

  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-md bg-sage font-semibold text-white",
          size === "sm" ? "min-w-8 px-1.5 py-0.5 text-xs" : "min-w-9 px-2 py-1 text-sm",
        )}
        aria-label={`Guest score ${score.toFixed(1)} out of 10`}
      >
        {score.toFixed(1)}
      </span>
      <span
        className={cn(
          "font-medium text-ocean",
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
