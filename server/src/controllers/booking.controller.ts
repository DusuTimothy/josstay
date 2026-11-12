import type { Request, Response } from "express";
import { sequelize } from "../config/database";
import { env } from "../config/env";
import { AvailabilityHold, Booking, Hotel, Room } from "../models";
import { serializeBooking } from "../serializers/booking.serializer";
import { countAvailableRooms } from "../services/availability.service";
import { initializeTransaction } from "../services/paystack.service";
import { ApiError, asyncHandler } from "../utils/api-error";
import {
  addHours,
  cancellationDeadline,
  isPastDate,
  nightsBetween,
} from "../utils/dates";
import {
  generateReference,
  roundMoney,
  splitPayment,
} from "../utils/money";
import type {
  CreateBookingInput,
  QuoteInput,
} from "../validators/booking.validator";

/**
 * A room sleeps `maxAdults` per room. Multiple rooms multiply the capacity.
 * The server must enforce this, not the UI.
 */
function assertRoomFits(
  room: Room,
  input: { rooms: number; adults: number; children: number },
) {
  const adultCapacity = room.maxAdults * input.rooms;
  const childCapacity = room.maxChildren * input.rooms;

  if (input.adults > adultCapacity) {
    throw ApiError.badRequest(
      `${room.name} sleeps up to ${adultCapacity} ${
        adultCapacity === 1 ? "adult" : "adults"
      } across ${input.rooms} ${input.rooms === 1 ? "room" : "rooms"}.`,
    );
  }

  if (input.children > childCapacity) {
    throw ApiError.badRequest(
      `${room.name} allows up to ${childCapacity} ${
        childCapacity === 1 ? "child" : "children"
      } across ${input.rooms} ${input.rooms === 1 ? "room" : "rooms"}.`,
    );
  }
}

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

    assertRoomFits(room, input);

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
 * Everything that can race happens inside one transaction:
 *   1. Lock the room row (SELECT ... FOR UPDATE).
 *   2. Re-check availability with the lock held.
 *   3. Re-price server-side (never trust the client total).
 *   4. Create the Booking with status `pending` and a unique reference.
 *   5. Place an AvailabilityHold for BOOKING_HOLD_MINUTES.
 *
 * Paystack initialization happens after the commit. When Paystack is not
 * configured (local development) the booking and hold are still created so the
 * flow can be exercised end to end.
 */
export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const input = req.body as CreateBookingInput;

    if (isPastDate(input.checkIn)) {
      throw ApiError.badRequest("Check-in cannot be in the past.");
    }

    const nights = nightsBetween(input.checkIn, input.checkOut);
    if (nights < 1) {
      throw ApiError.badRequest("A stay must be at least one night.");
    }

    const result = await sequelize.transaction(async (transaction) => {
      const hotel = await Hotel.findOne({
        where: { id: input.hotelId, status: "published" },
        transaction,
      });

      if (!hotel) {
        throw ApiError.notFound("That stay is not available.");
      }

      // Lock the room row first. Every booking for this room now queues here,
      // so the availability check below cannot race another guest.
      const room = await Room.findOne({
        where: {
          id: input.roomId,
          hotelId: hotel.id,
          isActive: true,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!room) {
        throw ApiError.notFound("That room is not available.");
      }

      assertRoomFits(room, input);

      const availableRooms = await countAvailableRooms(
        {
          roomId: room.id,
          checkIn: input.checkIn,
          checkOut: input.checkOut,
        },
        { transaction, room },
      );

      if (availableRooms < input.rooms) {
        throw ApiError.conflict(
          "That room is no longer available for those dates. Please choose another room or different dates.",
        );
      }

      const pricePerNight = Number(room.pricePerNight);
      const roomTotal = roundMoney(pricePerNight * nights * input.rooms);
      const taxes = roundMoney(roomTotal * env.DEFAULT_TAX_RATE);
      const total = roundMoney(roomTotal + taxes);

      const commissionRate = Number(
        hotel.commissionRate ?? env.DEFAULT_COMMISSION_RATE,
      );
      const { commissionAmount, hotelShare } = splitPayment(
        total,
        commissionRate,
      );

      const reference = generateReference("JS");
      const freeCancellationUntil = room.freeCancellation
        ? cancellationDeadline(input.checkIn, hotel.cancellationPolicy)
        : null;
      const holdExpiresAt = addHours(
        new Date(),
        env.BOOKING_HOLD_MINUTES,
      );

      const booking = await Booking.create(
        {
          reference,
          userId: req.user!.id,
          hotelId: hotel.id,
          roomId: room.id,
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          nights,
          rooms: input.rooms,
          adults: input.adults,
          children: input.children,
          status: "pending",
          guestName: input.guestName,
          guestEmail: input.guestEmail,
          guestPhone: input.guestPhone,
          roomTotal,
          taxes,
          total,
          currency: hotel.currency,
          commissionRate,
          commissionAmount,
          hotelShare,
          cancellationDeadline: freeCancellationUntil
            ? new Date(`${freeCancellationUntil}T23:59:59Z`)
            : null,
          paystackReference: reference,
        },
        { transaction },
      );

      await AvailabilityHold.create(
        {
          roomId: room.id,
          sessionId: booking.id,
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          rooms: input.rooms,
          expiresAt: holdExpiresAt,
        },
        { transaction },
      );

      return { booking, hotel, room, holdExpiresAt };
    });

    let payment: {
      authorizationUrl: string;
      accessCode: string;
      reference: string;
    } | null = null;

    // Step 5 wires the full payment flow. This keeps the booking endpoint
    // useful today while making the Paystack handoff automatic once keys and
    // the hotel subaccount are present.
    if (env.PAYSTACK_SECRET_KEY && result.hotel.paystackSubaccountCode) {
      try {
        const initialized = await initializeTransaction({
          email: input.guestEmail,
          amount: Number(result.booking.total),
          reference: result.booking.reference,
          callbackUrl: `${env.WEB_URL}/checkout/complete?reference=${encodeURIComponent(result.booking.reference)}`,
          subaccount: result.hotel.paystackSubaccountCode,
          bearer: "subaccount",
          metadata: {
            bookingId: result.booking.id,
            hotelId: result.hotel.id,
            roomId: result.room.id,
          },
        });

        payment = {
          authorizationUrl: initialized.authorization_url,
          accessCode: initialized.access_code,
          reference: initialized.reference,
        };
      } catch (error) {
        // The hold is still valid, so the guest can retry payment. Do not lose
        // the booking because a payment provider call failed.
        console.error("[bookings] Paystack initialization failed:", error);
      }
    }

    const serialized = serializeBooking(result.booking);

    res.status(201).json({
      success: true,
      data: {
        booking: {
          ...serialized,
          hotel: {
            id: result.hotel.id,
            slug: result.hotel.slug,
            name: result.hotel.name,
            area: result.hotel.area,
            city: result.hotel.city,
            address: result.hotel.address,
            phone: result.hotel.phone ?? undefined,
          },
          room: {
            id: result.room.id,
            name: result.room.name,
            bedType: result.room.bedType,
          },
        },
        payment,
        holdExpiresAt: result.holdExpiresAt.toISOString(),
      },
    });
  },
);

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
