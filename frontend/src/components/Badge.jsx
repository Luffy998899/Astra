const colors = {
  active:   "bg-aurora-500/15 text-aurora-300 border-aurora-400/40",
  suspended:"bg-ember-500/15 text-ember-300 border-ember-400/40",
  deleted:  "bg-ink-700 text-slate-300 border-slate-500/30",
  admin:    "bg-neon-500/15 text-neon-300 border-neon-400/40",
  approved: "bg-aurora-500/15 text-aurora-300 border-aurora-400/40",
  rejected: "bg-ember-500/15 text-ember-300 border-ember-400/40",
  pending:  "bg-amber-500/15 text-amber-300 border-amber-400/40",
}

export default function Badge({ label, tone = "active" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
        colors[tone] || colors.active
      }`}
    >
      {label}
    </span>
  )
}
