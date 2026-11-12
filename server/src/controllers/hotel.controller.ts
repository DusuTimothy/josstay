import type { Request, Response } from "express";
import { Hotel, HotelImage, Room } from "../models";
import {
  serializeHotelDetail,
  serializeHotelSummary,
} from "../serializers/hotel.serializer";
import { ApiError, asyncHandler } from "../utils/api-error";

/** Only published hotels are visible to guests. */
const PUBLISHED = "published" as const;

export const listFeaturedHotels = asyncHandler(
  async (_req: Request, res: Response) => {
    const hotels = await Hotel.findAll({
      where: { status: PUBLISHED },
      include: [
        {
          model: HotelImage,
          as: "images",
          separate: true,
          order: [["sortOrder", "ASC"]],
        },
      ],
      order: [
        ["rating", "DESC"],
        ["reviewCount", "DESC"],
      ],
      limit: 6,
    });

    res.json({
      success: true,
      data: hotels.map(serializeHotelSummary),
    });
  },
);

export const getHotelBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = String(req.params.slug);

    const hotel = await Hotel.findOne({
      where: { slug, status: PUBLISHED },
      include: [
        {
          model: HotelImage,
          as: "images",
          separate: true,
          order: [["sortOrder", "ASC"]],
        },
        {
          model: Room,
          as: "rooms",
          separate: true,
          required: false,
          where: { isActive: true },
          order: [["pricePerNight", "ASC"]],
        },
      ],
    });

    if (!hotel) {
      throw ApiError.notFound("That stay is not available.");
    }

    res.json({ success: true, data: serializeHotelDetail(hotel) });
  },
);
