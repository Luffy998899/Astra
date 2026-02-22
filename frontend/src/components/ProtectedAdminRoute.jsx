import { Navigate } from "react-router-dom"

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="rounded-2xl border border-red-800/60 bg-red-900/20 p-8 text-center">
          <h2 className="text-2xl font-bold text-red-300 mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-4">This area is restricted to administrators only.</p>
          <a
            href="/dashboard"
            className="button-3d rounded-xl bg-aurora-500/20 px-6 py-2 text-sm font-semibold text-aurora-200 hover:bg-aurora-500/30"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return children
}
