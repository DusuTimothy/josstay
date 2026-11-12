import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-sand bg-white/60 px-6 py-14 text-center",
        className,
      )}
    >
      {Icon ? (
        <span className="mb-4 grid size-12 place-items-center rounded-full bg-sage-soft text-ocean">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      ) : null}
      <h3 className="text-h3 text-ocean">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-secondary text-charcoal/70">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
