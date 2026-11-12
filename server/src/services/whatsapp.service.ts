import axios from "axios";
import { env } from "../config/env";

function normalizeNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("0")) return `234${digits.slice(1)}`;
  if (digits.startsWith("234")) return digits;
  return digits;
}

export interface WhatsAppBookingData {
  reference: string;
  guestName: string;
  hotelName: string;
  hotelAddress: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  total: number;
  hotelPhone?: string;
  mapUrl?: string;
}

/**
 * Sends the booking confirmation through the WhatsApp Cloud API.
 * Configure WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN in server/.env.
 */
export async function sendWhatsAppBookingConfirmation(
  phone: string,
  data: WhatsAppBookingData,
): Promise<void> {
  if (!env.WHATSAPP_PHONE_NUMBER_ID || !env.WHATSAPP_ACCESS_TOKEN) {
    console.warn("[whatsapp] Credentials are not set — message skipped.");
    return;
  }

  const lines = [
    `Hello ${data.guestName}, your JosStay booking is confirmed.`,
    "",
    `*${data.hotelName}*`,
    data.hotelAddress,
    `${data.roomName}`,
    `${data.checkIn} → ${data.checkOut}`,
    `Reference: ${data.reference}`,
    `Total paid: ₦${new Intl.NumberFormat("en-NG").format(data.total)}`,
    data.hotelPhone ? `Hotel phone: ${data.hotelPhone}` : "",
    data.mapUrl ? `Map: ${data.mapUrl}` : "",
    "",
    "If the hotel cannot honour this booking, JosStay will make it right.",
  ].filter(Boolean);

  try {
    await axios.post(
      `https://graph.facebook.com/v21.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: normalizeNumber(phone),
        type: "text",
        text: {
          preview_url: false,
          body: lines.join("\n"),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 15_000,
      },
    );
  } catch (error) {
    // Same as email: never fail the verified payment webhook because a
    // notification failed. DeepSeek: move to a retryable outbox/queue.
    console.error("[whatsapp] Could not send message:", error);
  }
}
