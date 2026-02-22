import { getOne, runSync, query } from "../config/db.js"

export async function redeemCoupon({ code, userId, ipAddress }) {
  const now = new Date().toISOString()

  const coupon = await getOne("SELECT * FROM coupons WHERE code = ?", [code])
  if (!coupon || !coupon.active) {
    const err = new Error("Coupon is invalid")
    err.statusCode = 400
    throw err
  }

  if (new Date(coupon.expires_at) <= new Date(now)) {
    const err = new Error("Coupon is expired")
    err.statusCode = 400
    throw err
  }

  const totalUsesRow = await getOne(
    "SELECT COUNT(*) as count FROM coupon_redemptions WHERE coupon_id = ?",
    [coupon.id]
  )
  const totalUses = totalUsesRow?.count || 0

  if (totalUses >= coupon.max_uses) {
    const err = new Error("Coupon max uses reached")
    err.statusCode = 400
    throw err
  }

  const userUsesRow = await getOne(
    "SELECT COUNT(*) as count FROM coupon_redemptions WHERE coupon_id = ? AND user_id = ?",
    [coupon.id, userId]
  )
  const userUses = userUsesRow?.count || 0

  if (userUses >= coupon.per_user_limit) {
    const err = new Error("Coupon limit reached for this user")
    err.statusCode = 400
    throw err
  }

  const ipUsers = await query(
    "SELECT DISTINCT user_id FROM coupon_redemptions WHERE coupon_id = ? AND ip_address = ?",
    [coupon.id, ipAddress]
  )

  if (ipUsers.length > 0 && !ipUsers.find((row) => row.user_id === userId)) {
    const userIds = [userId, ...ipUsers.map((row) => row.user_id)]
    const placeholders = userIds.map(() => "?").join(",")
    await runSync(
      `UPDATE users SET flagged = 1 WHERE id IN (${placeholders})`,
      userIds
    )
    const err = new Error("Coupon already redeemed from this IP")
    err.statusCode = 400
    throw err
  }

  const otherIpUsers = await query(
    "SELECT DISTINCT user_id FROM coupon_redemptions WHERE ip_address = ?",
    [ipAddress]
  )

  if (otherIpUsers.length > 0 && !otherIpUsers.find((row) => row.user_id === userId)) {
    const userIds = [userId, ...otherIpUsers.map((row) => row.user_id)]
    const placeholders = userIds.map(() => "?").join(",")
    await runSync(
      `UPDATE users SET flagged = 1 WHERE id IN (${placeholders})`,
      userIds
    )
  }

  await runSync(
    "INSERT INTO coupon_redemptions (coupon_id, user_id, ip_address, redeemed_at) VALUES (?, ?, ?, ?)",
    [coupon.id, userId, ipAddress, now]
  )

  await runSync(
    "UPDATE users SET coins = coins + ? WHERE id = ?",
    [coupon.coin_reward, userId]
  )

  return coupon.coin_reward
}
