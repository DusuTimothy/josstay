import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full resize-y rounded-md border border-sand bg-white px-3.5 py-3 text-body text-charcoal shadow-sm outline-none transition placeholder:text-charcoal/40 focus:border-ocean focus:ring-2 focus:ring-ocean/15 disabled:cursor-not-allowed disabled:bg-ivory",
        invalid && "border-error focus:border-error focus:ring-error/15",
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
