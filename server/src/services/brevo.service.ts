import axios from "axios";
import { env } from "../config/env";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function naira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface BookingEmailData {
  reference: string;
  guestName: string;
  hotelName: string;
  hotelAddress: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
  freeCancellationUntil?: string;
  hotelPhone?: string;
  mapUrl?: string;
  bookingUrl?: string;
}

async function sendEmail(input: {
  to: { email: string; name: string };
  subject: string;
  htmlContent: string;
}): Promise<void> {
  if (!env.BREVO_API_KEY) {
    console.warn("[brevo] BREVO_API_KEY is not set — email skipped.");
    return;
  }

  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: env.BREVO_SENDER_NAME,
          email: env.BREVO_SENDER_EMAIL,
        },
        to: [input.to],
        subject: input.subject,
        htmlContent: input.htmlContent,
      },
      {
        headers: {
          "api-key": env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 15_000,
      },
    );
  } catch (error) {
    // Do not fail the verified webhook because email delivery hiccuped.
    // DeepSeek: move this to a queue/outbox so retries are safe.
    console.error("[brevo] Could not send email:", error);
  }
}

function bookingConfirmationTemplate(data: BookingEmailData): string {
  const mapLine = data.mapUrl
    ? `<p style="margin:0 0 12px"><a href="${escapeHtml(
        data.mapUrl,
      )}" style="color:#173B4D;text-decoration:underline">Open the hotel in Google Maps</a></p>`
    : "";

  const cancellationLine = data.freeCancellationUntil
    ? `<p style="margin:0 0 8px;color:#3F6B58">Free cancellation until ${escapeHtml(
        data.freeCancellationUntil,
      )}.</p>`
    : "";

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#F7F4ED;font-family:Inter,Arial,sans-serif;color:#283238">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4ED;padding:32px 16px">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid #E9DFCF;border-radius:16px;overflow:hidden">
            <tr>
              <td style="background:#173B4D;padding:28px 32px">
                <p style="margin:0;font-family:Georgia,serif;font-size:26px;color:#F7F4ED">
                  <strong>Jos</strong><em>Stay</em>
                </p>
                <p style="margin:6px 0 0;font-size:13px;color:#DCE7E0">Your city, your stay.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px">
                <p style="margin:0 0 8px;font-size:14px;color:#7F9C8D;font-weight:600;letter-spacing:.08em;text-transform:uppercase">Booking confirmed</p>
                <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:26px;line-height:1.2;color:#173B4D">
                  You&rsquo;re going to ${escapeHtml(data.hotelName)}.
                </h1>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.6">
                  Hello ${escapeHtml(data.guestName)}, your stay is confirmed. Keep this email handy — it has everything you need.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4ED;border-radius:12px;padding:20px;margin-bottom:20px">
                  <tr><td style="padding:4px 0;font-size:14px;color:#5c6669">Reference</td><td align="right" style="padding:4px 0;font-size:14px;font-weight:600;color:#173B4D">${escapeHtml(
                    data.reference,
                  )}</td></tr>
                  <tr><td style="padding:4px 0;font-size:14px;color:#5c6669">Room</td><td align="right" style="padding:4px 0;font-size:14px">${escapeHtml(
                    data.roomName,
                  )}</td></tr>
                  <tr><td style="padding:4px 0;font-size:14px;color:#5c6669">Check-in</td><td align="right" style="padding:4px 0;font-size:14px">${escapeHtml(
                    data.checkIn,
                  )}</td></tr>
                  <tr><td style="padding:4px 0;font-size:14px;color:#5c6669">Check-out</td><td align="right" style="padding:4px 0;font-size:14px">${escapeHtml(
                    data.checkOut,
                  )}</td></tr>
                  <tr><td style="padding:4px 0;font-size:14px;color:#5c6669">Nights</td><td align="right" style="padding:4px 0;font-size:14px">${data.nights}</td></tr>
                  <tr><td style="padding:12px 0 4px;font-size:14px;color:#5c6669">Total paid</td><td align="right" style="padding:12px 0 4px;font-size:18px;font-weight:700;color:#173B4D">${naira(
                    data.total,
                  )}</td></tr>
                </table>

                <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#173B4D">${escapeHtml(
                  data.hotelName,
                )}</p>
                <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#5c6669">${escapeHtml(
                  data.hotelAddress,
                )}</p>
                ${data.hotelPhone ? `<p style="margin:0 0 12px;font-size:14px">Hotel phone: <a href="tel:${escapeHtml(data.hotelPhone)}" style="color:#173B4D">${escapeHtml(data.hotelPhone)}</a></p>` : ""}
                ${mapLine}
                ${cancellationLine}
                ${
                  data.bookingUrl
                    ? `<p style="margin:20px 0 0"><a href="${escapeHtml(
                        data.bookingUrl,
                      )}" style="display:inline-block;background:#173B4D;color:#F7F4ED;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">View your booking</a></p>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid #E9DFCF;font-size:12px;line-height:1.6;color:#6b7478">
                If the hotel cannot honour this booking, JosStay will make it right.
                Reply to this email or message us on WhatsApp for help.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendBookingConfirmation(
  to: { email: string; name: string },
  data: BookingEmailData,
): Promise<void> {
  await sendEmail({
    to,
    subject: `Your JosStay booking is confirmed — ${data.reference}`,
    htmlContent: bookingConfirmationTemplate(data),
  });
}

export async function sendCancellationEmail(
  to: { email: string; name: string },
  data: {
    reference: string;
    name: string;
    hotelName: string;
    refundNote: string;
  },
): Promise<void> {
  await sendEmail({
    to,
    subject: `Your JosStay booking was cancelled — ${data.reference}`,
    htmlContent: `<div style="font-family:Inter,Arial,sans-serif;color:#283238;padding:24px;background:#F7F4ED">
      <h1 style="font-family:Georgia,serif;color:#173B4D;font-size:24px">Booking cancelled</h1>
      <p>Hello ${escapeHtml(data.name)}, your booking at ${escapeHtml(
        data.hotelName,
      )} (${escapeHtml(data.reference)}) has been cancelled.</p>
      <p>${escapeHtml(data.refundNote)}</p>
      <p style="color:#6b7478;font-size:13px">JosStay — Your city, your stay.</p>
    </div>`,
  });
}
