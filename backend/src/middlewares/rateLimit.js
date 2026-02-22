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

// Strict rate limiter for auth endpoints (login, register)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Please try again in 15 minutes." }
})
