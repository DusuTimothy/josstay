import { OAuth2Client, type TokenPayload } from "google-auth-library";
import { UniqueConstraintError } from "sequelize";
import { env } from "../config/env";
import { User } from "../models";
import { ApiError } from "../utils/api-error";
import { buildReferralCode } from "../utils/referral";

export interface GoogleProfile {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Verify the ID token that Google Identity Services returns.
 *
 * The audience must be our own client ID, so a token minted for another app
 * is rejected even if Google signed it.
 */
export async function verifyGoogleIdToken(
  idToken: string,
): Promise<GoogleProfile> {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new ApiError(
      503,
      "Google sign-in is not configured. Add GOOGLE_CLIENT_ID to server/.env.",
    );
  }

  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  let payload: TokenPayload | undefined;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    throw ApiError.unauthorized(
      "We could not verify that Google sign-in. Please try again.",
    );
  }

  const googleId = payload?.sub;
  const email = payload?.email?.toLowerCase();

  if (!googleId || !email) {
    throw ApiError.unauthorized(
      "Google did not share an email address for this account.",
    );
  }

  if (!payload?.email_verified) {
    throw ApiError.unauthorized(
      "That Google account has no verified email. Please use email and password instead.",
    );
  }

  const fullName = payload.name?.trim() ?? "";
  const givenName = payload.given_name?.trim() || fullName.split(" ")[0] || "";
  const familyName =
    payload.family_name?.trim() || fullName.split(" ").slice(1).join(" ");

  return {
    googleId,
    email,
    firstName: (givenName || "Guest").slice(0, 80),
    lastName: (familyName || "Guest").slice(0, 80),
  };
}

/**
 * Link Google to an existing password account with the same email, or create
 * a new guest account.
 *
 * A referral code can collide (three random bytes) and two people can press
 * "Continue with Google" at the same moment, so both unique indexes are
 * retried instead of failing the sign-in.
 */
export async function findOrCreateGoogleUser(
  profile: GoogleProfile,
): Promise<User> {
  const linked = await User.findOne({ where: { googleId: profile.googleId } });

  if (linked) return linked;

  const existing = await User.findOne({ where: { email: profile.email } });

  if (existing) {
    if (!existing.googleId) {
      await existing.update({
        googleId: profile.googleId,
        emailVerified: true,
      });
    }
    return existing;
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await User.create({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        googleId: profile.googleId,
        passwordHash: null,
        referralCode: buildReferralCode(),
        emailVerified: true,
      });
    } catch (error) {
      if (!(error instanceof UniqueConstraintError)) throw error;

      const raced = await User.findOne({
        where: { googleId: profile.googleId },
      });

      if (raced) return raced;

      // The referral code collided: try a new one.
    }
  }

  throw new ApiError(
    500,
    "We could not finish creating your account. Please try again.",
  );
}
