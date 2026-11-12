import type { SearchFilters, SortOption } from "./types";

export const SITE = {
  name: "JosStay",
  tagline: "Your city, your stay.",
  promise: "Better stays. Better experiences.",
  description:
    "Discover verified hotels in Jos, Plateau State. Clear prices, instant confirmation and a team that knows the city.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsapp:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000",
  phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+234 800 000 0000",
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "hello@josstay.ng",
} as const;

/**
 * Google OAuth web client ID. When it is missing the Google button is not
 * rendered and guests sign in with email and password.
 */
export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";

export const NAV_LINKS = [
  { label: "Hotels", href: "/search" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Deals", href: "/search?sort=price_asc" },
  { label: "Rewards", href: "/rewards" },
] as const;

export const FOOTER_LINKS = {
  explore: [
    { label: "All hotels", href: "/search" },
    { label: "Jos City Centre", href: "/search?area=Jos%20City%20Centre" },
    { label: "Rayfield", href: "/search?area=Rayfield" },
    { label: "Shere Hills", href: "/search?area=Shere%20Hills" },
  ],
  company: [
    { label: "About JosStay", href: "/about" },
    { label: "List your hotel", href: "/partners" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "Help centre", href: "/help" },
    { label: "Cancellation options", href: "/help/cancellations" },
    { label: "Trust & safety", href: "/trust" },
    { label: "Terms & privacy", href: "/legal" },
  ],
} as const;

export const AMENITIES = {
  wifi: "Wi-Fi",
  pool: "Pool",
  spa: "Spa",
  gym: "Gym",
  parking: "Parking",
  breakfast: "Breakfast",
  restaurant: "Restaurant",
  bar: "Bar",
  air_conditioning: "Air conditioning",
  power: "Steady power",
  water: "Running water",
  security: "24/7 security",
  pet_friendly: "Pet friendly",
  laundry: "Laundry",
} as const;

export const PROPERTY_TYPES = [
  "Hotel",
  "Resort",
  "Apartment",
  "Guest house",
  "Lodge",
] as const;

export const GUEST_OPTIONS = [
  { label: "1 adult", adults: 1, children: 0 },
  { label: "2 adults", adults: 2, children: 0 },
  { label: "2 adults · 1 child", adults: 2, children: 1 },
  { label: "2 adults · 2 children", adults: 2, children: 2 },
  { label: "3 adults", adults: 3, children: 0 },
  { label: "4 adults", adults: 4, children: 0 },
] as const;

export interface Destination {
  name: string;
  area: string;
  propertyCount: number;
  imageUrl: string;
  blurb: string;
}

export const POPULAR_DESTINATIONS: Destination[] = [
  {
    name: "Jos City Centre",
    area: "Jos North",
    propertyCount: 48,
    imageUrl:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1400&q=80",
    blurb: "Markets, restaurants and the heart of the city.",
  },
  {
    name: "Rayfield",
    area: "Jos South",
    propertyCount: 32,
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
    blurb: "Quiet streets and comfortable business stays.",
  },
  {
    name: "Shere Hills",
    area: "Jos East",
    propertyCount: 14,
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
    blurb: "Views, trails and a slower pace.",
  },
  {
    name: "Bukuru",
    area: "Jos South",
    propertyCount: 21,
    imageUrl:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80",
    blurb: "Easy access to the southern business district.",
  },
  {
    name: "Terminus",
    area: "Jos North",
    propertyCount: 26,
    imageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80",
    blurb: "Central, connected and close to everything.",
  },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "rating", label: "Guest rating" },
];

export const RATING_FILTERS = [
  { value: 0, label: "Any rating" },
  { value: 8, label: "8+ Excellent" },
  { value: 7, label: "7+ Very good" },
  { value: 6, label: "6+ Good" },
] as const;

export const PRICE_MAX = 500_000;

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  destination: "",
  minPrice: 0,
  maxPrice: PRICE_MAX,
  minRating: 0,
  propertyTypes: [],
  amenities: [],
  breakfastIncluded: false,
  freeCancellation: false,
  maxDistanceKm: 0,
  sort: "recommended",
};

export const CANCELLATION_COPY = {
  flexible: "Free cancellation up to 24 hours before check-in.",
  moderate: "Free cancellation up to 3 days before check-in.",
  strict: "Free cancellation up to 7 days before check-in.",
} as const;
