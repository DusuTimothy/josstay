"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps {
  id?: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Toggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  className,
}: ToggleProps) {
  const generatedId = useId();
  const labelId = `${id ?? generatedId}-label`;
  const descriptionId = `${id ?? generatedId}-description`;

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <span className="text-secondary text-charcoal">
        <span id={labelId} className="block font-medium">
          {label}
        </span>
        {description ? (
          <span
            id={descriptionId}
            className="mt-0.5 block text-metadata text-charcoal/75"
          >
            {description}
          </span>
        ) : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={description ? descriptionId : undefined}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-ocean" : "bg-sand",
        )}
      >
        <span
          className={cn(
            "inline-block size-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
