import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SectionHeader from "../components/SectionHeader.jsx"
import Badge from "../components/Badge.jsx"
import { api } from "../services/api.js"

export default function Support() {
  const [tickets, setTickets] = useState([])
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
  }, [navigate])

  const loadTickets = async () => {
    try {
      const token = localStorage.getItem("token")
      const data = await api.getMyTickets(token)
      setTickets(data || [])
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
        subtitle="Create and manage your support tickets"
        action={
          <button
            onClick={() => navigate("/support/new")}
            className="button-3d rounded-xl bg-neon-500/20 px-4 py-2 text-sm font-semibold text-neon-200 hover:bg-neon-500/30"
          >
            + New Ticket
          </button>
        }
      />

      {error && (
        <div className="rounded-lg bg-red-900/20 border border-red-700/30 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {tickets.length > 0 ? (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/support/${ticket.id}`)}
              className="rounded-2xl border border-slate-800/60 bg-ink-900/70 p-6 cursor-pointer hover:border-aurora-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-slate-100 truncate">
                      {ticket.subject}
                    </h3>
                    <Badge
                      label={ticket.status}
                      tone={ticket.status === "open" ? "active" : "rejected"}
                    />
                    {ticket.priority && (
                      <Badge
                        label={ticket.priority}
                        tone={
                          ticket.priority === "High" ? "rejected" : 
                          ticket.priority === "Medium" ? "warning" : 
                          "neutral"
                        }
                      />
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mb-3">
                    Category: <span className="text-slate-300">{ticket.category}</span>
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Created {formatDate(ticket.created_at)}</span>
                    <span>•</span>
                    <span>{ticket.message_count} messages</span>
                    <span>•</span>
                    <span>Updated {formatDate(ticket.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800/60 bg-ink-900/70 p-12 text-center">
          <p className="text-slate-400 mb-4">No tickets yet</p>
          <button
            onClick={() => navigate("/support/new")}
            className="button-3d rounded-xl bg-neon-500/20 px-6 py-3 text-sm font-semibold text-neon-200 hover:bg-neon-500/30"
          >
            Create Your First Ticket
          </button>
        </div>
      )}
    </div>
  )
}
