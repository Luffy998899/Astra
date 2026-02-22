import { Outlet, Link } from "react-router-dom"
import Logo from "../components/Logo.jsx"

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10">
        <Link to="/" className="w-fit">
          <Logo size="lg" />
        </Link>
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold text-slate-100">
              Secure Minecraft hosting, built for scale.
            </h1>
            <p className="text-slate-400">
              Manage coins, plans, and renewals with zero friction. Built-in anti-abuse and
              automated suspension workflows keep your fleet online.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                "Instant provisioning",
                "Auto-renew logic",
                "DDoS protection",
                "Pterodactyl automation"
              ].map((item) => (
                <div key={item} className="rounded-xl border border-slate-800/60 bg-ink-900/60 px-4 py-3">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl border border-slate-700/40 p-8 shadow-soft">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
