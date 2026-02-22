export default function Logo({ size = "md" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  }

  return (
    <div className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink-800 text-neon-400 shadow-glow">
        A
      </span>
      <div className={`font-semibold tracking-wide ${sizes[size] || sizes.md}`}>
        Astra<span className="text-neon-400">Nodes</span>
      </div>
    </div>
  )
}
