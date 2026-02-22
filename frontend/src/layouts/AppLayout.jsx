import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import Sidebar from "../components/Sidebar.jsx"
import Logo from "../components/Logo.jsx"

const mobileNav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/plans", label: "Plans" },
  { to: "/coins", label: "Coins" },
  { to: "/servers", label: "Servers" }
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
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800/60 bg-ink-900/60 px-4 py-4 lg:hidden">
            <div className="flex items-center justify-between">
              <Logo size="md" />
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className="button-3d rounded-lg border border-neon-400/40 px-3 py-2 text-xs font-semibold text-neon-200"
                  >
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
            <div className="flex flex-wrap gap-2">
              {mobileNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2 text-xs font-semibold ${
                      isActive ? "bg-neon-500/20 text-neon-200" : "text-slate-300"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
