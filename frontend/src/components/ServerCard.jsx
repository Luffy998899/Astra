import Badge from "./Badge.jsx"

export default function ServerCard({ server }) {
  const statusTone = {
    active: "active",
    suspended: "suspended",
    deleted: "deleted"
  }

  return (
    <div className="rounded-2xl border border-slate-700/40 bg-ink-900/70 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{server.name}</h3>
          <p className="text-sm text-slate-400">{server.plan}</p>
        </div>
        <Badge label={server.status} tone={statusTone[server.status]} />
      </div>
      <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Expiry</p>
          <p className="mt-1 font-semibold">{server.expires}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Grace</p>
          <p className="mt-1 font-semibold">{server.grace}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Coins</p>
          <p className="mt-1 font-semibold">{server.coins}</p>
        </div>
      </div>
      {server.banner ? (
        <div className="mt-4 rounded-xl border border-ember-400/40 bg-ember-500/10 px-4 py-3 text-sm text-ember-200">
          {server.banner}
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="rounded-xl bg-neon-500/15 px-4 py-2 text-sm font-semibold text-neon-200 transition hover:bg-neon-500/25">
          Renew
        </button>
        <button className="rounded-xl border border-slate-600/60 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500/80">
          Manage
        </button>
      </div>
    </div>
  )
}
