import { Router } from "express"
import authRoutes from "./auth.js"
import planRoutes from "./plans.js"
import serverRoutes from "./servers.js"
import coinRoutes from "./coins.js"
import couponRoutes from "./coupons.js"
import billingRoutes from "./billing.js"
import adminRoutes from "./admin.js"
import adsRoutes from "./ads.js"

const router = Router()

router.use("/auth", authRoutes)
router.use("/plans", planRoutes)
router.use("/servers", serverRoutes)
router.use("/coins", coinRoutes)
router.use("/coupons", couponRoutes)
router.use("/billing", billingRoutes)
router.use("/admin", adminRoutes)
router.use("/ads", adsRoutes)

export default router
