export type UserRole = "guest" | "manager" | "front_desk" | "admin";

export type CancellationPolicy = "flexible" | "moderate" | "strict";

export type HotelStatus = "pending" | "approved" | "published" | "suspended";

export type HotelBadge =
  | "guest_favourite"
  | "limited_availability"
  | "verified";

export type AmenityKey =
  | "wifi"
  | "pool"
  | "spa"
  | "gym"
  | "parking"
  | "breakfast"
  | "restaurant"
  | "bar"
  | "air_conditioning"
  | "power"
  | "water"
  | "security"
  | "pet_friendly"
  | "laundry";

export type SortOption = "recommended" | "price_asc" | "price_desc" | "rating";

export interface HotelImage {
  id?: string;
  url: string;
  alt: string;
  publicId?: string;
  sortOrder?: number;
}

export interface HotelSummary {
  id: string;
  slug: string;
  name: string;
  area: string;
  city: string;
  state?: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency?: "NGN";
  imageUrl: string;
  imageAlt?: string;
  amenities: AmenityKey[];
  badges?: HotelBadge[];
  cancellationPolicy: CancellationPolicy;
  breakfastIncluded?: boolean;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  bedType: string;
  maxAdults: number;
  maxChildren: number;
  sizeSqm: number;
  pricePerNight: number;
  totalRooms: number;
  availableRooms?: number;
  amenities: AmenityKey[];
  images?: HotelImage[];
  freeCancellation?: boolean;
  breakfastIncluded?: boolean;
}

export interface HotelDetail extends HotelSummary {
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  images: HotelImage[];
  rooms: Room[];
}

export interface SearchValues {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

export interface SearchFilters {
  destination: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  propertyTypes: string[];
  amenities: AmenityKey[];
  breakfastIncluded: boolean;
  freeCancellation: boolean;
  maxDistanceKm: number;
  sort: SortOption;
}

export interface BookingQuote {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  adults: number;
  children: number;
  pricePerNight: number;
  roomTotal: number;
  taxes: number;
  total: number;
  currency: "NGN";
  freeCancellationUntil?: string;
  availableRooms: number;
}

export interface GuestDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface ReservationSummaryData {
  hotelName: string;
  hotelArea: string;
  hotelImageUrl: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guestsLabel: string;
  nights: number;
  roomTotal: number;
  taxes: number;
  total: number;
  freeCancellationUntil?: string;
  instantConfirmation?: boolean;
}
