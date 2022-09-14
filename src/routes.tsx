import { Route, Routes, Navigate } from "react-router-dom"

import Swap from "./pages/Swap"
import Dashboard from "./pages/Dashboard"
import PairPage from "./pages/Dashboard/Pair"

export default () => (
  <Routes>
    <Route path="/swap" element={<Swap />} />
    <Route index element={<Navigate to="/swap" replace />} />
    <Route path="*" element={<Navigate to="/swap" replace />} />
  </Routes>
)
