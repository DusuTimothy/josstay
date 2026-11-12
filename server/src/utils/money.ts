import { randomBytes } from "node:crypto";

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function toKobo(amount: number): number {
  return Math.round(amount * 100);
}

export function fromKobo(kobo: number): number {
  return kobo / 100;
}

/** Split a total into JosStay's commission and the hotel's share. */
export function splitPayment(total: number, commissionRate: number) {
  const commissionAmount = roundMoney(total * commissionRate);
  return {
    commissionAmount,
    hotelShare: roundMoney(total - commissionAmount),
  };
}

export function generateReference(prefix = "JS"): string {
  return `${prefix}-${Date.now()}-${randomBytes(4).toString("hex").toUpperCase()}`;
}
