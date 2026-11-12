import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { Container } from "@/components/ui/container";
import { SAMPLE_HOTELS } from "@/lib/sample-data";
import {
  buildSearchParams,
  guestOptionIndex,
  parseSearchState,
} from "@/lib/search";
import { fetchSearchResults } from "@/lib/server-api";
import { SearchResults } from "./search-results";

export const metadata: Metadata = {
  title: "Hotels in Jos",
  description:
    "Browse verified hotels in Jos, Plateau State. Compare prices, guest ratings, amenities and cancellation terms in one calm view.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const state = parseSearchState(query);
  const params = buildSearchParams(state);

  let hotels = SAMPLE_HOTELS;
  let total = SAMPLE_HOTELS.length;
  let usedFallback = true;

  try {
    const result = await fetchSearchResults(params);
    hotels = result.hotels;
    total = result.total;
    usedFallback = false;
  } catch (error) {
    // The sample content keeps local development usable when the API is down.
    // In production a failed search must be visible, not silently replaced.
    if (process.env.NODE_ENV === "production") throw error;
    console.error("[search] API unavailable, using sample hotels:", error);
  }

  const stay = {
    checkIn: state.checkIn,
    checkOut: state.checkOut,
    adults: state.adults,
    children: state.children,
  };

  return (
    <div className="pb-20">
      <section className="border-b border-sand/70 bg-white/60">
        <Container className="py-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-metadata text-charcoal/75">
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

          <SearchBar
            className="mt-5"
            defaultDestination={state.destination}
            defaultCheckIn={state.checkIn}
            defaultCheckOut={state.checkOut}
            defaultGuestsIndex={guestOptionIndex(
              state.adults,
              state.children,
            )}
          />
        </Container>
      </section>

      <Container className="pt-8">
        <SearchResults
          key={params.toString()}
          hotels={hotels}
          total={total}
          initialFilters={state.filters}
          destination={state.destination}
          stay={stay}
          applyLocalFilters={usedFallback}
        />
      </Container>
    </div>
  );
}
