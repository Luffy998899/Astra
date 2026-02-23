import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { LogOut, LayoutDashboard, Package, Coins, Server, CreditCard, Ticket, LifeBuoy, Shield } from "lucide-react"
import Sidebar from "../components/Sidebar.jsx"
import Logo from "../components/Logo.jsx"

const mobileNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/plans", label: "Plans", icon: Package },
  { to: "/coins", label: "Coins", icon: Coins },
  { to: "/servers", label: "Servers", icon: Server },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/coupons", label: "Redeem", icon: Ticket },
  { to: "/support", label: "Support", icon: LifeBuoy }
]

export default function AppLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const isAdmin = user.role === "admin"
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[auto_1fr]">
        <Sidebar />
        <main className="px-6 py-6 lg:px-10">
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-800/60 bg-ink-900/60 px-4 py-4 lg:hidden">
            <div className="flex items-center justify-between">
              <Logo size="md" />
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className="button-3d flex items-center gap-1 rounded-lg border border-neon-400/40 px-3 py-2 text-xs font-semibold text-neon-200"
                  >
                    <Shield className="h-3 w-3" />
                    Admin
                  </NavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="button-3d flex items-center gap-1 rounded-lg border border-red-700/40 bg-red-900/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/30"
                >
                  <LogOut className="h-3 w-3" />
                  Logout
                </button>
              </div>
            </div>
            <div className="flex overflow-x-auto gap-1.5 pb-1 scrollbar-none">
              {mobileNav.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                        isActive ? "bg-neon-500/20 text-neon-200" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                      }`
                    }
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </NavLink>
                )
              })}
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
