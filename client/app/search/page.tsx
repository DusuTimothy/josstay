import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { Container } from "@/components/ui/container";
import { SAMPLE_HOTELS } from "@/lib/sample-data";
import { SearchResults } from "./search-results";

export const metadata: Metadata = {
  title: "Hotels in Jos",
  description:
    "Browse verified hotels in Jos, Plateau State. Compare prices, guest ratings, amenities and cancellation terms in one calm view.",
};

export default function SearchPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-sand/70 bg-white/60">
        <Container className="py-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-metadata text-charcoal/60">
              <li>
                <Link href="/" className="hover:text-ocean">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="font-medium text-charcoal">
                Hotels in Jos
              </li>
            </ol>
          </nav>

          <SearchBar className="mt-5" />
        </Container>
      </section>

      <Container className="pt-8">
        <SearchResults hotels={SAMPLE_HOTELS} />
      </Container>
    </div>
  );
}
