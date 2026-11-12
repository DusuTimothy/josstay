import type { AuthUser } from "./domain";

declare global {
  namespace Express {
    interface Request {
      /** Set by `requireAuth`. */
      user?: AuthUser;
      /** Raw request body, captured for Paystack webhook signature checks. */
      rawBody?: Buffer;
    }
  }
}

export {};
