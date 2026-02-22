import app from "./app.js"
import { env } from "./config/env.js"
import migrate from "./db/migrate.js"
import { startExpiryCron } from "./cron/expiryCron.js"

async function startup() {
  try {
    console.log("[Server] Starting database migration...")
    await migrate()
    console.log("[Server] Migration complete, starting server...")

    const server = app.listen(env.PORT, () => {
      console.log(`[Server] ✓ AstraNodes API listening on port ${env.PORT}`)
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
