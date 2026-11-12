import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { sequelize } from "./config/database";
import { env } from "./config/env";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware";
import { apiLimiter } from "./middleware/rate-limit.middleware";
import { apiRouter } from "./routes";
import { asyncHandler } from "./utils/api-error";

export const app = express();

app.disable("x-powered-by");

// Render (and most hosts) put one proxy in front of the app. `1` keeps the
// client IP trustworthy for rate limiting.
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin: env.CORS_ORIGINS,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
}

/**
 * Keep the raw body for Paystack webhook HMAC verification. The parsed JSON is
 * still available as `req.body`.
 */
app.use(
  express.json({
    limit: "1mb",
    verify: (req, _res, buffer) => {
      (req as Request).rawBody = Buffer.from(buffer);
    },
  }),
);
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/", (_req: Request, res: Response) => {
  res.json({
    name: "JosStay API",
    tagline: "Your city, your stay.",
    version: "v1",
    baseUrl: "/api/v1",
    health: "/health",
  });
});

app.get(
  "/health",
  asyncHandler(async (_req: Request, res: Response) => {
    try {
      await sequelize.authenticate();
      res.json({
        status: "ok",
        database: "connected",
        uptime: Math.round(process.uptime()),
      });
    } catch {
      res.status(503).json({ status: "error", database: "unavailable" });
    }
  }),
);

app.use("/api/v1", apiLimiter, apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
