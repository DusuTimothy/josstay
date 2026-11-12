import type { Request, Response } from "express";
import { env } from "../config/env";
import { Booking, Hotel, Room } from "../models";
import { serializeBooking } from "../serializers/booking.serializer";
import { countAvailableRooms } from "../services/availability.service";
import { ApiError, asyncHandler } from "../utils/api-error";
import {
  cancellationDeadline,
  isPastDate,
  nightsBetween,
} from "../utils/dates";
import { roundMoney } from "../utils/money";
import type { QuoteInput } from "../validators/booking.validator";

/**
 * Price a stay and check live availability. This is the contract the client
 * uses on the hotel page and at checkout.
 */
export const quoteBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const input = req.body as QuoteInput;

    if (isPastDate(input.checkIn)) {
      throw ApiError.badRequest("Check-in cannot be in the past.");
    }

    const nights = nightsBetween(input.checkIn, input.checkOut);
    if (nights < 1) {
      throw ApiError.badRequest("A stay must be at least one night.");
    }

    const [hotel, room] = await Promise.all([
      Hotel.findByPk(input.hotelId),
      Room.findOne({
        where: {
          id: input.roomId,
          hotelId: input.hotelId,
          isActive: true,
        },
      }),
    ]);

    if (!hotel || hotel.status !== "published") {
      throw ApiError.notFound("That stay is not available.");
    }

    if (!room) {
      throw ApiError.notFound("That room is not available.");
    }

    const availableRooms = await countAvailableRooms({
      roomId: room.id,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
    });

    if (availableRooms < input.rooms) {
      throw ApiError.conflict(
        "That room is no longer available for those dates. Please choose another room or different dates.",
      );
    }

    const pricePerNight = Number(room.pricePerNight);
    const roomTotal = roundMoney(pricePerNight * nights * input.rooms);
    const taxes = roundMoney(roomTotal * env.DEFAULT_TAX_RATE);
    const total = roundMoney(roomTotal + taxes);

    const freeCancellationUntil = room.freeCancellation
      ? cancellationDeadline(input.checkIn, hotel.cancellationPolicy)
      : null;

    res.json({
      success: true,
      data: {
        hotelId: hotel.id,
        roomId: room.id,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        nights,
        rooms: input.rooms,
        adults: input.adults,
        children: input.children,
        pricePerNight,
        roomTotal,
        taxes,
        total,
        currency: hotel.currency,
        freeCancellationUntil: freeCancellationUntil ?? undefined,
        availableRooms,
      },
    });
  },
);

/**
 * Create the pending booking, then hand off to Paystack.
 *
 * DeepSeek: implement in one transaction:
 *   1. Lock the room row (SELECT ... FOR UPDATE).
 *   2. Re-check availability.
 *   3. Re-price server-side (never trust the client total).
 *   4. Create the Booking with status `pending` and a unique reference.
 *   5. Place an AvailabilityHold for BOOKING_HOLD_MINUTES.
 *   6. Initialize the Paystack transaction with the hotel's subaccount and
 *      `bearer: "subaccount"`, then return its authorization_url.
 */
export const createBooking = asyncHandler(async () => {
  throw ApiError.notImplemented(
    "Booking creation is not implemented yet. The endpoint contract is POST /api/v1/bookings with hotelId, roomId, checkIn, checkOut, rooms, adults, children, guestName, guestEmail and guestPhone. It must re-price and re-check availability inside one transaction before creating the booking and Paystack transaction.",
  );
});

export const listMyBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const bookings = await Booking.findAll({
      where: { userId: req.user!.id },
      include: [
        {
          model: Hotel,
          as: "hotel",
          attributes: ["id", "slug", "name", "area", "city", "address", "phone"],
        },
        { model: Room, as: "room", attributes: ["id", "name", "bedType"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: bookings.map(serializeBooking),
    });
  },
);

export const getBookingByReference = asyncHandler(
  async (req: Request, res: Response) => {
    const reference = String(req.params.reference);

    const booking = await Booking.findOne({
      where: { reference },
      include: [
        {
          model: Hotel,
          as: "hotel",
          attributes: ["id", "slug", "name", "area", "city", "address", "phone"],
        },
        { model: Room, as: "room", attributes: ["id", "name", "bedType"] },
      ],
    });

    if (!booking) {
      throw ApiError.notFound("That booking could not be found.");
    }

    const canView =
      booking.userId === req.user!.id ||
      req.user!.role === "admin" ||
      req.user!.role === "manager" ||
      req.user!.role === "front_desk";

    if (!canView) {
      throw ApiError.forbidden();
    }

    res.json({ success: true, data: serializeBooking(booking) });
  },
);

/**
 * DeepSeek: apply the cancellation policy, refund through Paystack when the
 * booking is inside the free-cancellation window, release any hold, then email
 * the guest. Only mark the booking `refunded` after Paystack confirms.
 */
export const cancelBooking = asyncHandler(async () => {
  throw ApiError.notImplemented(
    "Booking cancellation is not implemented yet. It must apply the hotel's cancellation policy, call the Paystack Refund API when eligible, and only mark the booking refunded after Paystack confirms.",
  );
});
