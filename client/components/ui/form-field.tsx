import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FieldError({
  id,
  children,
  className,
}: {
  id?: string;
  children?: ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn("text-metadata font-medium text-error", className)}
    >
      {children}
    </p>
  );
}

export interface FormFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optionalLabel?: string;
  className?: string;
  children: ReactNode;
}

export function FormField({
  id,
  label,
  hint,
  error,
  required,
  optionalLabel = "Optional",
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-secondary font-medium text-charcoal"
        >
          {label}
          {required ? (
            <span className="ml-0.5 text-error" aria-hidden="true">
              *
            </span>
          ) : (
            <span className="ml-2 text-metadata font-normal text-charcoal/75">
              {optionalLabel}
            </span>
          )}
        </label>
      </div>
      {children}
      {error ? (
        <FieldError id={`${id}-error`}>{error}</FieldError>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-metadata text-charcoal/75">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
