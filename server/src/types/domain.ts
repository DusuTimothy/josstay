export const USER_ROLES = [
  "guest",
  "manager",
  "front_desk",
  "admin",
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const HOTEL_STATUSES = [
  "pending",
  "approved",
  "published",
  "suspended",
] as const;
export type HotelStatus = (typeof HOTEL_STATUSES)[number];

export const CANCELLATION_POLICIES = [
  "flexible",
  "moderate",
  "strict",
] as const;
export type CancellationPolicy = (typeof CANCELLATION_POLICIES)[number];

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "refunded",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "pending",
  "success",
  "failed",
  "refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const REVIEW_STATUSES = ["pending", "published", "hidden"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}
