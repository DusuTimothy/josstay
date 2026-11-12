import { Router } from "express";
import {
  initializePayment,
  refundPayment,
  verifyPayment,
} from "../controllers/payment.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { initializePaymentSchema } from "../validators/booking.validator";

export const paymentRoutes = Router();

paymentRoutes.use(requireAuth);

paymentRoutes.post(
  "/initialize",
  validate({ body: initializePaymentSchema }),
  initializePayment,
);

paymentRoutes.get("/verify/:reference", verifyPayment);

paymentRoutes.post("/refund", requireRole("admin"), refundPayment);
