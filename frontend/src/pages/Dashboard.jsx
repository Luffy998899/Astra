import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Topbar from "../components/Topbar.jsx"
import StatCard from "../components/StatCard.jsx"
import SectionHeader from "../components/SectionHeader.jsx"
import ServerCard from "../components/ServerCard.jsx"
import { api } from "../services/api.js"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)
  const [renewing, setRenewing] = useState({})
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    loadData()
  }, [navigate])

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token")
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      const balance = await api.getBalance(token)
      const userServers = await api.getUserServers(token)

      setUser({ ...userData, ...balance })
      setServers(userServers || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRenew = async (serverId) => {
    setRenewing((prev) => ({ ...prev, [serverId]: true }))
    setError("")

    try {
      const token = localStorage.getItem("token")
      await api.renewServer(token, serverId)
      // Refresh servers after renewal
      await loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setRenewing((prev) => ({ ...prev, [serverId]: false }))
    }
  }

  const stats = user
    ? [
        { label: "Coins", value: user.coins?.toLocaleString() || "0", hint: "AFK earning available", accent: "neon" },
        { label: "Balance", value: `₹${(user.balance || 0).toFixed(2)}`, hint: "Ready for purchases", accent: "aurora" },
        { label: "Active Servers", value: servers.filter((s) => s.status === "active").length, hint: "Renewable servers", accent: "ember" }
      ]
    : []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Topbar />
      <section className="grid gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
      <section className="space-y-4">
        <SectionHeader
          title="My Servers"
          subtitle="Track renewals, suspensions, and coin usage in real time."
          action={
            <button
              onClick={() => navigate("/plans")}
              className="button-3d rounded-xl bg-neon-500/20 px-4 py-2 text-sm font-semibold text-neon-200 hover:bg-neon-500/30 transition-all"
            >
              Deploy new server
            </button>
          }
        />
        {error && (
          <div className="rounded-lg bg-red-900/20 border border-red-700/30 p-3 text-sm text-red-300">
            {error}
          </div>
        )}
        {servers.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {servers.map((server) => (
              <ServerCard key={server.id} server={server} onRenew={handleRenew} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-700/30 bg-slate-900/20 p-8 text-center">
            <p className="text-slate-400">No servers yet. Deploy one to get started.</p>
            <button
              onClick={() => navigate("/plans")}
              className="button-3d mt-4 rounded-xl bg-neon-500/20 px-4 py-2 text-sm font-semibold text-neon-200 hover:bg-neon-500/30 transition-all"
            >
              Browse plans
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
