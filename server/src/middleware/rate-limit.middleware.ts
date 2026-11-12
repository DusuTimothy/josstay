import rateLimit from "express-rate-limit";

const message = {
  success: false,
  message: "Too many requests. Please wait a moment and try again.",
};

/** Broad limit for the public API. */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message,
});

/** Tighter limit for register/login so passwords are harder to brute-force. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many sign-in attempts. Please wait and try again.",
  },
});
