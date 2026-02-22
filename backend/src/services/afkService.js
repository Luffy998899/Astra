import { getOne, runSync, query } from "../config/db.js"

export async function claimAfkCoins({ userId, adblockDetected }) {
  if (adblockDetected) {
    const err = new Error("Disable AdBlock to earn coins")
    err.statusCode = 400
    throw err
  }

  const now = new Date()
  const settings = await getOne("SELECT coins_per_minute FROM coin_settings WHERE id = 1")
  const user = await getOne("SELECT last_claim_time FROM users WHERE id = ?", [userId])

  if (user?.last_claim_time) {
    const last = new Date(user.last_claim_time)
    const diffSeconds = Math.floor((now.getTime() - last.getTime()) / 1000)
    if (diffSeconds < 60) {
      const err = new Error("Claim cooldown")
      err.statusCode = 429
      err.waitSeconds = 60 - diffSeconds
      throw err
    }
  }

  await runSync(
    "UPDATE users SET coins = coins + ?, last_claim_time = ? WHERE id = ?",
    [settings.coins_per_minute, now.toISOString(), userId]
  )

  return settings.coins_per_minute
}
