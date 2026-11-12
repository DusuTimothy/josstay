import type { NextFunction, Request, Response } from "express";
import {
  UniqueConstraintError,
  ValidationError as SequelizeValidationError,
} from "sequelize";
import { ZodError } from "zod";
import { env } from "../config/env";
import { ApiError } from "../utils/api-error";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    res.status(422).json({
      success: false,
      message: "Validation failed",
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.details !== undefined ? { details: error.details } : {}),
    });
    return;
  }

  if (error instanceof UniqueConstraintError) {
    res.status(409).json({
      success: false,
      message: "A record with those details already exists",
      fields: error.fields,
    });
    return;
  }

  if (error instanceof SequelizeValidationError) {
    res.status(422).json({
      success: false,
      message: "The data could not be saved",
      issues: error.errors.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    });
    return;
  }

  console.error("[api] Unhandled error:", error);

  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "production"
        ? "Something went wrong. Please try again."
        : error instanceof Error
          ? error.message
          : "Unknown error",
  });
}
