import type { NextFunction, Request, RequestHandler, Response } from "express";

/** An error with an HTTP status and a message that is safe to show to clients. */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static badRequest(message = "Invalid request", details?: unknown) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = "Please sign in to continue") {
    return new ApiError(401, message);
  }

  static forbidden(message = "You do not have access to this resource") {
    return new ApiError(403, message);
  }

  static notFound(message = "Not found") {
    return new ApiError(404, message);
  }

  static conflict(message = "That action conflicts with an existing record") {
    return new ApiError(409, message);
  }

  static notImplemented(message = "Not implemented yet") {
    return new ApiError(501, message);
  }
}

/** Wrap async route handlers so rejected promises reach the error middleware. */
export function asyncHandler(
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
