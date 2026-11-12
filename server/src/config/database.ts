import fs from "node:fs";
import path from "node:path";
import { Sequelize } from "sequelize";
import { env } from "./env";

/**
 * Resolve the Aiven CA certificate.
 *
 * Aiven requires TLS. We verify the server certificate with Aiven's CA instead
 * of using `sslmode=require` alone (which does not verify the certificate).
 *
 * Relative paths resolve from the API package root (server), whether the app
 * runs from src via tsx or from dist after a build.
 */
function loadAivenCa(): string | undefined {
  if (!env.DB_SSL) return undefined;

  const packageRoot = path.resolve(__dirname, "../..");
  const certPath = path.isAbsolute(env.AIVEN_CA_CERT_PATH)
    ? env.AIVEN_CA_CERT_PATH
    : path.resolve(packageRoot, env.AIVEN_CA_CERT_PATH);

  if (!fs.existsSync(certPath)) {
    throw new Error(
      [
        "Aiven CA certificate not found.",
        `Looked for: ${certPath}`,
        "Download the CA from the Aiven console and save it at server/certs/aiven-ca.pem,",
        "or set AIVEN_CA_CERT_PATH to an absolute path. See AIVEN-SETUP.md.",
        "For a local PostgreSQL without TLS, set DB_SSL=false.",
      ].join("\n"),
    );
  }

  return fs
    .readFileSync(certPath, "utf8")
    .replace(/\r\n/g, "\n")
    .trim();
}

const ca = loadAivenCa();

export const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: "postgres",
  logging: env.DB_LOGGING ? (message) => console.log(`[sql] ${message}`) : false,
  dialectOptions: ca
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: true,
          ca,
        },
      }
    : {},
  pool: {
    // Aiven plans cap concurrent connections — keep this small.
    max: 5,
    min: 0,
    acquire: 30_000,
    idle: 10_000,
  },
  define: {
    underscored: true,
    timestamps: true,
  },
});

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
  console.log(
    `✅ Database connected (PostgreSQL, TLS verify ${env.DB_SSL ? "on" : "off"})`,
  );
}

export async function disconnectDatabase(): Promise<void> {
  await sequelize.close();
}
