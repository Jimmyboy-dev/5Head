import React, { ReactElement } from "react"
import { Routes as Routez, Route } from "react-router-dom"
import NodeCG from "./pages/NodeCG"
import Dashboard from "./pages/Dashboard"
import LogPage from "./pages/LogPage"
export default function Routes(): ReactElement {
  return (
    <Routez>
      <Route path="/" element={<Dashboard />} />
      <Route path="/nodecg" element={<NodeCG />} />
      <Route path="/logs" element={<LogPage />} />
    </Routez>
  )
}
