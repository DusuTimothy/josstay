import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <Container className="py-20 sm:py-28">
      <EmptyState
        icon={Compass}
        title="This page has checked out"
        description="The page you were looking for is not here. Let's get you back to somewhere comfortable."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className={buttonVariants({ variant: "primary", size: "md" })}
            >
              Back to home
            </Link>
            <Link
              href="/search"
              className={buttonVariants({ variant: "ghost", size: "md" })}
            >
              Browse hotels
            </Link>
          </div>
        }
      />
    </Container>
  );
}
