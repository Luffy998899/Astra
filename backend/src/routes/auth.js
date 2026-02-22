import { Router } from "express"
import { z } from "zod"
import { validate } from "../middlewares/validate.js"
import { query, getOne, runSync } from "../config/db.js"
import { hashPassword, verifyPassword } from "../utils/password.js"
import { signToken } from "../utils/jwt.js"
import { pterodactyl } from "../services/pterodactyl.js"

const router = Router()

const authSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
})

router.post("/register", validate(authSchema), async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase()
    const password = req.body.password

    const exists = await getOne("SELECT id FROM users WHERE email = ?", [email])
    if (exists) {
      return res.status(409).json({ error: "Email already registered" })
    }

    const username = email.split("@")[0]
    const pteroId = await pterodactyl.createUser({
      email,
      username,
      firstName: username,
      lastName: "User",
      password
    })

    const hash = await hashPassword(password)
    const ip = req.ip

    const info = await runSync(
      "INSERT INTO users (email, password_hash, ip_address, last_login_ip, pterodactyl_user_id) VALUES (?, ?, ?, ?, ?)",
      [email, hash, ip, ip, pteroId]
    )

    const user = await getOne("SELECT * FROM users WHERE id = ?", [info.lastID])
    const token = signToken(user)

    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } })
  } catch (error) {
    next(error)
  }
})

router.post("/login", validate(authSchema), async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase()
    const password = req.body.password

    const user = await getOne("SELECT * FROM users WHERE email = ?", [email])
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const ok = await verifyPassword(password, user.password_hash)
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    await runSync("UPDATE users SET last_login_ip = ? WHERE id = ?", [req.ip, user.id])

    const token = signToken(user)
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } })
  } catch (error) {
    next(error)
  }
})

export default router
