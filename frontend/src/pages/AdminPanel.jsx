import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SectionHeader from "../components/SectionHeader.jsx"
import Badge from "../components/Badge.jsx"
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
  Circle,
  Plus,
  Edit2,
  Trash2,
  X
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

export default function AdminPanel() {
  const [tab, setTab] = useState("users")
  const [users, setUsers] = useState([])
  const [servers, setServers] = useState([])
  const [utrs, setUtrs] = useState([])
  const [coinPlans, setCoinPlans] = useState([])
  const [realPlans, setRealPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [flagging, setFlagging] = useState({})
  const [approving, setApproving] = useState({})
  const [suspending, setSuspending] = useState({})
  const [deleting, setDeleting] = useState({})
  const [planModal, setPlanModal] = useState({ open: false, type: null, mode: 'create', data: null })
  const [planForm, setPlanForm] = useState({})
  const [savingPlan, setSavingPlan] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ open: false, type: null, id: null })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    const loadAdminData = async () => {
      try {
        const [usersData, serversData, utrsData, coinPlansData, realPlansData] = await Promise.all([
          api.getUsers(token),
          api.getServers(token),
          api.getUTRSubmissionsAdmin(token),
          api.getCoinPlans(),
          api.getRealPlans()
        ])

        setUsers(usersData || [])
        setServers(serversData || [])
        setUtrs(utrsData || [])
        setCoinPlans(coinPlansData || [])
        setRealPlans(realPlansData || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [navigate])

  const handleFlagUser = async (userId) => {
    setFlagging((prev) => ({ ...prev, [userId]: true }))
    setError("")

    try {
      const token = localStorage.getItem("token")
      await api.flagUser(token, userId)

      // Refresh users
      const data = await api.getUsers(token)
      setUsers(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setFlagging((prev) => ({ ...prev, [userId]: false }))
    }
  }

  const handleSuspendServer = async (serverId) => {
    setSuspending((prev) => ({ ...prev, [serverId]: true }))
    setError("")

    try {
      const token = localStorage.getItem("token")
      await api.suspendServer(token, serverId)

      // Refresh servers
      const data = await api.getServers(token)
      setServers(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setSuspending((prev) => ({ ...prev, [serverId]: false }))
    }
  }

  const handleDeleteServer = async (serverId) => {
    if (!confirm("Are you sure you want to delete this server? This action cannot be undone.")) {
      return
    }

    setDeleting((prev) => ({ ...prev, [serverId]: true }))
    setError("")

    try {
      const token = localStorage.getItem("token")
      await api.deleteServer(token, serverId)

      // Refresh servers
      const data = await api.getServers(token)
      setServers(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting((prev) => ({ ...prev, [serverId]: false }))
    }
  }

  const openPlanModal = (type, mode, data = null) => {
    if (mode === 'edit' && data) {
      setPlanForm(data)
    } else {
      setPlanForm({
        name: '',
        icon: type === 'coin' ? 'Package' : 'Server',
        ram: '',
        cpu: '',
        storage: '',
        [type === 'coin' ? 'coin_price' : 'price']: '',
        duration_type: 'days',
        duration_days: '',
        limited_stock: false,
        stock_amount: '',
        one_time_purchase: false
      })
    }
    setPlanModal({ open: true, type, mode, data })
  }

  const closePlanModal = () => {
    setPlanModal({ open: false, type: null, mode: 'create', data: null })
    setPlanForm({})
    setError("")
  }

  const handleSavePlan = async (e) => {
    e.preventDefault()
    setSavingPlan(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const { type, mode, data } = planModal

      // Prepare plan data (RAM and Storage are in GB)
      const planData = {
        name: planForm.name,
        icon: planForm.icon || (type === 'coin' ? 'Package' : 'Server'),
        ram: parseInt(planForm.ram),
        cpu: parseInt(planForm.cpu),
        storage: parseInt(planForm.storage),
        [type === 'coin' ? 'coin_price' : 'price']: parseFloat(planForm[type === 'coin' ? 'coin_price' : 'price']),
        duration_type: planForm.duration_type,
        duration_days: parseInt(planForm.duration_days),
        limited_stock: Boolean(planForm.limited_stock),
        stock_amount: planForm.limited_stock ? parseInt(planForm.stock_amount) : null
      }

      // For coin plans, add one_time_purchase
      if (type === 'coin') {
        planData.one_time_purchase = Boolean(planForm.one_time_purchase)
      }

      if (mode === 'create') {
        if (type === 'coin') {
          await api.createCoinPlan(token, planData)
        } else {
          await api.createRealPlan(token, planData)
        }
      } else {
        if (type === 'coin') {
          await api.updateCoinPlan(token, data.id, planData)
        } else {
          await api.updateRealPlan(token, data.id, planData)
        }
      }

      // Refresh plans
      const [coinData, realData] = await Promise.all([
        api.getCoinPlans(),
        api.getRealPlans()
      ])
      setCoinPlans(coinData || [])
      setRealPlans(realData || [])

      closePlanModal()
    } catch (err) {
      console.error("[ADMIN] Error saving plan:", err)
      setError(err.message)
    } finally {
      setSavingPlan(false)
    }
  }

  const handleDeletePlan = async () => {
    setDeleting(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const { type, id } = deleteModal

      if (type === 'coin') {
        await api.deleteCoinPlan(token, id)
      } else {
        await api.deleteRealPlan(token, id)
      }

      // Refresh plans
      const [coinData, realData] = await Promise.all([
        api.getCoinPlans(),
        api.getRealPlans()
      ])
      setCoinPlans(coinData || [])
      setRealPlans(realData || [])

      setDeleteModal({ open: false, type: null, id: null })
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const handleApproveUTR = async (utrId) => {
    setApproving((prev) => ({ ...prev, [`approve-${utrId}`]: true }))
    setError("")

    try {
      const token = localStorage.getItem("token")
      await api.approveUTR(token, utrId)

      // Refresh UTRs
      const data = await api.getUTRSubmissionsAdmin(token)
      setUtrs(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setApproving((prev) => ({ ...prev, [`approve-${utrId}`]: false }))
    }
  }

  const handleRejectUTR = async (utrId) => {
    setApproving((prev) => ({ ...prev, [`reject-${utrId}`]: true }))
    setError("")

    try {
      const token = localStorage.getItem("token")
      await api.rejectUTR(token, utrId)

      // Refresh UTRs
      const data = await api.getUTRSubmissionsAdmin(token)
      setUtrs(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setApproving((prev) => ({ ...prev, [`reject-${utrId}`]: false }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">Loading admin data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Admin Panel"
        subtitle="Monitor users, plans, coupons, and server lifecycle events."
      />

      {error && (
        <div className="rounded-lg bg-red-900/20 border border-red-700/30 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-800/60">
        {["users", "servers", "utr", "plans"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t
                ? "border-b-2 border-aurora-500 text-aurora-200"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            {t === "users"
              ? "Users"
              : t === "servers"
              ? "Servers"
              : t === "utr"
              ? "UTR Submissions"
              : "Plans"}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {tab === "users" && (
        <div className="rounded-2xl border border-slate-800/60 bg-ink-900/70 p-6">
          <p className="text-sm text-slate-400 mb-4">Total Users: {users.length}</p>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/60 bg-ink-950/60 px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-100 truncate">{user.email}</p>
                  <p className="text-xs text-slate-500">ID: {user.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  {user.flagged && <Badge label="Flagged" tone="suspended" />}
                  <button
                    onClick={() => handleFlagUser(user.id)}
                    disabled={flagging[user.id]}
                    className="text-xs px-2 py-1 rounded bg-red-900/20 text-red-300 hover:bg-red-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {user.flagged ? "Unflag" : "Flag"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Servers Tab */}
      {tab === "servers" && (
        <div className="rounded-2xl border border-slate-800/60 bg-ink-900/70 p-6">
          <p className="text-sm text-slate-400 mb-4">Total Servers: {servers.length}</p>
          <div className="space-y-3">
            {servers.map((server) => (
              <div
                key={server.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/60 bg-ink-950/60 px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-100">{server.name}</p>
                  <p className="text-xs text-slate-500">Owner: {server.owner_email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    label={server.status}
                    tone={
                      server.status === "active"
                        ? "approved"
                        : server.status === "suspended"
                        ? "suspended"
                        : "rejected"
                    }
                  />
                  {server.status !== "deleted" && (
                    <>
                      <button
                        onClick={() => handleSuspendServer(server.id)}
                        disabled={suspending[server.id]}
                        className="text-xs px-3 py-1 rounded bg-orange-900/20 text-orange-300 hover:bg-orange-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {suspending[server.id] ? "Suspending..." : "Suspend"}
                      </button>
                      <button
                        onClick={() => handleDeleteServer(server.id)}
                        disabled={deleting[server.id]}
                        className="text-xs px-3 py-1 rounded bg-red-900/20 text-red-300 hover:bg-red-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {deleting[server.id] ? "Deleting..." : "Delete"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UTR Submissions Tab */}
      {tab === "utr" && (
        <div className="rounded-2xl border border-slate-800/60 bg-ink-900/70 p-6">
          <p className="text-sm text-slate-400 mb-4">Total Submissions: {utrs.length}</p>
          <div className="space-y-3">
            {utrs.map((utr) => (
              <div
                key={utr.id}
                className="rounded-xl border border-slate-800/60 bg-ink-950/60 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-100">
                      {utr.user_email} - ₹{utr.amount}
                    </p>
                    <p className="text-xs text-slate-500">UTR: {utr.utr_number}</p>
                  </div>
                  <Badge
                    label={utr.status}
                    tone={
                      utr.status === "approved"
                        ? "approved"
                        : utr.status === "rejected"
                        ? "rejected"
                        : "approved"
                    }
                  />
                </div>

                {utr.screenshot_url && (
                  <div className="mb-3 max-w-xs">
                    <img
                      src={utr.screenshot_url}
                      alt="UTR receipt"
                      className="rounded-lg max-h-40 object-cover border border-slate-700/40"
                    />
                  </div>
                )}

                {utr.status === "pending" && (
                  <div className="flex gap-2 pt-3 border-t border-slate-800/40">
                    <button
                      onClick={() => handleApproveUTR(utr.id)}
                      disabled={approving[`approve-${utr.id}`]}
                      className="flex-1 text-xs px-3 py-2 rounded bg-aurora-900/20 text-aurora-300 hover:bg-aurora-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {approving[`approve-${utr.id}`] ? "Approving..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleRejectUTR(utr.id)}
                      disabled={approving[`reject-${utr.id}`]}
                      className="flex-1 text-xs px-3 py-2 rounded bg-red-900/20 text-red-300 hover:bg-red-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {approving[`reject-${utr.id}`] ? "Rejecting..." : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {utrs.length === 0 && (
              <p className="text-slate-400 text-center py-8">No submissions to review</p>
            )}
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {tab === "plans" && (
        <div className="space-y-6">
          {/* Coin Plans Section */}
          <div className="rounded-2xl border border-slate-800/60 bg-ink-900/70 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-100">Coin Plans</h3>
              <button
                onClick={() => openPlanModal('coin', 'create')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-aurora-900/30 hover:bg-aurora-900/50 text-aurora-200 transition-all duration-200 hover:scale-105"
              >
                <Plus size={16} />
                Add Coin Plan
              </button>
            </div>
            <div className="space-y-3">
              {coinPlans.map((plan) => {
                const IconComponent = iconMap[plan.icon] || Package
                return (
                  <div
                    key={plan.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/60 bg-ink-950/60 px-4 py-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-aurora-900/20 flex items-center justify-center text-aurora-300">
                        <IconComponent size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-100">{plan.name}</p>
                        <p className="text-xs text-slate-500">
                          {plan.ram}GB RAM • {plan.cpu} CPU • {plan.storage}GB Storage
                        </p>
                        <p className="text-xs text-aurora-300 mt-1">
                          {plan.coin_price} coins • {plan.duration_days} days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openPlanModal('coin', 'edit', plan)}
                        className="p-2 rounded bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ open: true, type: 'coin', id: plan.id })}
                        className="p-2 rounded bg-red-900/20 hover:bg-red-900/40 text-red-300 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
              {coinPlans.length === 0 && (
                <p className="text-slate-400 text-center py-8">No coin plans yet</p>
              )}
            </div>
          </div>

          {/* Real Money Plans Section */}
          <div className="rounded-2xl border border-slate-800/60 bg-ink-900/70 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-100">Real Money Plans</h3>
              <button
                onClick={() => openPlanModal('real', 'create')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-aurora-900/30 hover:bg-aurora-900/50 text-aurora-200 transition-all duration-200 hover:scale-105"
              >
                <Plus size={16} />
                Add Real Plan
              </button>
            </div>
            <div className="space-y-3">
              {realPlans.map((plan) => {
                const IconComponent = iconMap[plan.icon] || Server
                return (
                  <div
                    key={plan.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/60 bg-ink-950/60 px-4 py-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-aurora-900/20 flex items-center justify-center text-aurora-300">
                        <IconComponent size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-100">{plan.name}</p>
                        <p className="text-xs text-slate-500">
                          {plan.ram}GB RAM • {plan.cpu} CPU • {plan.storage}GB Storage
                        </p>
                        <p className="text-xs text-aurora-300 mt-1">
                          ₹{plan.price} • {plan.duration_days} days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openPlanModal('real', 'edit', plan)}
                        className="p-2 rounded bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ open: true, type: 'real', id: plan.id })}
                        className="p-2 rounded bg-red-900/20 hover:bg-red-900/40 text-red-300 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
              {realPlans.length === 0 && (
                <p className="text-slate-400 text-center py-8">No real money plans yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Plan Create/Edit Modal */}
      {planModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800/60 bg-ink-900 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-100">
                {planModal.mode === 'create' ? 'Create' : 'Edit'} {planModal.type === 'coin' ? 'Coin' : 'Real Money'} Plan
              </h3>
              <button
                onClick={closePlanModal}
                className="p-2 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-900/20 border border-red-700/30 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSavePlan} className="space-y-4">
              {/* Plan Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={planForm.name || ''}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  placeholder="e.g., Starter Plan"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-700/50 bg-ink-950/60 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-aurora-500/50"
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                  {Object.keys(iconMap).map((iconName) => {
                    const IconComponent = iconMap[iconName]
                    const isSelected = planForm.icon === iconName
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setPlanForm({ ...planForm, icon: iconName })}
                        className={`p-3 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-aurora-500 bg-aurora-900/30 text-aurora-300'
                            : 'border-slate-700/50 bg-ink-950/60 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                        }`}
                      >
                        <IconComponent size={20} className="mx-auto" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Resources Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    RAM (GB)
                  </label>
                  <input
                    type="number"
                    value={planForm.ram || ''}
                    onChange={(e) => setPlanForm({ ...planForm, ram: e.target.value })}
                    placeholder="4"
                    required
                    min="1"
                    className="w-full px-4 py-2 rounded-lg border border-slate-700/50 bg-ink-950/60 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-aurora-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    CPU Cores
                  </label>
                  <input
                    type="number"
                    value={planForm.cpu || ''}
                    onChange={(e) => setPlanForm({ ...planForm, cpu: e.target.value })}
                    placeholder="2"
                    required
                    min="1"
                    className="w-full px-4 py-2 rounded-lg border border-slate-700/50 bg-ink-950/60 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-aurora-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Storage (GB)
                  </label>
                  <input
                    type="number"
                    value={planForm.storage || ''}
                    onChange={(e) => setPlanForm({ ...planForm, storage: e.target.value })}
                    placeholder="20"
                    required
                    min="1"
                    className="w-full px-4 py-2 rounded-lg border border-slate-700/50 bg-ink-950/60 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-aurora-500/50"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {planModal.type === 'coin' ? 'Coin Price' : 'Price (₹)'}
                </label>
                <input
                  type="number"
                  value={planForm[planModal.type === 'coin' ? 'coin_price' : 'price'] || ''}
                  onChange={(e) =>
                    setPlanForm({
                      ...planForm,
                      [planModal.type === 'coin' ? 'coin_price' : 'price']: e.target.value
                    })
                  }
                  placeholder={planModal.type === 'coin' ? '500' : '299'}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg border border-slate-700/50 bg-ink-950/60 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-aurora-500/50"
                />
              </div>

              {/* Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Duration Type
                  </label>
                  <select
                    value={planForm.duration_type || 'days'}
                    onChange={(e) => setPlanForm({ ...planForm, duration_type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-700/50 bg-ink-950/60 text-slate-200 focus:outline-none focus:border-aurora-500/50"
                  >
                    <option value="days">Days</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={planForm.duration_days || ''}
                    onChange={(e) => setPlanForm({ ...planForm, duration_days: e.target.value })}
                    placeholder="30"
                    required
                    min="1"
                    className="w-full px-4 py-2 rounded-lg border border-slate-700/50 bg-ink-950/60 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-aurora-500/50"
                  />
                </div>
              </div>

              {/* Stock Settings */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <input
                    type="checkbox"
                    checked={planForm.limited_stock || false}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, limited_stock: e.target.checked })
                    }
                    className="rounded border-slate-700/50 bg-ink-950/60 text-aurora-500 focus:ring-aurora-500/50"
                  />
                  Limited Stock
                </label>
                {planForm.limited_stock && (
                  <input
                    type="number"
                    value={planForm.stock_amount || ''}
                    onChange={(e) => setPlanForm({ ...planForm, stock_amount: e.target.value })}
                    placeholder="100"
                    min="1"
                    className="w-full px-4 py-2 rounded-lg border border-slate-700/50 bg-ink-950/60 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-aurora-500/50"
                  />
                )}
              </div>

              {/* One-time Purchase (Coin Plans Only) */}
              {planModal.type === 'coin' && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <input
                      type="checkbox"
                      checked={planForm.one_time_purchase || false}
                      onChange={(e) =>
                        setPlanForm({ ...planForm, one_time_purchase: e.target.checked })
                      }
                      className="rounded border-slate-700/50 bg-ink-950/60 text-aurora-500 focus:ring-aurora-500/50"
                    />
                    One-time Purchase Only
                  </label>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={savingPlan}
                  className="flex-1 px-6 py-3 rounded-lg bg-aurora-900/30 hover:bg-aurora-900/50 text-aurora-200 font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {savingPlan ? 'Saving...' : planModal.mode === 'create' ? 'Create Plan' : 'Update Plan'}
                </button>
                <button
                  type="button"
                  onClick={closePlanModal}
                  disabled={savingPlan}
                  className="px-6 py-3 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-red-800/60 bg-ink-900 p-6">
            <h3 className="text-xl font-bold text-red-300 mb-4">Delete Plan</h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete this plan? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeletePlan}
                disabled={deleting}
                className="flex-1 px-6 py-3 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-300 font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setDeleteModal({ open: false, type: null, id: null })}
                disabled={deleting}
                className="px-6 py-3 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
