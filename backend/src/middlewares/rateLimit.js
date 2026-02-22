import rateLimit from "express-rate-limit"
import { env } from "../config/env.js"

export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for preflight OPTIONS requests and health checks
  skip: (req) => req.method === "OPTIONS" || req.path === "/health"
})
