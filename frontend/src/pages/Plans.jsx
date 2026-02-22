import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SectionHeader from "../components/SectionHeader.jsx"
import PlanCard from "../components/PlanCard.jsx"
import { api } from "../services/api.js"
import {
  Package,
  Server,
  Cpu,
  HardDrive,
  Zap,
  Sparkles,
  Star,
  Crown,
  Shield,
  Rocket,
  Gift,
  Gem,
  Trophy,
  Diamond,
  Circle
} from "lucide-react"

// Icon mapping for dynamic rendering
const iconMap = {
  Package,
  Server,
  Cpu,
  HardDrive,
  Zap,
  Sparkles,
  Star,
  Crown,
  Shield,
  Rocket,
  Gift,
  Gem,
  Trophy,
  Diamond,
  Circle
}

export default function Plans() {
  const [coinPlans, setCoinPlans] = useState([])
  const [realPlans, setRealPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [serverName, setServerName] = useState("")
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    const loadPlans = async () => {
      try {
        const coin = await api.getCoinPlans()
        const real = await api.getRealPlans()
        setCoinPlans(coin || [])
        setRealPlans(real || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadPlans()
  }, [navigate])

  const handlePurchase = async (e) => {
    e.preventDefault()
    if (!selectedPlan || !serverName.trim()) {
      setError("Please select a plan and enter a server name")
      return
    }

    setPurchasing(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      await api.purchaseServer(
        token,
        selectedPlan.type,
        selectedPlan.id,
        serverName
      )
      alert("Server purchased successfully!")
      setSelectedPlan(null)
      setServerName("")
      navigate("/servers")
    } catch (err) {
      setError(err.message)
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">Loading plans...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Coin Plans"
        subtitle="Use coins to provision weekly, monthly, or custom duration servers."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {coinPlans.map((plan) => {
          const IconComponent = iconMap[plan.icon] || Package
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan({ ...plan, type: "coin" })}
              className={`button-3d cursor-pointer rounded-xl border p-6 transition-all ${
                selectedPlan?.id === plan.id && selectedPlan?.type === "coin"
                  ? "border-aurora-400 bg-aurora-500/10"
                  : "border-slate-700/30 bg-slate-900/20 hover:border-aurora-400/50"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-aurora-900/20 flex items-center justify-center text-aurora-300">
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">{plan.name}</h3>
                    <p className="text-xs text-aurora-300 uppercase tracking-widest">Coin Plan</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-400">
                  <p className="flex items-center gap-2">
                    <HardDrive size={16} /> {plan.storage} GB Storage
                  </p>
                  <p className="flex items-center gap-2">
                    <Cpu size={16} /> {plan.cpu} CPU Cores
                  </p>
                  <p className="flex items-center gap-2">
                    <Zap size={16} /> {plan.ram} GB RAM
                  </p>
                </div>
                <div className="border-t border-slate-700/30 pt-4">
                  <p className="text-2xl font-bold text-aurora-300">{plan.coin_price}</p>
                  <p className="text-xs text-slate-500">coins / {plan.duration_days} days</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <SectionHeader
        title="Real Money Plans"
        subtitle="Balance-powered plans with the same duration flexibility."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {realPlans.map((plan) => {
          const IconComponent = iconMap[plan.icon] || Server
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan({ ...plan, type: "real" })}
              className={`button-3d cursor-pointer rounded-xl border p-6 transition-all ${
                selectedPlan?.id === plan.id && selectedPlan?.type === "real"
                  ? "border-ember-400 bg-ember-500/10"
                  : "border-slate-700/30 bg-slate-900/20 hover:border-ember-400/50"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-ember-900/20 flex items-center justify-center text-ember-300">
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">{plan.name}</h3>
                    <p className="text-xs text-ember-300 uppercase tracking-widest">Real Money</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-400">
                  <p className="flex items-center gap-2">
                    <HardDrive size={16} /> {plan.storage} GB Storage
                  </p>
                  <p className="flex items-center gap-2">
                    <Cpu size={16} /> {plan.cpu} CPU Cores
                  </p>
                  <p className="flex items-center gap-2">
                    <Zap size={16} /> {plan.ram} GB RAM
                  </p>
                </div>
                <div className="border-t border-slate-700/30 pt-4">
                  <p className="text-2xl font-bold text-ember-300">₹{plan.price.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">/ {plan.duration_days} days</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selectedPlan && (
        <div className="mt-10 rounded-xl border border-neon-500/30 bg-neon-900/20 p-6">
          <h3 className="text-lg font-semibold text-neon-200 mb-4">Confirm Purchase</h3>
          <form onSubmit={handlePurchase} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-900/20 border border-red-700/30 p-3 text-sm text-red-300">
                {error}
              </div>
            )}
            <div>
              <label className="text-sm text-slate-400">Server Name</label>
              <input
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="e.g., Astra SMP"
                className="mt-2 w-full rounded-lg border border-slate-700/60 bg-ink-900/70 px-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-neon-500/50 focus:outline-none"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="button-3d flex-1 rounded-lg border border-slate-700/30 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800/30"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={purchasing}
                className="button-3d flex-1 rounded-lg bg-neon-500/20 px-4 py-2 text-sm font-semibold text-neon-200 hover:bg-neon-500/30 disabled:opacity-60"
              >
                {purchasing ? "Processing..." : "Purchase Server"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
