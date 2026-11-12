import { randomBytes } from "node:crypto";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models";
import { ApiError, asyncHandler } from "../utils/api-error";
import { signAccessToken } from "../utils/jwt";
import type { LoginInput, RegisterInput } from "../validators/auth.validator";

const BCRYPT_ROUNDS = 12;

function serializeUser(user: User) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? undefined,
    role: user.role,
    referralCode: user.referralCode,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

/**
 * Short, human-friendly referral code. The unique index is the source of
 * truth; collisions are extremely unlikely with 3 random bytes.
 */
function buildReferralCode(): string {
  return `JOS-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as RegisterInput;

  const existing = await User.findOne({ where: { email: input.email } });
  if (existing) {
    throw ApiError.conflict(
      "An account with that email already exists. Try signing in instead.",
    );
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await User.create({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone ?? null,
    passwordHash,
    referralCode: buildReferralCode(),
  });

  const token = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  res.status(201).json({
    success: true,
    data: { token, user: serializeUser(user) },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as LoginInput;

  const user = await User.findOne({ where: { email: input.email } });

  // Use the same message for unknown email and wrong password so the endpoint
  // does not reveal which accounts exist.
  if (!user?.passwordHash) {
    throw ApiError.unauthorized("Email or password is incorrect.");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw ApiError.unauthorized("Email or password is incorrect.");
  }

  const token = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  res.json({
    success: true,
    data: { token, user: serializeUser(user) },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByPk(req.user!.id);

  if (!user) {
    throw ApiError.notFound("Your account could not be found.");
  }

  res.json({ success: true, data: serializeUser(user) });
});

/**
 * Google Sign-In: verify the Google ID token, then find-or-create the user.
 * DeepSeek: implement with `google-auth-library` once the client ID is set.
 */
export const google = asyncHandler(async () => {
  throw ApiError.notImplemented(
    "Google sign-in is not wired up yet. Add google-auth-library, verify the ID token with GOOGLE_CLIENT_ID, then find or create the user by googleId/email.",
  );
});
