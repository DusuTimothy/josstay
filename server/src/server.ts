import { app } from "./app";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { env } from "./config/env";

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    console.log(
      `✅ JosStay server listening on http://localhost:${env.PORT} (${env.NODE_ENV})`,
    );
    console.log(`   API base: ${env.APP_URL}/api/v1`);
    console.log(`   Client:   ${env.WEB_URL}`);
  });

  let shuttingDown = false;

  async function shutdown(signal: string): Promise<void> {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log(`\n[server] ${signal} received — shutting down...`);

    server.close(async () => {
      try {
        await disconnectDatabase();
        process.exit(0);
      } catch (error) {
        console.error("[server] Error while closing the database:", error);
        process.exit(1);
      }
    });

    // Do not hang forever on open connections.
    setTimeout(() => {
      console.error("[server] Forced shutdown after 10s.");
      process.exit(1);
    }, 10_000).unref();
  }

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  process.on("unhandledRejection", (reason) => {
    console.error("[server] Unhandled promise rejection:", reason);
  });
}

bootstrap().catch((error) => {
  console.error("[server] Failed to start:", error);
  process.exit(1);
});
