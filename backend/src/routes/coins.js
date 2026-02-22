import { Router } from "express"
import { z } from "zod"
import { validate } from "../middlewares/validate.js"
import { requireAuth } from "../middlewares/auth.js"
import { getOne } from "../config/db.js"
import { claimAfkCoins } from "../services/afkService.js"

const router = Router()

const claimSchema = z.object({
  body: z.object({
    adblockDetected: z.boolean().default(false)
  })
})

router.get("/balance", requireAuth, async (req, res, next) => {
  try {
    const user = await getOne(
      "SELECT coins, balance, last_claim_time FROM users WHERE id = ?",
      [req.user.id]
    )
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.post("/claim", requireAuth, validate(claimSchema), async (req, res, next) => {
  try {
    const earned = await claimAfkCoins({
      userId: req.user.id,
      adblockDetected: req.body.adblockDetected
    })
    res.json({ earned })
  } catch (error) {
    if (error.waitSeconds) {
      return res.status(429).json({ error: "Cooldown", waitSeconds: error.waitSeconds })
    }
    next(error)
  }
})

export default router
