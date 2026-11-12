import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-11 w-full rounded-md border border-sand bg-white px-3.5 text-body text-charcoal shadow-sm outline-none transition placeholder:text-charcoal/75 focus:border-ocean focus:ring-2 focus:ring-ocean/15 disabled:cursor-not-allowed disabled:bg-ivory disabled:text-charcoal/75",
        invalid && "border-error focus:border-error focus:ring-error/15",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
