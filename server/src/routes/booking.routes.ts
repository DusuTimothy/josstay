import { Router } from "express";
import {
  cancelBooking,
  createBooking,
  getBookingByReference,
  listMyBookings,
  quoteBooking,
} from "../controllers/booking.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createBookingSchema,
  quoteSchema,
} from "../validators/booking.validator";

export const bookingRoutes = Router();

// Public: price a stay and check availability.
bookingRoutes.post("/quote", validate({ body: quoteSchema }), quoteBooking);

bookingRoutes.use(requireAuth);

bookingRoutes.post(
  "/",
  validate({ body: createBookingSchema }),
  createBooking,
);

bookingRoutes.get("/", listMyBookings);
bookingRoutes.get("/:reference", getBookingByReference);
bookingRoutes.post("/:reference/cancel", cancelBooking);
