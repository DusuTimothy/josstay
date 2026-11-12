import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-sand/70", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function HotelCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-sand bg-white shadow-soft">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <div className="flex items-end justify-between pt-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}
