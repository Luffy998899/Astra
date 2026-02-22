import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { getOne, runSync } from "../config/db.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const sqlPath = path.join(__dirname, "init.sql")

export default async function migrate() {
  try {
    console.log("[Migration] Reading init.sql from:", sqlPath)
    const sql = fs.readFileSync(sqlPath, "utf-8")
    console.log("[Migration] Executing SQL statements...")

    // Execute all SQL statements
    const statements = sql.split(";")
    let executedCount = 0
    
    for (const stmt of statements) {
      if (stmt.trim()) {
        try {
          await runSync(stmt)
          executedCount++
        } catch (error) {
          console.warn("[Migration] Statement error (may be expected):", error.message)
        }
      }
    }
    
    console.log(`[Migration] Executed ${executedCount} SQL statements`)

    // Ensure coin_settings exists
    console.log("[Migration] Checking coin_settings...")
    const existing = await getOne("SELECT id FROM coin_settings WHERE id = 1 LIMIT 1").catch(
      () => null
    )

    if (!existing) {
      console.log("[Migration] Creating default coin_settings...")
      await runSync("INSERT INTO coin_settings (id, coins_per_minute) VALUES (1, 1)", [])
    } else {
      console.log("[Migration] coin_settings already exists")
    }

    console.log("[Migration] ✓ Database migrated successfully")
  } catch (error) {
    console.error("[Migration] ✗ Critical error:", error)
    throw error
  }
}
