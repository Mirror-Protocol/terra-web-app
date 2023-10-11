import { Route, Routes, Navigate } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import PairPage from "./pages/Dashboard/Pair"
import Swap from "./pages/Swap"

export default () => (
  <Routes>
    {/* <Route index element={<Dashboard />} /> */}
    <Route path="/swap" element={<Swap />} />
    <Route path="/pairs/:address" element={<PairPage />} />
    <Route element={<Navigate to="/" replace />} />
    <Route path="/migration" element={<Swap />} />
    <Route index element={<Navigate to="/swap" replace />} />
    <Route path="*" element={<Navigate to="/swap" replace />} />
  </Routes>
)
