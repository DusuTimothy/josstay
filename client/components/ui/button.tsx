import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-ocean text-ivory hover:bg-ocean/90 active:bg-ocean",
        secondary: "bg-sage text-ocean hover:bg-sage/90",
        ghost:
          "border border-ocean/25 bg-transparent text-ocean hover:border-ocean/40 hover:bg-ocean/5",
        subtle: "bg-sage-soft text-ocean hover:bg-sage-soft/75",
        danger: "bg-error text-white hover:bg-error/90",
        link: "h-auto p-0 text-ocean underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-secondary",
        md: "h-11 px-5 text-button",
        lg: "h-12 px-6 text-base",
        icon: "size-11 p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, fullWidth, isLoading, disabled, children, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
