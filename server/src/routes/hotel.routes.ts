import { Router } from "express";
import {
  getHotelBySlug,
  listFeaturedHotels,
} from "../controllers/hotel.controller";

export const hotelRoutes = Router();

hotelRoutes.get("/", listFeaturedHotels);
hotelRoutes.get("/:slug", getHotelBySlug);
