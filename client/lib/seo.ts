import { AMENITIES, SITE } from "./constants";
import type { HotelDetail } from "./types";

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE.url).toString();
}

export function hotelJsonLd(hotel: HotelDetail, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    description: hotel.description,
    url,
    image: hotel.images.map((image) => image.url),
    telephone: hotel.phone,
    email: hotel.email,
    priceRange: "₦₦",
    address: {
      "@type": "PostalAddress",
      streetAddress: hotel.address,
      addressLocality: hotel.city,
      addressRegion: hotel.state ?? "Plateau",
      addressCountry: "NG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: hotel.latitude,
      longitude: hotel.longitude,
    },
    amenityFeature: hotel.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: AMENITIES[amenity],
      value: true,
    })),
    ...(hotel.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: hotel.rating,
            reviewCount: hotel.reviewCount,
            bestRating: 10,
            worstRating: 1,
          },
        }
      : {}),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl("/icon.svg"),
    slogan: SITE.tagline,
    description: SITE.description,
    areaServed: {
      "@type": "City",
      name: "Jos",
      containedInPlace: { "@type": "State", name: "Plateau" },
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      email: SITE.email,
      contactType: "customer support",
      areaServed: "NG",
      availableLanguage: "en",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/search?destination={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
