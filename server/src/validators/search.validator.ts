import { z } from "zod";

const optionalBoolean = z
  .enum(["true", "false"])
  .transform((value) => value === "true")
  .optional();

/** Accept both repeated params and comma-separated values. */
const csvArray = z.preprocess((value) => {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return value;
}, z.array(z.string().min(1)).optional());

export const searchQuerySchema = z.object({
  destination: z.string().trim().min(1).optional(),
  area: z.string().trim().min(1).optional(),
  checkIn: z.string().date().optional(),
  checkOut: z.string().date().optional(),
  adults: z.coerce.number().int().min(1).max(16).optional(),
  children: z.coerce.number().int().min(0).max(8).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(10).optional(),
  maxDistanceKm: z.coerce.number().min(0).max(100).optional(),
  amenities: csvArray,
  propertyTypes: csvArray,
  breakfastIncluded: optionalBoolean,
  freeCancellation: optionalBoolean,
  sort: z
    .enum(["recommended", "price_asc", "price_desc", "rating"])
    .default("recommended"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
