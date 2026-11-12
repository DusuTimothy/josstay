import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-metadata font-medium leading-none",
  {
    variants: {
      tone: {
        neutral: "bg-sand/70 text-charcoal",
        sage: "bg-sage-soft text-ocean",
        gold: "bg-gold/15 text-[#6F5425]",
        ocean: "bg-ocean text-ivory",
        outline: "border border-sand bg-white/80 text-charcoal/80",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export interface ChipProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {}

export function Chip({ className, tone, ...props }: ChipProps) {
  return <span className={cn(chipVariants({ tone }), className)} {...props} />;
}
