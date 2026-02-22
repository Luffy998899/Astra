/**
 * Public settings endpoint — returns non-secret config needed by the frontend.
 * GET /api/settings/payment  → UPI ID, UPI name
 */
import { Router } from "express"
import { env } from "../config/env.js"

const router = Router()

router.get("/payment", (req, res) => {
  res.json({
    upiId:   env.UPI_ID   || null,
    upiName: env.UPI_NAME || null
  })
})

export default router
