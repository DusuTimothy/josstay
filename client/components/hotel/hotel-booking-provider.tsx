"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import { api, getApiErrorMessage } from "@/lib/api";
import { nightsBetween } from "@/lib/format";
import { addDaysIso, type StayQuery } from "@/lib/stay";
import type { BookingQuote, HotelDetail, Room } from "@/lib/types";

interface HotelBookingContextValue {
  hotel: HotelDetail;
  stay: StayQuery;
  nights: number;
  selectedRoom: Room | undefined;
  quote: BookingQuote | null;
  isChecking: boolean;
  error: string | null;
  selectRoom: (roomId: string) => void;
  updateStay: (partial: Partial<StayQuery>) => void;
  checkoutHref: string | null;
}

const HotelBookingContext = createContext<HotelBookingContextValue | null>(
  null,
);

export interface HotelBookingProviderProps {
  hotel: HotelDetail;
  initialStay: StayQuery;
  children: ReactNode;
}

/**
 * Holds the room/date selection for the hotel page. The room list and the
 * sticky booking panel are separate components, so the state lives here.
 *
 * Every selection is priced by `POST /bookings/quote`; the browser never
 * decides the total. Booking creation re-prices again on the server.
 */
export function HotelBookingProvider({
  hotel,
  initialStay,
  children,
}: HotelBookingProviderProps) {
  const [stay, setStay] = useState<StayQuery>(initialStay);
  const [selectedRoomId, setSelectedRoomId] = useState(
    hotel.rooms[0]?.id ?? "",
  );
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [isChecking, setIsChecking] = useState(hotel.rooms.length > 0);
  const [error, setError] = useState<string | null>(null);

  const nights = nightsBetween(stay.checkIn, stay.checkOut);
  const selectedRoom = hotel.rooms.find(
    (room) => room.id === selectedRoomId,
  );

  const updateStay = useCallback((partial: Partial<StayQuery>) => {
    setStay((current) => {
      const next = { ...current, ...partial };

      if (partial.checkIn && next.checkOut <= next.checkIn) {
        next.checkOut = addDaysIso(next.checkIn, 3);
      }

      if (next.checkOut <= next.checkIn) {
        next.checkOut = addDaysIso(next.checkIn, 1);
      }

      return next;
    });
  }, []);

  useEffect(() => {
    if (!selectedRoomId || nights < 1) {
      setQuote(null);
      setIsChecking(false);
      setError("Choose a check-in and check-out date.");
      return;
    }

    const controller = new AbortController();
    let active = true;

    setIsChecking(true);
    setQuote(null);
    setError(null);

    api
      .post<{ success: boolean; data: BookingQuote }>(
        "/bookings/quote",
        {
          hotelId: hotel.id,
          roomId: selectedRoomId,
          checkIn: stay.checkIn,
          checkOut: stay.checkOut,
          rooms: 1,
          adults: stay.adults,
          children: stay.children,
        },
        { signal: controller.signal },
      )
      .then(({ data }) => {
        if (active) setQuote(data.data);
      })
      .catch((requestError: unknown) => {
        if (!active || axios.isCancel(requestError)) return;
        setQuote(null);
        setError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setIsChecking(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [
    hotel.id,
    selectedRoomId,
    stay.checkIn,
    stay.checkOut,
    stay.adults,
    stay.children,
    nights,
  ]);

  const checkoutHref = quote
    ? `/checkout?${new URLSearchParams({
        slug: hotel.slug,
        roomId: quote.roomId,
        checkIn: quote.checkIn,
        checkOut: quote.checkOut,
        rooms: String(quote.rooms),
        adults: String(quote.adults),
        children: String(quote.children),
      }).toString()}`
    : null;

  return (
    <HotelBookingContext.Provider
      value={{
        hotel,
        stay,
        nights,
        selectedRoom,
        quote,
        isChecking,
        error,
        selectRoom: setSelectedRoomId,
        updateStay,
        checkoutHref,
      }}
    >
      {children}
    </HotelBookingContext.Provider>
  );
}

export function useHotelBooking() {
  const context = useContext(HotelBookingContext);

  if (!context) {
    throw new Error(
      "useHotelBooking must be used inside HotelBookingProvider.",
    );
  }

  return context;
}
