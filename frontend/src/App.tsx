import { Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import LandingPage from "@/pages/LandingPage"
import DashboardPage from "@/pages/DashboardPage"
import MeetingDetailPage from "@/pages/MeetingDetailPage"
// import ProcessingPage from "@/pages/ProcessingPage"
import InsightsPage from "./pages/InsightsPage"
import ActionItemsPage from "./pages/ActionItemsPage"
import BlockersPage from "./pages/BlockersPage";
import SettingsPage from "./pages/SettingsPage";
import { useAuthStore } from "./state/authStore"
import { useTheme } from "./hooks/useTheme"

import AppLayout from "./layout/AppLayout"

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Initialize theme on app mount
  useTheme()

  // Check for existing auth token on app mount
  useEffect(() => {
    checkAuth()
    // Give a tiny delay to prevent flash
    setTimeout(() => setIsCheckingAuth(false), 100)
  }, [checkAuth])

  // Show loading screen while checking auth
  if (isCheckingAuth) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #ffffffff 0%, #807878ff 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
          </style>
          <p style={{ fontSize: '18px', fontWeight: 500 }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Landing Page - Login/Signup */}
      <Route path="/" element={<LandingPage />} />

      {/* Protected Routes */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/meetings/:id" element={<MeetingDetailPage />} />
        {/* <Route path="/processing" element={<ProcessingPage />} /> */}
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/insights/action-items" element={<ActionItemsPage />} />
        <Route path="/insights/blockers" element={<BlockersPage />} />


      </Route>
    </Routes>
  )
}

