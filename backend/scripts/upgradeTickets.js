import sqlite3 from "sqlite3"
import { resolve } from "path"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname } from "path"

const { Database } = sqlite3

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = resolve(__dirname, "../data/astranodes.sqlite")
const schemaPath = resolve(__dirname, "../src/db/tickets-upgrade.sql")

console.log("[UPGRADE] Running ticket system upgrade migration...")
console.log("[UPGRADE] Database:", dbPath)
console.log("[UPGRADE] Schema:", schemaPath)

const db = new Database(dbPath, (err) => {
  if (err) {
    console.error("[UPGRADE] ✗ Failed to connect to database:", err.message)
    process.exit(1)
  }
})

const schema = readFileSync(schemaPath, "utf8")

db.exec(schema, (err) => {
  if (err) {
    console.error("[UPGRADE] ✗ Migration failed:", err.message)
    console.error("[UPGRADE] This is normal if columns already exist")
    process.exit(1)
  }

  console.log("[UPGRADE] ✓ Ticket system upgraded successfully!")
  console.log("[UPGRADE] New features:")
  console.log("  - Priority levels (Low/Medium/High)")
  console.log("  - Image uploads in messages")
  console.log("  - Username and email cached in tickets")
  
  db.close((err) => {
    if (err) {
      console.error("[UPGRADE] ✗ Error closing database:", err.message)
    }
    process.exit(0)
  })
})
