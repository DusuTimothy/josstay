"use client";

import { AlertCircle, CalendarDays, Users } from "lucide-react";
import { GUEST_OPTIONS } from "@/lib/constants";
import {
  formatDateRange,
  guestsLabel,
  todayISO,
} from "@/lib/format";
import { addDaysIso } from "@/lib/stay";
import { RoomOptionCard } from "@/components/hotel/room-option-card";
import { useHotelBooking } from "@/components/hotel/hotel-booking-provider";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

/**
 * Date/guest controls and room cards. Reads its state from the shared
 * HotelBookingProvider so the sticky summary panel stays in sync.
 */
export function RoomSelectionSection() {
  const {
    hotel,
    stay,
    nights,
    selectedRoom,
    quote,
    isChecking,
    error,
    selectRoom,
    updateStay,
  } = useHotelBooking();

  const guestsIndex = Math.max(
    0,
    GUEST_OPTIONS.findIndex(
      (option) =>
        option.adults === stay.adults &&
        option.children === stay.children,
    ),
  );

  return (
    <section className="border-b border-sand py-6" aria-labelledby="rooms">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="rooms" className="text-h2 text-ocean">
            Choose your room
          </h2>
          <p className="mt-1 text-secondary text-charcoal/60">
            {formatDateRange(stay.checkIn, stay.checkOut)} · {nights}{" "}
            {nights === 1 ? "night" : "nights"} ·{" "}
            {guestsLabel(stay.adults, stay.children)}
          </p>
        </div>
        <p className="text-metadata text-charcoal/55">
          Prices include taxes and fees
        </p>
      </div>

      <div className="mt-5 grid gap-3 rounded-lg border border-sand bg-ivory/70 p-4 sm:grid-cols-3">
        <FormField id="stay-check-in" label="Check-in" required>
          <div className="relative">
            <Input
              id="stay-check-in"
              type="date"
              value={stay.checkIn}
              min={todayISO()}
              onChange={(event) =>
                updateStay({ checkIn: event.target.value })
              }
              className="pl-10"
            />
            <CalendarDays
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sage"
              aria-hidden="true"
            />
          </div>
        </FormField>

        <FormField id="stay-check-out" label="Check-out" required>
          <div className="relative">
            <Input
              id="stay-check-out"
              type="date"
              value={stay.checkOut}
              min={addDaysIso(stay.checkIn, 1)}
              onChange={(event) =>
                updateStay({ checkOut: event.target.value })
              }
              className="pl-10"
            />
            <CalendarDays
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sage"
              aria-hidden="true"
            />
          </div>
        </FormField>

        <FormField id="stay-guests" label="Guests" required>
          <div className="relative">
            <Select
              id="stay-guests"
              value={guestsIndex}
              onChange={(event) => {
                const option =
                  GUEST_OPTIONS[Number(event.target.value)] ?? GUEST_OPTIONS[0];
                updateStay({
                  adults: option.adults,
                  children: option.children,
                });
              }}
              className="pl-10"
            >
              {GUEST_OPTIONS.map((option, index) => (
                <option key={option.label} value={index}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Users
              className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-sage"
              aria-hidden="true"
            />
          </div>
        </FormField>
      </div>

      <p className="mt-3 text-metadata text-charcoal/60" aria-live="polite">
        {isChecking
          ? "Checking live availability…"
          : quote
            ? `${quote.availableRooms} ${
                quote.availableRooms === 1 ? "room" : "rooms"
              } available for these dates`
            : "Choose a room to see live availability."}
      </p>

      {error ? (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-md border border-error/25 bg-error/5 px-3.5 py-3 text-secondary text-error"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="mt-5 space-y-4">
        {hotel.rooms.map((room) => (
          <RoomOptionCard
            key={room.id}
            room={room}
            nights={nights}
            selected={selectedRoom?.id === room.id}
            availableRooms={
              selectedRoom?.id === room.id
                ? quote?.availableRooms
                : undefined
            }
            onSelect={(nextRoom) => selectRoom(nextRoom.id)}
          />
        ))}
      </div>
    </section>
  );
}
