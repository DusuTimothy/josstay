"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";

export function Header({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-sand/70 bg-ivory/90 backdrop-blur-md",
        className,
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-20">
        <Logo size="md" />

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-sm text-secondary font-medium text-charcoal/75 transition-colors hover:text-ocean focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "border-sand",
            )}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className={buttonVariants({ variant: "primary", size: "sm" })}
          >
            Create account
          </Link>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X aria-hidden="true" />
          ) : (
            <Menu aria-hidden="true" />
          )}
          <span className="sr-only">
            {open ? "Close menu" : "Open menu"}
          </span>
        </Button>
      </Container>

      {open ? (
        <div
          id="mobile-navigation"
          className="border-t border-sand bg-ivory lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-body font-medium text-charcoal transition-colors hover:bg-sage-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2 border-t border-sand pt-4">
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full",
                )}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "primary" }),
                  "w-full",
                )}
              >
                Create account
              </Link>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
