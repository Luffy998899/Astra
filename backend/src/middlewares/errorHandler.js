export function errorHandler(err, req, res, next) {
  if (err.name === "ZodError") {
    console.error("[ERROR] Validation error:", {
      path: req.path,
      errors: err.errors
    })
    return res.status(400).json({ error: "Validation failed", details: err.errors })
  }

  if (err.statusCode) {
    console.error("[ERROR]", err.statusCode, err.message)
    return res.status(err.statusCode).json({ error: err.message })
  }

  console.error("[ERROR] Unhandled error:", err)
  res.status(500).json({ error: "Internal server error" })
}
