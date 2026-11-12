import { z } from "zod";

const staySchema = z.object({
  hotelId: z.string().uuid(),
  roomId: z.string().uuid(),
  checkIn: z.string().date(),
  checkOut: z.string().date(),
  rooms: z.coerce.number().int().min(1).max(5).default(1),
  adults: z.coerce.number().int().min(1).max(16).default(2),
  children: z.coerce.number().int().min(0).max(8).default(0),
});

function checkStayRange(
  data: { checkIn: string; checkOut: string },
  ctx: z.RefinementCtx,
) {
  if (new Date(data.checkOut) <= new Date(data.checkIn)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["checkOut"],
      message: "Check-out must be after check-in.",
    });
  }
}

export const quoteSchema = staySchema.superRefine(checkStayRange);

export const createBookingSchema = staySchema
  .extend({
    guestName: z.string().trim().min(2).max(160),
    guestEmail: z.string().trim().toLowerCase().email(),
    guestPhone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s-]{7,20}$/, "Enter a valid phone number"),
  })
  .superRefine(checkStayRange);

export const initializePaymentSchema = z.object({
  bookingId: z.string().uuid(),
  callbackUrl: z.string().url().optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type InitializePaymentInput = z.infer<typeof initializePaymentSchema>;
