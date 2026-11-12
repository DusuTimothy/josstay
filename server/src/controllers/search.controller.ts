import type { Request, Response } from "express";
import { Op, type Order, type WhereOptions } from "sequelize";
import { Hotel, HotelImage } from "../models";
import { serializeHotelSummary } from "../serializers/hotel.serializer";
import { asyncHandler } from "../utils/api-error";
import type { SearchQuery } from "../validators/search.validator";

function buildWhere(query: SearchQuery): WhereOptions<Hotel> {
  const conditions: WhereOptions<Hotel>[] = [{ status: "published" }];

  if (query.destination) {
    const like = `%${query.destination}%`;
    conditions.push({
      [Op.or]: [
        { name: { [Op.iLike]: like } },
        { area: { [Op.iLike]: like } },
        { city: { [Op.iLike]: like } },
        { address: { [Op.iLike]: like } },
      ],
    });
  }

  if (query.area) {
    conditions.push({ area: { [Op.iLike]: `%${query.area}%` } });
  }

  if (query.minPrice !== undefined) {
    conditions.push({ priceFrom: { [Op.gte]: query.minPrice } });
  }

  if (query.maxPrice !== undefined) {
    conditions.push({ priceFrom: { [Op.lte]: query.maxPrice } });
  }

  if (query.minRating !== undefined) {
    conditions.push({ rating: { [Op.gte]: query.minRating } });
  }

  if (query.maxDistanceKm !== undefined) {
    conditions.push({ distanceKm: { [Op.lte]: query.maxDistanceKm } });
  }

  if (query.amenities?.length) {
    // Postgres array containment: the hotel must have every selected amenity.
    conditions.push({ amenities: { [Op.contains]: query.amenities } });
  }

  if (query.breakfastIncluded !== undefined) {
    conditions.push({ breakfastIncluded: query.breakfastIncluded });
  }

  if (query.freeCancellation) {
    conditions.push({ cancellationPolicy: { [Op.ne]: "strict" } });
  }

  return { [Op.and]: conditions };
}

function buildOrder(sort: SearchQuery["sort"]): Order {
  switch (sort) {
    case "price_asc":
      return [["priceFrom", "ASC"]];
    case "price_desc":
      return [["priceFrom", "DESC"]];
    case "rating":
      return [
        ["rating", "DESC"],
        ["reviewCount", "DESC"],
      ];
    case "recommended":
    default:
      return [
        ["reviewCount", "DESC"],
        ["rating", "DESC"],
      ];
  }
}

export const searchHotels = asyncHandler(
  async (req: Request, res: Response) => {
    // `validate` has already applied defaults and coerced numbers.
    const query = req.query as unknown as SearchQuery;

    // TODO DeepSeek: when checkIn/checkOut are supplied, exclude hotels with no
    // room available for those dates. Keep the public list fast; run the exact
    // availability check again at quote/payment time.
    const { rows, count } = await Hotel.findAndCountAll({
      where: buildWhere(query),
      include: [
        {
          model: HotelImage,
          as: "images",
          separate: true,
          order: [["sortOrder", "ASC"]],
        },
      ],
      order: buildOrder(query.sort),
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
      distinct: true,
    });

    res.json({
      success: true,
      data: rows.map(serializeHotelSummary),
      meta: {
        total: count,
        page: query.page,
        limit: query.limit,
      },
    });
  },
);
