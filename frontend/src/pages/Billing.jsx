import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SectionHeader from "../components/SectionHeader.jsx"
import { api } from "../services/api.js"

export default function Billing() {
  const [amount, setAmount] = useState("")
  const [utrNumber, setUtrNumber] = useState("")
  const [screenshot, setScreenshot] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    const loadSubmissions = async () => {
      try {
        const data = await api.getUTRSubmissions(token)
        setSubmissions(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadSubmissions()
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!amount || !utrNumber || !screenshot) {
      setError("Please fill in all fields and select a screenshot")
      return
    }

    setSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      const result = await api.submitUTR(token, parseFloat(amount), utrNumber, screenshot)
      
      // Refresh submissions
      const data = await api.getUTRSubmissions(token)
      setSubmissions(data || [])

      // Clear form
      setAmount("")
      setUtrNumber("")
      setScreenshot(null)
      alert("UTR submitted successfully! Admin will review soon.")
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="UTR Billing" subtitle="Upload proof. Admin reviews in minutes." />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="glass rounded-2xl border border-slate-700/40 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-900/20 border border-red-700/30 p-3 text-sm text-red-300">
                {error}
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Amount</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-slate-700/60 bg-ink-900/70 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-aurora-500/50 focus:outline-none"
                placeholder="₹25.00"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-500">UTR Number</label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-slate-700/60 bg-ink-900/70 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-aurora-500/50 focus:outline-none"
                placeholder="UTR000000"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Screenshot</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files?.[0])}
                required
                className="mt-2 w-full rounded-xl border border-slate-700/60 bg-ink-900/70 px-4 py-3 text-sm text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-100 focus:border-aurora-500/50 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="button-3d w-full rounded-xl bg-aurora-500/20 px-4 py-3 text-sm font-semibold text-aurora-200 hover:bg-aurora-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit for review"}
            </button>
          </form>
        </div>
        <div className="rounded-2xl border border-slate-800/60 bg-ink-900/70 p-6">
          <p className="text-sm text-slate-400">Recent submissions</p>
          {submissions.length > 0 ? (
            <div className="mt-4 space-y-3 text-sm">
              {submissions.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/60 bg-ink-950/60 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-slate-100">₹{item.amount.toFixed(2)}</p>
                    <p className="text-xs text-slate-500">{item.utr_number}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      item.status === "approved" ? "text-aurora-300" :
                      item.status === "rejected" ? "text-red-300" :
                      "text-amber-300"
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">No submissions yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
