import { Link } from "react-router-dom"
import { ShieldCheck, Zap, Coins, Server, ArrowRight } from "lucide-react"
import Logo from "../components/Logo.jsx"

const features = [
  {
    title: "Automated Renewal",
    description: "Coins or balance renewals execute automatically with 12h grace protection.",
    icon: Zap
  },
  {
    title: "Anti-Abuse Core",
    description: "IP-based coupon protection, flagging, and rate-limited endpoints.",
    icon: ShieldCheck
  },
  {
    title: "Coin Economy",
    description: "AFK earning, coin plans, and live usage insights in one dashboard.",
    icon: Coins
  },
  {
    title: "Pterodactyl Ready",
    description: "Server lifecycle actions handled securely via Admin API.",
    icon: Server
  }
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 grid-noise opacity-30" />
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-6 py-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <Logo size="lg" />
            <div className="flex items-center gap-4 text-sm">
              <Link to="/login" className="text-slate-300 hover:text-slate-100">
                Login
              </Link>
              <Link
                to="/register"
                className="button-3d rounded-xl bg-neon-500/20 px-4 py-2 font-semibold text-neon-200"
              >
                Get Started
              </Link>
            </div>
          </header>
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.5em] text-slate-500">AstraNodes</p>
              <h1 className="text-4xl font-semibold leading-tight text-slate-100 sm:text-5xl">
                Hosting crafted for Minecraft empires. Automate everything.
              </h1>
              <p className="max-w-xl text-lg text-slate-400">
                Launch servers in seconds, keep renewals automatic, and protect revenue with
                enterprise-grade abuse prevention. Built on Pterodactyl with a modern finance
                engine.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="button-3d inline-flex items-center gap-2 rounded-xl bg-neon-500/20 px-5 py-3 text-sm font-semibold text-neon-200"
                >
                  Launch Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/plans"
                  className="button-3d inline-flex items-center gap-2 rounded-xl border border-slate-700/60 px-5 py-3 text-sm font-semibold text-slate-200"
                >
                  View Plans
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm sm:flex sm:gap-6">
                <div>
                  <p className="text-3xl font-semibold text-slate-100">99.9%</p>
                  <p className="text-slate-400">Uptime</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-slate-100">12h</p>
                  <p className="text-slate-400">Grace window</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-slate-100">5 min</p>
                  <p className="text-slate-400">Cron checks</p>
                </div>
              </div>
            </div>
            <div className="glass relative rounded-3xl border border-slate-700/40 p-8 shadow-soft">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon-500/20 blur-3xl" />
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Live Snapshot</p>
                <div className="space-y-4 rounded-2xl border border-slate-800/60 bg-ink-900/80 p-6">
                  <p className="text-sm text-slate-400">Coins balance</p>
                  <p className="text-4xl font-semibold text-neon-200">12,480</p>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>AFK rate</span>
                    <span className="text-slate-200">1 coin / min</span>
                  </div>
                </div>
                <div className="grid gap-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-ink-900/70 px-4 py-3">
                    <span>Active servers</span>
                    <span className="font-semibold">6</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-ink-900/70 px-4 py-3">
                    <span>Renewals this week</span>
                    <span className="font-semibold">14</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-ink-900/70 px-4 py-3">
                    <span>Suspensions prevented</span>
                    <span className="font-semibold">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="glass rounded-2xl border border-slate-700/40 p-6 shadow-soft"
                >
                  <Icon className="h-6 w-6 text-neon-300" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-100">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
                </div>
              )
            })}
          </section>
          <section className="glass rounded-3xl border border-slate-700/40 p-10 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-semibold text-slate-100">
                  Ready for production-grade hosting?
                </h2>
                <p className="mt-2 text-slate-400">
                  Spin up a secure dashboard and keep every server in compliance.
                </p>
              </div>
              <Link
                to="/register"
                className="button-3d inline-flex items-center gap-2 rounded-xl bg-neon-500/20 px-6 py-3 text-sm font-semibold text-neon-200"
              >
                Build my stack <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
          <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/60 py-6 text-xs text-slate-500">
            <p>2026 AstraNodes. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Status</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
