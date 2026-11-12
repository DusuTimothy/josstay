import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  CalendarCheck2,
  LockKeyhole,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrustItem {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export const DEFAULT_TRUST_ITEMS: TrustItem[] = [
  {
    icon: BadgeCheck,
    title: "Verified by JosStay",
    description: "Every property is checked in person.",
  },
  {
    icon: CalendarCheck2,
    title: "Instant confirmation",
    description: "Your booking is confirmed right away.",
  },
  {
    icon: LockKeyhole,
    title: "Secure payment",
    description: "Payments handled by Paystack.",
  },
  {
    icon: Undo2,
    title: "Clear cancellation",
    description: "The deadline is shown before you pay.",
  },
];

export interface TrustStripProps {
  items?: TrustItem[];
  variant?: "inline" | "cards";
  inverted?: boolean;
  className?: string;
}

export function TrustStrip({
  items = DEFAULT_TRUST_ITEMS,
  variant = "inline",
  inverted = false,
  className,
}: TrustStripProps) {
  if (variant === "cards") {
    return (
      <ul
        className={cn(
          "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
          className,
        )}
      >
        {items.map(({ icon: Icon, title, description }) => (
          <li
            key={title}
            className={cn(
              "rounded-lg border p-4",
              inverted
                ? "border-ivory/15 bg-ivory/5"
                : "border-sand bg-white",
            )}
          >
            <Icon
              className={cn(
                "size-5",
                inverted ? "text-gold" : "text-sage",
              )}
              aria-hidden="true"
            />
            <p
              className={cn(
                "mt-3 text-secondary font-semibold",
                inverted ? "text-ivory" : "text-ocean",
              )}
            >
              {title}
            </p>
            {description ? (
              <p
                className={cn(
                  "mt-1 text-metadata",
                  inverted ? "text-ivory/65" : "text-charcoal/60",
                )}
              >
                {description}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-3",
        className,
      )}
    >
      {items.map(({ icon: Icon, title }) => (
        <li
          key={title}
          className={cn(
            "flex items-center gap-2 text-secondary",
            inverted ? "text-ivory/80" : "text-charcoal/70",
          )}
        >
          <Icon
            className={cn("size-4", inverted ? "text-gold" : "text-sage")}
            aria-hidden="true"
          />
          {title}
        </li>
      ))}
    </ul>
  );
}
