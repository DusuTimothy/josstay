import bcrypt from "bcryptjs";
import { sequelize } from "../config/database";
import { env } from "../config/env";
import { Hotel, HotelImage, Room, User } from "../models";

/**
 * Development seed. Creates placeholder Jos hotels so the API and components
 * can be exercised end to end before real listings are supplied.
 *
 * Run with: npm run db:seed
 * This refuses to run in production.
 */

interface SeedRoom {
  name: string;
  description: string;
  bedType: string;
  maxAdults: number;
  maxChildren: number;
  sizeSqm: number;
  pricePerNight: number;
  totalRooms: number;
  amenities: string[];
  breakfastIncluded: boolean;
  freeCancellation: boolean;
  images?: string[];
}

interface SeedHotel {
  name: string;
  slug: string;
  description: string;
  propertyType: string;
  address: string;
  area: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  amenities: string[];
  breakfastIncluded: boolean;
  freeCancellation: boolean;
  cancellationPolicy: "flexible" | "moderate" | "strict";
  phone: string;
  email: string;
  images: { url: string; alt: string }[];
  rooms: SeedRoom[];
}

const DEMO_PASSWORD = "JosStay123!";

const HOTELS: SeedHotel[] = [
  {
    name: "Crestview Suites Jos",
    slug: "crestview-suites-jos",
    description:
      "Set on a quiet Rayfield street, Crestview Suites pairs warm, natural interiors with the small things that make a stay easy: reliable power, fast Wi-Fi and breakfast served until 10:30. The pool and garden are open to guests all day, and the city centre is a short drive away.",
    propertyType: "Hotel",
    address: "14 Crestview Close, Rayfield, Jos 930105, Plateau State",
    area: "Rayfield",
    latitude: 9.8466,
    longitude: 8.8932,
    distanceKm: 2.4,
    rating: 9.2,
    reviewCount: 1284,
    priceFrom: 62000,
    amenities: [
      "wifi",
      "pool",
      "spa",
      "gym",
      "parking",
      "breakfast",
      "restaurant",
      "power",
      "security",
    ],
    breakfastIncluded: true,
    freeCancellation: true,
    cancellationPolicy: "flexible",
    phone: "+234 803 000 0000",
    email: "stay@crestviewjos.ng",
    images: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80",
        alt: "Crestview Suites exterior at golden hour",
      },
      {
        url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
        alt: "Deluxe room with warm natural light",
      },
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
        alt: "Pool and loungers at the hotel",
      },
    ],
    rooms: [
      {
        name: "Deluxe King Room",
        description: "A calm, generous room with a king bed and garden view.",
        bedType: "1 king bed",
        maxAdults: 2,
        maxChildren: 1,
        sizeSqm: 32,
        pricePerNight: 62000,
        totalRooms: 12,
        amenities: [
          "wifi",
          "breakfast",
          "air_conditioning",
          "power",
          "water",
        ],
        breakfastIncluded: true,
        freeCancellation: true,
      },
      {
        name: "Garden Suite",
        description: "A separate sitting area opening onto the courtyard.",
        bedType: "1 king bed + sofa bed",
        maxAdults: 3,
        maxChildren: 2,
        sizeSqm: 48,
        pricePerNight: 95000,
        totalRooms: 6,
        amenities: [
          "wifi",
          "breakfast",
          "air_conditioning",
          "power",
          "water",
          "laundry",
        ],
        breakfastIncluded: true,
        freeCancellation: true,
      },
      {
        name: "Family Suite",
        description: "Two connected bedrooms made for longer stays.",
        bedType: "2 queen beds",
        maxAdults: 4,
        maxChildren: 2,
        sizeSqm: 60,
        pricePerNight: 120000,
        totalRooms: 4,
        amenities: [
          "wifi",
          "breakfast",
          "air_conditioning",
          "power",
          "water",
          "laundry",
          "parking",
        ],
        breakfastIncluded: true,
        freeCancellation: true,
      },
    ],
  },
  {
    name: "Shere Hills Lodge",
    slug: "shere-hills-lodge",
    description:
      "A hillside lodge for guests who want quiet, cool air and a view. Rooms open onto the garden, breakfast is included, and the terrace is the best place in Jos for sunrise.",
    propertyType: "Lodge",
    address: "Shere Hills Road, Jos East, Plateau State",
    area: "Shere Hills",
    latitude: 9.9495,
    longitude: 8.9641,
    distanceKm: 6.8,
    rating: 8.8,
    reviewCount: 486,
    priceFrom: 45000,
    amenities: [
      "wifi",
      "breakfast",
      "parking",
      "restaurant",
      "power",
      "water",
      "security",
    ],
    breakfastIncluded: true,
    freeCancellation: true,
    cancellationPolicy: "moderate",
    phone: "+234 803 111 1111",
    email: "hello@sherehillslodge.ng",
    images: [
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80",
        alt: "Pool deck overlooking the hills",
      },
      {
        url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
        alt: "Lodge bedroom with garden view",
      },
    ],
    rooms: [
      {
        name: "Hill View Double",
        description: "A quiet double room facing the hills.",
        bedType: "1 queen bed",
        maxAdults: 2,
        maxChildren: 1,
        sizeSqm: 28,
        pricePerNight: 45000,
        totalRooms: 8,
        amenities: ["wifi", "breakfast", "power", "water"],
        breakfastIncluded: true,
        freeCancellation: true,
      },
      {
        name: "Terrace Suite",
        description: "A suite with a private terrace and sunrise view.",
        bedType: "1 king bed",
        maxAdults: 2,
        maxChildren: 2,
        sizeSqm: 44,
        pricePerNight: 78000,
        totalRooms: 4,
        amenities: ["wifi", "breakfast", "power", "water", "parking"],
        breakfastIncluded: true,
        freeCancellation: true,
      },
    ],
  },
  {
    name: "Terminus Grand Hotel",
    slug: "terminus-grand-hotel",
    description:
      "Central, practical and close to the market. Terminus Grand is built for guests who want to be in the middle of the city with a comfortable room to return to.",
    propertyType: "Hotel",
    address: "12 Ahmadu Bello Way, Terminus, Jos 930001, Plateau State",
    area: "Terminus",
    latitude: 9.8965,
    longitude: 8.8583,
    distanceKm: 0.9,
    rating: 8.5,
    reviewCount: 932,
    priceFrom: 38000,
    amenities: [
      "wifi",
      "breakfast",
      "parking",
      "restaurant",
      "bar",
      "power",
      "security",
    ],
    breakfastIncluded: true,
    freeCancellation: true,
    cancellationPolicy: "moderate",
    phone: "+234 803 222 2222",
    email: "reservations@terminusgrand.ng",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80",
        alt: "Terminus Grand Hotel exterior",
      },
      {
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
        alt: "Modern hotel room with a city view",
      },
    ],
    rooms: [
      {
        name: "Standard Double",
        description: "A comfortable city-centre room.",
        bedType: "1 double bed",
        maxAdults: 2,
        maxChildren: 1,
        sizeSqm: 24,
        pricePerNight: 38000,
        totalRooms: 20,
        amenities: ["wifi", "breakfast", "power", "water"],
        breakfastIncluded: true,
        freeCancellation: true,
      },
      {
        name: "Executive Room",
        description: "More space, a work desk and a quiet upper floor.",
        bedType: "1 king bed",
        maxAdults: 2,
        maxChildren: 1,
        sizeSqm: 34,
        pricePerNight: 56000,
        totalRooms: 8,
        amenities: [
          "wifi",
          "breakfast",
          "air_conditioning",
          "power",
          "water",
        ],
        breakfastIncluded: true,
        freeCancellation: true,
      },
    ],
  },
  {
    name: "Bukuru Garden Hotel",
    slug: "bukuru-garden-hotel",
    description:
      "A simple, well-kept hotel with a large garden and secure parking. Good value for families and contractors working around Bukuru.",
    propertyType: "Hotel",
    address: "8 Garden Road, Bukuru, Jos South, Plateau State",
    area: "Bukuru",
    latitude: 9.7833,
    longitude: 8.8667,
    distanceKm: 8.2,
    rating: 8.1,
    reviewCount: 214,
    priceFrom: 32000,
    amenities: ["wifi", "parking", "breakfast", "water", "security"],
    breakfastIncluded: true,
    freeCancellation: false,
    cancellationPolicy: "strict",
    phone: "+234 803 333 3333",
    email: "stay@bukurugarden.ng",
    images: [
      {
        url: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80",
        alt: "Garden hotel room with soft linen",
      },
      {
        url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
        alt: "Hotel garden and seating area",
      },
    ],
    rooms: [
      {
        name: "Garden Double",
        description: "A quiet double room opening onto the garden.",
        bedType: "1 double bed",
        maxAdults: 2,
        maxChildren: 2,
        sizeSqm: 26,
        pricePerNight: 32000,
        totalRooms: 10,
        amenities: ["wifi", "breakfast", "water", "parking"],
        breakfastIncluded: true,
        freeCancellation: false,
      },
    ],
  },
  {
    name: "Rayfield Court Apartments",
    slug: "rayfield-court-apartments",
    description:
      "Serviced apartments for longer stays, with a kitchenette, a separate living area and weekly housekeeping. Close to Rayfield's restaurants and shops.",
    propertyType: "Apartment",
    address: "5 Court Road, Rayfield, Jos 930105, Plateau State",
    area: "Rayfield",
    latitude: 9.8381,
    longitude: 8.8875,
    distanceKm: 3.1,
    rating: 9.0,
    reviewCount: 156,
    priceFrom: 75000,
    amenities: [
      "wifi",
      "parking",
      "breakfast",
      "air_conditioning",
      "power",
      "water",
      "security",
      "laundry",
    ],
    breakfastIncluded: true,
    freeCancellation: true,
    cancellationPolicy: "flexible",
    phone: "+234 803 444 4444",
    email: "stay@rayfieldcourt.ng",
    images: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
        alt: "Bright apartment living area",
      },
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        alt: "Apartment kitchen and dining space",
      },
    ],
    rooms: [
      {
        name: "One-Bedroom Apartment",
        description: "A separate bedroom, living area and kitchenette.",
        bedType: "1 queen bed",
        maxAdults: 2,
        maxChildren: 2,
        sizeSqm: 55,
        pricePerNight: 75000,
        totalRooms: 6,
        amenities: [
          "wifi",
          "breakfast",
          "air_conditioning",
          "power",
          "water",
          "laundry",
        ],
        breakfastIncluded: true,
        freeCancellation: true,
      },
      {
        name: "Two-Bedroom Apartment",
        description: "Two bedrooms and a full living space for families.",
        bedType: "2 queen beds",
        maxAdults: 4,
        maxChildren: 2,
        sizeSqm: 82,
        pricePerNight: 115000,
        totalRooms: 4,
        amenities: [
          "wifi",
          "breakfast",
          "air_conditioning",
          "power",
          "water",
          "laundry",
          "parking",
        ],
        breakfastIncluded: true,
        freeCancellation: true,
      },
    ],
  },
];

