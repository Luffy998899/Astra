import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-semibold text-slate-100">Page not found</h1>
      <p className="text-slate-400">The route you requested does not exist.</p>
      <Link to="/" className="button-3d rounded-xl bg-neon-500/20 px-4 py-2 text-sm font-semibold text-neon-200">
        Return home
      </Link>
    </div>
  )
}
