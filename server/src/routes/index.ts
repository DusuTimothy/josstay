import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { bookingRoutes } from "./booking.routes";
import { hotelRoutes } from "./hotel.routes";
import { paymentRoutes } from "./payment.routes";
import { searchRoutes } from "./search.routes";
import { webhookRoutes } from "./webhook.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/hotels", hotelRoutes);
apiRouter.use("/search", searchRoutes);
apiRouter.use("/bookings", bookingRoutes);
apiRouter.use("/payments", paymentRoutes);
apiRouter.use("/webhooks", webhookRoutes);
