import { Route, Routes } from "react-router-dom"
import AppLayout from "./layouts/AppLayout.jsx"
import AuthLayout from "./layouts/AuthLayout.jsx"
import Landing from "./pages/Landing.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Plans from "./pages/Plans.jsx"
import CouponRedeem from "./pages/CouponRedeem.jsx"
import Coins from "./pages/Coins.jsx"
import Billing from "./pages/Billing.jsx"
import MyServers from "./pages/MyServers.jsx"
import AdminPanel from "./pages/AdminPanel.jsx"
import NotFound from "./pages/NotFound.jsx"
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/coupons" element={<CouponRedeem />} />
        <Route path="/coins" element={<Coins />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/servers" element={<MyServers />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminPanel />
            </ProtectedAdminRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
