import "dotenv/config";
import { z } from "zod";

const booleanFromEnv = (defaultValue: boolean) =>
  z.preprocess((value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      return ["1", "true", "yes", "on"].includes(value.toLowerCase());
    }
    return value;
  }, z.boolean()).default(defaultValue);

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  APP_URL: z.string().url().default("http://localhost:4000"),
  WEB_URL: z.string().url().default("http://localhost:3000"),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),

  // Aiven PostgreSQL
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required — copy the Service URI from Aiven."),
  AIVEN_CA_CERT_PATH: z.string().default("./certs/aiven-ca.pem"),
  DB_SSL: booleanFromEnv(true),
  DB_LOGGING: booleanFromEnv(false),

  // Auth
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters.")
    .default("josstay-development-secret-change-me-please"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Platform rules
  DEFAULT_COMMISSION_RATE: z.coerce.number().min(0).max(1).default(0.12),
  // Tax treatment is still open — keep 0 until an accountant confirms it.
  DEFAULT_TAX_RATE: z.coerce.number().min(0).max(0.5).default(0),
  BOOKING_HOLD_MINUTES: z.coerce.number().int().positive().default(15),

  // Integrations
  PAYSTACK_SECRET_KEY: z.string().optional(),
  PAYSTACK_PUBLIC_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),
  BREVO_SENDER_EMAIL: z.string().email().default("bookings@josstay.ng"),
  BREVO_SENDER_NAME: z.string().default("JosStay"),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  GOOGLE_MAPS_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  console.error(`Invalid environment variables:\n${details}`);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  CORS_ORIGINS: parsed.data.CORS_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export type Env = typeof env;
