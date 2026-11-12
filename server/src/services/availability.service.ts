import { Op } from "sequelize";
import { env } from "../config/env";
import {
  AvailabilityHold,
  BlockedDate,
  Booking,
  Room,
} from "../models";
import { ApiError } from "../utils/api-error";
import { addHours } from "../utils/dates";

export interface AvailabilityInput {
  roomId: string;
  checkIn: string;
  checkOut: string;
}

/**
 * Available rooms = total rooms
 *   − confirmed bookings for overlapping dates
 *   − active (unexpired) checkout holds
 *   − rooms blocked by the hotel
 *
 * This is a read-only calculation. The final check must run inside the payment
 * transaction with a row lock (SELECT ... FOR UPDATE) so two guests cannot take
 * the last room.
 */
export async function countAvailableRooms({
  roomId,
  checkIn,
  checkOut,
}: AvailabilityInput): Promise<number> {
  const room = await Room.findByPk(roomId);

  if (!room || !room.isActive) {
    throw ApiError.notFound("That room is not available.");
  }

  const now = new Date();

  const [bookedRooms, heldRooms, blockedRooms] = await Promise.all([
    Booking.sum("rooms", {
      where: {
        roomId,
        status: { [Op.in]: ["confirmed"] },
        checkIn: { [Op.lt]: checkOut },
        checkOut: { [Op.gt]: checkIn },
      },
    }),
    AvailabilityHold.sum("rooms", {
      where: {
        roomId,
        expiresAt: { [Op.gt]: now },
        checkIn: { [Op.lt]: checkOut },
        checkOut: { [Op.gt]: checkIn },
      },
    }),
    BlockedDate.sum("roomsBlocked", {
      where: {
        roomId,
        startDate: { [Op.lt]: checkOut },
        endDate: { [Op.gt]: checkIn },
      },
    }),
  ]);

  return Math.max(
    0,
    room.totalRooms -
      Number(bookedRooms ?? 0) -
      Number(heldRooms ?? 0) -
      Number(blockedRooms ?? 0),
  );
}

export async function createAvailabilityHold(input: AvailabilityInput & {
  rooms: number;
  sessionId: string;
  minutes?: number;
}) {
  const available = await countAvailableRooms(input);

  if (available < input.rooms) {
    throw ApiError.conflict(
      "That room is no longer available for those dates. Please choose another room.",
    );
  }

  return AvailabilityHold.create({
    roomId: input.roomId,
    sessionId: input.sessionId,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    rooms: input.rooms,
    expiresAt: addHours(new Date(), input.minutes ?? env.BOOKING_HOLD_MINUTES),
  });
}

export async function releaseExpiredHolds(): Promise<number> {
  return AvailabilityHold.destroy({
    where: { expiresAt: { [Op.lt]: new Date() } },
  });
}
