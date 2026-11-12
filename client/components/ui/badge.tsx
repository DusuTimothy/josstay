import type { HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-metadata font-semibold leading-none",
  {
    variants: {
      tone: {
        verified: "bg-ocean text-ivory",
        favourite: "bg-gold text-ocean",
        limited: "bg-sand text-charcoal",
        success: "bg-sage-soft text-success",
        outline: "border border-ocean/20 bg-white/90 text-ocean",
      },
    },
    defaultVariants: {
      tone: "outline",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: ReactNode;
}

export function Badge({ className, tone, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {icon}
      {children}
    </span>
  );
}
