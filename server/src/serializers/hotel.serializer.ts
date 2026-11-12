import type { Hotel, HotelImage, Room } from "../models";

type HotelWithRelations = Hotel & {
  images?: HotelImage[];
  rooms?: Room[];
};

function imagesOf(hotel: Hotel): HotelImage[] {
  return (hotel as HotelWithRelations).images ?? [];
}

function roomsOf(hotel: Hotel): Room[] {
  return (hotel as HotelWithRelations).rooms ?? [];
}

export function serializeRoom(room: Room) {
  return {
    id: room.id,
    name: room.name,
    description: room.description ?? "",
    bedType: room.bedType,
    maxAdults: room.maxAdults,
    maxChildren: room.maxChildren,
    sizeSqm: room.sizeSqm,
    pricePerNight: Number(room.pricePerNight),
    totalRooms: room.totalRooms,
    amenities: room.amenities,
    images: (room.images ?? []).map((url) => ({ url, alt: room.name })),
    freeCancellation: room.freeCancellation,
    breakfastIncluded: room.breakfastIncluded,
  };
}

export function serializeHotelSummary(hotel: Hotel) {
  const images = imagesOf(hotel);
  const cover = images[0];

  return {
    id: hotel.id,
    slug: hotel.slug,
    name: hotel.name,
    area: hotel.area,
    city: hotel.city,
    state: hotel.state,
    propertyType: hotel.propertyType,
    distanceKm: Number(hotel.distanceKm ?? 0),
    rating: Number(hotel.rating ?? 0),
    reviewCount: hotel.reviewCount,
    pricePerNight: Number(hotel.priceFrom),
    currency: hotel.currency,
    imageUrl: cover?.url ?? "",
    imageAlt: cover?.alt ?? hotel.name,
    amenities: hotel.amenities,
    cancellationPolicy: hotel.cancellationPolicy,
    breakfastIncluded: hotel.breakfastIncluded,
    badges: [
      ...(hotel.verifiedAt ? (["verified"] as const) : []),
      ...(hotel.freeCancellation ? [] : []),
    ],
  };
}

export function serializeHotelDetail(hotel: Hotel) {
  return {
    ...serializeHotelSummary(hotel),
    description: hotel.description ?? "",
    address: hotel.address,
    latitude: Number(hotel.latitude ?? 0),
    longitude: Number(hotel.longitude ?? 0),
    phone: hotel.phone ?? undefined,
    email: hotel.email ?? undefined,
    images: imagesOf(hotel).map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      sortOrder: image.sortOrder,
    })),
    rooms: roomsOf(hotel).map(serializeRoom),
  };
}
