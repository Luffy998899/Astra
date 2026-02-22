import Badge from "./Badge.jsx"

export default function PlanCard({ plan, tone = "neon" }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-700/40 bg-ink-900/70 p-6 shadow-soft transition hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{plan.name}</h3>
            <p className="text-sm text-slate-400">{plan.duration}</p>
          </div>
          <Badge label={plan.tag} tone={tone} />
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm text-slate-300">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">RAM</p>
            <p className="mt-1 font-semibold">{plan.ram}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">CPU</p>
            <p className="mt-1 font-semibold">{plan.cpu}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Storage</p>
            <p className="mt-1 font-semibold">{plan.storage}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Price</p>
            <p className="mt-1 text-2xl font-semibold text-slate-100">{plan.price}</p>
          </div>
          <button className="rounded-xl border border-neon-400/40 bg-neon-500/10 px-4 py-2 text-sm font-semibold text-neon-200 transition hover:bg-neon-500/20">
            Deploy
          </button>
        </div>
      </div>
    </div>
  )
}
