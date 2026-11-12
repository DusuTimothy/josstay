import type { Request, Response } from "express";
import { ApiError, asyncHandler } from "../utils/api-error";
import { verifyWebhookSignature } from "../services/paystack.service";

interface PaystackWebhookPayload {
  event?: string;
  data?: {
    reference?: string;
    status?: string;
    amount?: number;
    currency?: string;
  };
}

/**
 * Paystack webhook.
 *
 * The signature is checked against the raw request body (captured in app.ts),
 * then we always answer 200 quickly so Paystack does not retry in a loop.
 *
 * DeepSeek: make the `charge.success` handler idempotent:
 *   - find the Payment by reference
 *   - if already `success`, return 200 without doing anything
 *   - otherwise confirm the booking, store the payload, release the hold, and
 *     send the confirmation email/WhatsApp
 * Also handle `charge.failed`, `transfer.success` and refund events.
 */
export const paystackWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    const signature = req.headers["x-paystack-signature"];

    if (typeof signature !== "string" || !signature) {
      throw ApiError.badRequest("Missing Paystack signature.");
    }

    if (!req.rawBody) {
      throw new ApiError(400, "Raw request body was not captured.");
    }

    if (!verifyWebhookSignature(req.rawBody, signature)) {
      throw ApiError.unauthorized("Invalid Paystack signature.");
    }

    const payload = req.body as PaystackWebhookPayload;

    console.log(
      `[paystack] Verified webhook: ${payload.event ?? "unknown"} ${
        payload.data?.reference ?? ""
      }`,
    );

    // Acknowledge even when we do not process the event yet.
    res.status(200).json({ received: true });
  },
);
