import { Routes, Route } from "react-router-dom"
import DashboardPage from "@/pages/DashboardPage"
import MeetingDetailPage from "@/pages/MeetingDetailPage"
import ProcessingPage from "@/pages/ProcessingPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/meetings/:id" element={<MeetingDetailPage />} />
      <Route path="/processing" element={<ProcessingPage />} />
    </Routes>
  )
}

export default App
