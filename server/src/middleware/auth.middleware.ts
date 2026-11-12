import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { UserRole } from "../types/domain";
import { ApiError } from "../utils/api-error";

interface AccessTokenPayload extends jwt.JwtPayload {
  role?: UserRole;
  email?: string;
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(ApiError.unauthorized());
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      issuer: "josstay",
      audience: "josstay-client",
    }) as AccessTokenPayload;

    if (!payload.sub || !payload.email || !payload.role) {
      return next(ApiError.unauthorized("Invalid session. Please sign in again."));
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    return next();
  } catch {
    return next(
      ApiError.unauthorized("Your session has expired. Please sign in again."),
    );
  }
};

export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden());
    }

    return next();
  };
}
