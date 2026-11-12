import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant = "primary" | "reversed";
type LogoSize = "sm" | "md" | "lg";

const markSize: Record<LogoSize, string> = {
  sm: "h-7 w-auto",
  md: "h-9 w-auto",
  lg: "h-12 w-auto",
};

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
        "inline-flex items-center gap-2.5",
        variant === "reversed" ? "text-ivory" : "text-ocean",
        className,
      )}
    >
      <svg
        viewBox="0 0 40 48"
        className={cn(markSize[size], "shrink-0")}
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M20 1.5C9.8 1.5 1.5 9.8 1.5 20c0 13.6 18.5 26.5 18.5 26.5S38.5 33.6 38.5 20C38.5 9.8 30.2 1.5 20 1.5Z"
          className={variant === "reversed" ? "fill-ivory" : "fill-ocean"}
        />
        <path
          d="M14.5 28.5v-8a5.5 5.5 0 0 1 11 0v8Z"
          className={variant === "reversed" ? "fill-ocean" : "fill-ivory"}
        />
        <circle cx="20" cy="22" r="2.1" className="fill-gold" />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif tracking-[-0.035em]",
            wordmarkSize[size],
          )}
        >
          <span className="font-bold">Jos</span>
          <span className="font-normal italic">Stay</span>
        </span>
        {showTagline ? (
          <span
            className={cn(
              "mt-1 text-[11px] font-normal tracking-wide",
              variant === "reversed" ? "text-ivory/85" : "text-charcoal/75",
            )}
          >
            Your city, your stay.
          </span>
        ) : null}
      </span>
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
