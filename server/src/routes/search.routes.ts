import { Router } from "express";
import { searchHotels } from "../controllers/search.controller";
import { validate } from "../middleware/validate.middleware";
import { searchQuerySchema } from "../validators/search.validator";

export const searchRoutes = Router();

searchRoutes.get("/", validate({ query: searchQuerySchema }), searchHotels);
