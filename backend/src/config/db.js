import sqlite3 from "sqlite3"
import { env } from "./env.js"
import fs from "fs"
import path from "path"

console.log("[DB] Initializing database at:", env.DB_PATH)

const dbDir = path.dirname(env.DB_PATH)
if (!fs.existsSync(dbDir)) {
  console.log("[DB] Creating database directory:", dbDir)
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new (sqlite3.verbose()).Database(env.DB_PATH, (err) => {
  if (err) {
    console.error("[DB] ✗ Database connection error:", err)
    process.exit(1)
  } else {
    console.log("[DB] ✓ Database connection successful")
  }
})

db.configure("busyTimeout", 5000)
db.run("PRAGMA journal_mode=WAL", (err) => {
  if (err) console.error("[DB] WAL error:", err)
  else console.log("[DB] ✓ WAL mode enabled")
})
db.run("PRAGMA foreign_keys=ON", (err) => {
  if (err) console.error("[DB] Foreign keys error:", err)
  else console.log("[DB] ✓ Foreign keys enabled")
})

// Promise-based wrapper for db.all()
export function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows || [])
    })
  })
}

// Promise-based wrapper for db.get()
export function getOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row || null)
    })
  })
}

// Promise-based wrapper for db.run()
export function runSync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err)
      else resolve({ lastID: this.lastID, changes: this.changes })
    })
  })
}

export { db }
