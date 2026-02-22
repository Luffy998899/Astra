import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SectionHeader from "../components/SectionHeader.jsx"
import Badge from "../components/Badge.jsx"
import { api } from "../services/api.js"

export default function AdminTickets() {
  const [tickets, setTickets] = useState([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    loadTickets()
  }, [filter, navigate])

  const loadTickets = async () => {
    try {
      const token = localStorage.getItem("token")
      const data = await api.getAllTickets(token, filter !== "all" ? filter : undefined)
      setTickets(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">Loading tickets...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Support Tickets"
        subtitle="Manage all customer support tickets"
      />

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            filter === "all"
              ? "bg-neon-500/20 text-neon-200 border border-neon-500/30"
              : "bg-ink-900/50 text-slate-400 border border-slate-800/60 hover:bg-ink-900/70"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("open")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            filter === "open"
              ? "bg-aurora-500/20 text-aurora-200 border border-aurora-500/30"
              : "bg-ink-900/50 text-slate-400 border border-slate-800/60 hover:bg-ink-900/70"
          }`}
        >
          Open
        </button>
        <button
          onClick={() => setFilter("closed")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            filter === "closed"
              ? "bg-slate-700/20 text-slate-300 border border-slate-600/30"
              : "bg-ink-900/50 text-slate-400 border border-slate-800/60 hover:bg-ink-900/70"
          }`}
        >
          Closed
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-900/20 border border-red-700/30 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Tickets Grid */}
      {tickets.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/60 bg-ink-900/70 p-12 text-center">
          <p className="text-slate-400">No tickets found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
              className="rounded-2xl border border-slate-800/60 bg-ink-900/70 p-6 hover:border-slate-700/80 transition-colors cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-slate-500">#{ticket.id}</span>
                    <Badge
                      label={ticket.status}
                      tone={ticket.status === "open" ? "active" : "rejected"}
                    />
                    <span className="text-xs px-2 py-1 rounded bg-slate-800/50 text-slate-400">
                      {ticket.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-1">
                    {ticket.subject}
                  </h3>
                  <p className="text-sm text-slate-400">
                    User ID: {ticket.user_id} • Created {formatDate(ticket.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {ticket.message_count > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-aurora-500/20 text-aurora-300 font-semibold">
                      {ticket.message_count} {ticket.message_count === 1 ? "message" : "messages"}
                    </span>
                  )}
                  <svg
                    className="w-5 h-5 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
