import { Routes, Route } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import DashboardPage from "@/pages/DashboardPage"
import MeetingDetailPage from "@/pages/MeetingDetailPage"
// import ProcessingPage from "@/pages/ProcessingPage"
import InsightsPage from "./pages/InsightsPage"
import ActionItemsPage from "./pages/ActionItemsPage"
import BlockersPage from "./pages/BlockersPage";


import AppLayout from "./layout/AppLayout"

export default function App() {
  return (
    <Routes>
      {/* Landing Page - Login/Signup */}
      <Route path="/" element={<LandingPage />} />

      {/* Protected Routes */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/meetings/:id" element={<MeetingDetailPage />} />
        {/* <Route path="/processing" element={<ProcessingPage />} /> */}
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/insights/action-items" element={<ActionItemsPage />} />
        <Route path="/insights/blockers" element={<BlockersPage />} />


      </Route>
    </Routes>
  )
}