async function seedUser(input: {
  firstName: string;
  lastName: string;
  email: string;
  role: "guest" | "manager" | "front_desk" | "admin";
  referralCode: string;
}) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const [user] = await User.findOrCreate({
    where: { email: input.email },
    defaults: {
      ...input,
      passwordHash,
      emailVerified: true,
    },
  });

  return user;
}

async function seed(): Promise<void> {
  if (env.NODE_ENV === "production") {
    console.error("Refusing to seed production. This script is for development only.");
    process.exit(1);
  }

  await sequelize.authenticate();

  const manager = await seedUser({
    firstName: "Demo",
    lastName: "Manager",
    email: "manager@josstay.local",
    role: "manager",
    referralCode: "JOS-MANAGER",
  });

  await seedUser({
    firstName: "Demo",
    lastName: "Admin",
    email: "admin@josstay.local",
    role: "admin",
    referralCode: "JOS-ADMIN",
  });

  for (const data of HOTELS) {
    const [hotel] = await Hotel.findOrCreate({
      where: { slug: data.slug },
      defaults: {
        managerId: manager.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        propertyType: data.propertyType,
        address: data.address,
        area: data.area,
        latitude: data.latitude,
        longitude: data.longitude,
        distanceKm: data.distanceKm,
        rating: data.rating,
        reviewCount: data.reviewCount,
        priceFrom: data.priceFrom,
        amenities: data.amenities,
        breakfastIncluded: data.breakfastIncluded,
        freeCancellation: data.freeCancellation,
        cancellationPolicy: data.cancellationPolicy,
        status: "published",
        verifiedAt: new Date(),
        publishedAt: new Date(),
        commissionRate: env.DEFAULT_COMMISSION_RATE,
        phone: data.phone,
        email: data.email,
      },
    });

    // Keep the placeholder content fresh if the seed is run again.
    await hotel.update({
      managerId: manager.id,
      name: data.name,
      description: data.description,
      propertyType: data.propertyType,
      address: data.address,
      area: data.area,
      latitude: data.latitude,
      longitude: data.longitude,
      distanceKm: data.distanceKm,
      rating: data.rating,
      reviewCount: data.reviewCount,
      priceFrom: data.priceFrom,
      amenities: data.amenities,
      breakfastIncluded: data.breakfastIncluded,
      freeCancellation: data.freeCancellation,
      cancellationPolicy: data.cancellationPolicy,
      status: "published",
      verifiedAt: hotel.verifiedAt ?? new Date(),
      publishedAt: hotel.publishedAt ?? new Date(),
      commissionRate: env.DEFAULT_COMMISSION_RATE,
      phone: data.phone,
      email: data.email,
    });

    for (const [index, image] of data.images.entries()) {
      const [record] = await HotelImage.findOrCreate({
        where: { hotelId: hotel.id, url: image.url },
        defaults: {
          hotelId: hotel.id,
          url: image.url,
          alt: image.alt,
          sortOrder: index,
        },
      });
      await record.update({ alt: image.alt, sortOrder: index });
    }

    for (const room of data.rooms) {
      const [record] = await Room.findOrCreate({
        where: { hotelId: hotel.id, name: room.name },
        defaults: {
          hotelId: hotel.id,
          name: room.name,
          description: room.description,
          bedType: room.bedType,
          maxAdults: room.maxAdults,
          maxChildren: room.maxChildren,
          sizeSqm: room.sizeSqm,
          pricePerNight: room.pricePerNight,
          totalRooms: room.totalRooms,
          amenities: room.amenities,
          images: room.images ?? [],
          breakfastIncluded: room.breakfastIncluded,
          freeCancellation: room.freeCancellation,
          isActive: true,
        },
      });

      await record.update({
        description: room.description,
        bedType: room.bedType,
        maxAdults: room.maxAdults,
        maxChildren: room.maxChildren,
        sizeSqm: room.sizeSqm,
        pricePerNight: room.pricePerNight,
        totalRooms: room.totalRooms,
        amenities: room.amenities,
        breakfastIncluded: room.breakfastIncluded,
        freeCancellation: room.freeCancellation,
        isActive: true,
      });
    }

    console.log(`  • ${data.name} (${data.rooms.length} rooms)`);
  }

  console.log(`\n✅ Seeded ${HOTELS.length} hotels.`);
  console.log("   Demo sign-in (development only):");
  console.log(`   manager@josstay.local / ${DEMO_PASSWORD}`);
  console.log(`   admin@josstay.local   / ${DEMO_PASSWORD}`);

  await sequelize.close();
}

seed().catch(async (error) => {
  console.error("❌ Seed failed:", error);
  await sequelize.close().catch(() => undefined);
  process.exit(1);
});
