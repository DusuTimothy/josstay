"use client";

import { BookingPanel } from "@/components/hotel/booking-panel";
import { useHotelBooking } from "@/components/hotel/hotel-booking-provider";
import { guestsLabel } from "@/lib/format";

/**
 * Sticky summary for the hotel page. The price comes from the quote endpoint
 * so what the guest sees here matches what checkout and booking will charge.
 */
export function HotelBookingPanel() {
  const {
    hotel,
    stay,
    nights,
    selectedRoom,
    quote,
    isChecking,
    checkoutHref,
  } = useHotelBooking();

  const room = selectedRoom ?? hotel.rooms[0];

  if (!room) return null;

  const pricePerNight = quote?.pricePerNight ?? room.pricePerNight;
  const total =
    quote?.total ?? room.pricePerNight * Math.max(nights, 1);

  return (
    <BookingPanel
      checkIn={stay.checkIn}
      checkOut={stay.checkOut}
      guestsLabel={guestsLabel(stay.adults, stay.children)}
      roomName={room.name}
      nights={nights}
      pricePerNight={pricePerNight}
      total={total}
      freeCancellationUntil={quote?.freeCancellationUntil}
      reserveHref={checkoutHref ?? undefined}
      isLoading={isChecking}
      reserveDisabled={!quote}
    />
  );
}
