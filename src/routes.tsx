import { Route, Routes, Navigate } from "react-router-dom"

import Swap from "./pages/Swap"

export default () => (
  <Routes>
    <Route path="/swap" element={<Swap />} />
    <Route path="/migration" element={<Swap />} />
    <Route index element={<Navigate to="/swap" replace />} />
    <Route path="*" element={<Navigate to="/swap" replace />} />
  </Routes>
)
