export default function StatCard({ label, value, hint, accent = "neon" }) {
  const accents = {
    neon: "from-neon-500/30 via-neon-500/10 to-transparent",
    aurora: "from-aurora-500/30 via-aurora-500/10 to-transparent",
    ember: "from-ember-500/30 via-ember-500/10 to-transparent"
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/40 bg-ink-900/70 p-6 shadow-soft">
      <div className={`absolute inset-0 bg-gradient-to-br ${accents[accent]} opacity-70`} />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
        <p className="mt-3 text-3xl font-semibold text-slate-100">{value}</p>
        {hint ? <p className="mt-3 text-sm text-slate-400">{hint}</p> : null}
      </div>
    </div>
  )
}
