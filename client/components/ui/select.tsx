import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-11 w-full appearance-none rounded-md border border-sand bg-white pl-3.5 pr-10 text-secondary font-medium text-charcoal shadow-sm outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/15 disabled:cursor-not-allowed disabled:bg-ivory",
          invalid && "border-error focus:border-error focus:ring-error/15",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-charcoal/50"
        aria-hidden="true"
      />
    </div>
  ),
);

Select.displayName = "Select";
