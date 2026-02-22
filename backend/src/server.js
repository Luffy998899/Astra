import http from "http"
import app from "./app.js"
import { env } from "./config/env.js"
import migrate from "./db/migrate.js"
import { startExpiryCron } from "./cron/expiryCron.js"
import { initSocket } from "./utils/socket.js"

async function startup() {
  try {
    console.log("[Server] Starting database migration...")
    await migrate()
    console.log("[Server] Migration complete, starting server...")

    const httpServer = http.createServer(app)

    const allowedOrigins = env.NODE_ENV === "production"
      ? [env.FRONTEND_URL]
      : true  // allow all origins in development

    initSocket(httpServer, allowedOrigins)

    httpServer.listen(env.PORT, "0.0.0.0", () => {
      console.log(`[Server] ✓ AstraNodes API listening on 0.0.0.0:${env.PORT}`)
      console.log(`[Server] ✓ Health endpoint: http://localhost:${env.PORT}/health`)
    })

    console.log("[Server] Starting cron jobs...")
    startExpiryCron()
    console.log("[Server] ✓ Cron jobs started")
  } catch (error) {
    console.error("[Server] ✗ Failed to start server:", error)
    process.exit(1)
  }
}

startup()
