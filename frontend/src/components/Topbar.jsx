import { Bell, Search } from "lucide-react"
import Badge from "./Badge.jsx"

export default function Topbar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">AstraNodes</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100">
          Welcome back, Commander
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-700/50 bg-ink-900/70 px-3 py-2 text-sm text-slate-400 md:flex">
          <Search className="h-4 w-4" />
          <span>Search servers</span>
        </div>
        <button className="grid h-11 w-11 place-items-center rounded-xl border border-slate-700/50 bg-ink-900/70 text-slate-300">
          <Bell className="h-4 w-4" />
        </button>
        <Badge label="PRO" tone="admin" />
      </div>
    </header>
  )
}
