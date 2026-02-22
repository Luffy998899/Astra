import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"
import { env } from "./config/env.js"
import { rateLimiter } from "./middlewares/rateLimit.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import routes from "./routes/index.js"

const app = express()

app.set("trust proxy", true)

// CORS Configuration - Allow all origins in development
const corsOptions = {
  origin: function (origin, callback) {
    console.log(`[CORS] Origin received: ${origin}, NODE_ENV: ${env.NODE_ENV}`)
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || env.NODE_ENV === "development") {
      console.log(`[CORS] ✓ Allowing origin: ${origin}`)
      callback(null, true)
    } else {
      // In production, check against FRONTEND_URL
      const allowedOrigins = [env.FRONTEND_URL]
      if (allowedOrigins.includes(origin)) {
        console.log(`[CORS] ✓ Allowing origin: ${origin}`)
        callback(null, true)
      } else {
        console.log(`[CORS] ✗ Blocking origin: ${origin}`)
        callback(new Error("CORS not allowed"))
      }
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "X-JSON-Response"],
  optionsSuccessStatus: 200,
  maxAge: 86400,
  preflightContinue: false
}

app.use(cors(corsOptions))

// Helmet configuration - disable CSP in development to avoid CORS interference
app.use(helmet({
  contentSecurityPolicy: env.NODE_ENV === "development" ? false : true,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))
app.use(express.json({ limit: "2mb" }))
app.use(morgan("dev"))
app.use(rateLimiter)

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "astranodes-api" })
})

app.use("/api", routes)

app.use(errorHandler)

export default app
