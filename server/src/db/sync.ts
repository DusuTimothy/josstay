import { sequelize } from "../config/database";
import { env } from "../config/env";
// Importing the registry registers every model and association before sync.
import "../models";

async function sync(): Promise<void> {
  if (env.NODE_ENV === "production") {
    console.error(
      "Refusing to sync in production. Use versioned migrations instead.",
    );
    process.exit(1);
  }

  console.log("Connecting to the database...");
  await sequelize.authenticate();

  console.log("Creating/updating tables (development only)...");
  await sequelize.sync({ alter: true });

  console.log("✅ Database schema is up to date.");
  await sequelize.close();
}

sync().catch(async (error) => {
  console.error("❌ Schema sync failed:", error);
  await sequelize.close().catch(() => undefined);
  process.exit(1);
});
