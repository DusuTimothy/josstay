import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant = "primary" | "reversed";
type LogoSize = "sm" | "md" | "lg";

const wordmarkSize: Record<LogoSize, string> = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

export interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  showTagline?: boolean;
  href?: string | null;
  className?: string;
}

/**
 * The wordmark is lowercase and closed with a period, set in the interface
 * face at bold weight with tight tracking.
 */
export function Logo({
  variant = "primary",
  size = "md",
  showTagline = false,
  href = "/",
  className,
}: LogoProps) {
  const content = (
    <span
      className={cn(
        "inline-flex flex-col leading-none",
        variant === "reversed" ? "text-ivory" : "text-ocean",
        className,
      )}
    >
      <span
        className={cn(
          "font-sans font-bold lowercase tracking-[-0.045em]",
          wordmarkSize[size],
        )}
      >
        josstay.
      </span>
      {showTagline ? (
        <span
          className={cn(
            "mt-1.5 text-[11px] font-normal tracking-wide",
            variant === "reversed" ? "text-ivory/85" : "text-charcoal/75",
          )}
        >
          Your city, your stay.
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label="JosStay home"
      className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
    >
      {content}
    </Link>
  );
}
