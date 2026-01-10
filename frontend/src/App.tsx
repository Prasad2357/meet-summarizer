import { Routes, Route } from "react-router-dom"
import DashboardPage from "@/pages/DashboardPage"
import MeetingDetailPage from "@/pages/MeetingDetailPage"
// import ProcessingPage from "@/pages/ProcessingPage"

import AppLayout from "./layout/AppLayout"

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/meetings/:id" element={<MeetingDetailPage />} />
        {/* <Route path="/processing" element={<ProcessingPage />} /> */}
      </Route>
    </Routes>
  )
}


