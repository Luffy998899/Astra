import Database from "better-sqlite3"
import { env } from "./env.js"
import fs from "fs"
import path from "path"

console.log("[DB] Initializing database at:", env.DB_PATH)

const dbDir = path.dirname(env.DB_PATH)
if (!fs.existsSync(dbDir)) {
  console.log("[DB] Creating database directory:", dbDir)
  fs.mkdirSync(dbDir, { recursive: true })
}

let db
try {
  db = new Database(env.DB_PATH)
  console.log("[DB] ✓ Database connection successful")
} catch (err) {
  console.error("[DB] ✗ Database connection error:", err)
  process.exit(1)
}

// better-sqlite3 is synchronous and handles busy internally
db.pragma("busy_timeout = 5000")
db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")
db.pragma("secure_delete = ON")
console.log("[DB] ✓ WAL mode, foreign keys, secure_delete enabled")

// Keep the same async API surface so no other files need changes.
// better-sqlite3 is synchronous under the hood — wrapping in Promise
// keeps all callers using `await` working without modification.

export function query(sql, params = []) {
  try {
    const rows = db.prepare(sql).all(params)
    return Promise.resolve(rows || [])
  } catch (err) {
    return Promise.reject(err)
  }
}

export function getOne(sql, params = []) {
  try {
    const row = db.prepare(sql).get(params)
    return Promise.resolve(row || null)
  } catch (err) {
    return Promise.reject(err)
  }
}

export function runSync(sql, params = []) {
  try {
    const info = db.prepare(sql).run(params)
    return Promise.resolve({ lastID: info.lastInsertRowid, changes: info.changes })
  } catch (err) {
    return Promise.reject(err)
  }
}

export { db }
