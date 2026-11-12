import type { Request, Response } from "express";
import { ApiError, asyncHandler } from "../utils/api-error";
import type { InitializePaymentInput } from "../validators/booking.validator";

/**
 * Initialize a Paystack transaction for a pending booking.
 *
 * DeepSeek: load the booking, verify the amount against the server-side total,
 * create the Paystack transaction with the hotel's subaccount and
 * `bearer: "subaccount"` (the hotel carries the Paystack fee), then return
 * `{ authorizationUrl, accessCode, reference }`.
 */
export const initializePayment = asyncHandler(async (req: Request) => {
  const input = req.body as InitializePaymentInput;

  throw ApiError.notImplemented(
    `Payment initialization for booking ${input.bookingId} is not implemented yet. It must verify the booking total, create a Paystack transaction for the hotel's subaccount with bearer: "subaccount", and return the authorization URL.`,
  );
});

/**
 * Verify a transaction after the guest returns from Paystack.
 *
 * DeepSeek: verify with Paystack, compare amount/currency/reference, update the
 * Payment and Booking idempotently, release the hold, send Brevo + WhatsApp
 * confirmations, and return the confirmed booking.
 */
export const verifyPayment = asyncHandler(
  async (_req: Request, _res: Response) => {
    throw ApiError.notImplemented(
      "Payment verification is not implemented yet. It must verify the reference with Paystack, match the amount and currency to the booking, and confirm the booking idempotently.",
    );
  },
);

/**
 * Refund a transaction through Paystack. Admin only.
 *
 * DeepSeek: refunds on split transactions complete asynchronously, so only move
 * the booking to `refunded` after Paystack confirms.
 */
export const refundPayment = asyncHandler(
  async (_req: Request, _res: Response) => {
    throw ApiError.notImplemented(
      "Refunds are not implemented yet. They must call the Paystack Refund API and wait for confirmation before marking the booking refunded.",
    );
  },
);
