import { randomBytes } from "node:crypto";

/**
 * Short, human-friendly referral code. The unique index is the source of
 * truth; collisions are extremely unlikely with 3 random bytes.
 */
export function buildReferralCode(): string {
  return `JOS-${randomBytes(3).toString("hex").toUpperCase()}`;
}
