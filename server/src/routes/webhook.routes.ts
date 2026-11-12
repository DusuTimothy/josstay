import { Router } from "express";
import { paystackWebhook } from "../controllers/webhook.controller";

export const webhookRoutes = Router();

// Public by design: Paystack authenticates with the HMAC signature.
webhookRoutes.post("/paystack", paystackWebhook);
