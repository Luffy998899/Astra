import sqlite3 from "sqlite3"
import { resolve } from "path"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname } from "path"

const { Database } = sqlite3

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = resolve(__dirname, "../data/astranodes.sqlite")
const schemaPath = resolve(__dirname, "../src/db/tickets.sql")

console.log("[MIGRATE] Running ticket schema migration...")
console.log("[MIGRATE] Database:", dbPath)
console.log("[MIGRATE] Schema:", schemaPath)

const db = new Database(dbPath, (err) => {
  if (err) {
    console.error("[MIGRATE] ✗ Failed to connect to database:", err.message)
    process.exit(1)
  }
})

const schema = readFileSync(schemaPath, "utf8")

db.exec(schema, (err) => {
  if (err) {
    console.error("[MIGRATE] ✗ Migration failed:", err.message)
    process.exit(1)
  }
  console.log("[MIGRATE] ✓ Ticket tables created successfully")
  db.close()
  process.exit(0)
})
