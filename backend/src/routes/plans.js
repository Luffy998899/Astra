import { Router } from "express"
import { query } from "../config/db.js"

const router = Router()

router.get("/coin", async (req, res, next) => {
  try {
    const plans = await query("SELECT * FROM plans_coin")
    res.json(plans)
  } catch (error) {
    next(error)
  }
})

router.get("/real", async (req, res, next) => {
  try {
    const plans = await query("SELECT * FROM plans_real")
    res.json(plans)
  } catch (error) {
    next(error)
  }
})

export default router
