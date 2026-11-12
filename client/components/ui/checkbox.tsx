import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "group flex cursor-pointer items-start gap-3 text-secondary text-charcoal",
          className,
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-[6px] border-sand accent-ocean focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
        <span className="leading-snug">
          <span className="font-medium">{label}</span>
          {description ? (
            <span className="mt-0.5 block text-metadata text-charcoal/60">
              {description}
            </span>
          ) : null}
        </span>
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
