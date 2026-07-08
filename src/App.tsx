import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Sidebar } from './components/layout/Sidebar'
import { Navbar } from './components/layout/Navbar'
import { LandingPage } from './pages/LandingPage'
import { TeamPage } from './pages/TeamPage'
import { DashboardPage } from './pages/Dashboard'
import { LiveThreatMapPage } from './pages/LiveThreatMap'
import { ThreatIntelligencePage } from './pages/ThreatIntelligence'
import { AttackAnalyticsPage } from './pages/AttackAnalytics'
import { VulnerabilityCenterPage } from './pages/VulnerabilityCenter'
import { AIThreatDetectionPage } from './pages/AIThreatDetection'
import { MalwareAnalysisPage } from './pages/MalwareAnalysis'
import { NetworkMonitoringPage } from './pages/NetworkMonitoring'
import { IncidentResponsePage } from './pages/IncidentResponse'
import { LogAnalysisPage } from './pages/LogAnalysis'
import { ReportsPage } from './pages/Reports'
import { SettingsPage } from './pages/Settings'
import { ApplicationLayerPage } from './pages/ApplicationLayer'
import { UrlScannerPage } from './pages/UrlScanner'
import { ChatBubble } from './features/ai-assistant/components/ChatBubble'
import { ChatWindow } from './features/ai-assistant/components/ChatWindow'
import './App.css'

function AppShell() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-3 py-4 text-slate-100 sm:px-4 lg:px-6">
      <div className="mx-auto flex max-w-7xl gap-4">
        <Sidebar />
        <main className="flex-1">
          <Navbar />
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/live-threat-map" element={<LiveThreatMapPage />} />
            <Route path="/application-layer" element={<ApplicationLayerPage />} />
            <Route path="/url-scanner" element={<UrlScannerPage />} />
            <Route path="/threat-intelligence" element={<ThreatIntelligencePage />} />
            <Route path="/attack-analytics" element={<AttackAnalyticsPage />} />
            <Route path="/vulnerability-center" element={<VulnerabilityCenterPage />} />
            <Route path="/ai-threat-detection" element={<AIThreatDetectionPage />} />
            <Route path="/malware-analysis" element={<MalwareAnalysisPage />} />
            <Route path="/network-monitoring" element={<NetworkMonitoringPage />} />
            <Route path="/incident-response" element={<IncidentResponsePage />} />
            <Route path="/log-analysis" element={<LogAnalysisPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
      <ChatBubble />
      <ChatWindow />
    </div>
  )
}

function AppLayout() {
  const location = useLocation()
  if (location.pathname === '/') {
    return <LandingPage />
  }
  if (location.pathname === '/team') {
    return <TeamPage />
  }
  return <AppShell />
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
      <Toaster position="top-right" toastOptions={{ style: { background: '#020617', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.12)' } }} />
    </BrowserRouter>
  )
}

export default App
