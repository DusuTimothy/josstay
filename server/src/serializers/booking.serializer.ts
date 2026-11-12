import type { Booking, Hotel, Room } from "../models";

type BookingWithRelations = Booking & {
  hotel?: Hotel;
  room?: Room;
};

export function serializeBooking(booking: Booking) {
  const { hotel, room } = booking as BookingWithRelations;

  return {
    id: booking.id,
    reference: booking.reference,
    status: booking.status,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    nights: booking.nights,
    rooms: booking.rooms,
    adults: booking.adults,
    children: booking.children,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    roomTotal: Number(booking.roomTotal),
    taxes: Number(booking.taxes),
    total: Number(booking.total),
    currency: booking.currency,
    commissionRate: booking.commissionRate,
    commissionAmount: Number(booking.commissionAmount),
    hotelShare: Number(booking.hotelShare),
    cancellationDeadline: booking.cancellationDeadline,
    paystackReference: booking.paystackReference,
    confirmedAt: booking.confirmedAt,
    cancelledAt: booking.cancelledAt,
    createdAt: booking.createdAt,
    hotel: hotel
      ? {
          id: hotel.id,
          slug: hotel.slug,
          name: hotel.name,
          area: hotel.area,
          city: hotel.city,
          address: hotel.address,
          phone: hotel.phone ?? undefined,
        }
      : undefined,
    room: room
      ? {
          id: room.id,
          name: room.name,
          bedType: room.bedType,
        }
      : undefined,
  };
}
