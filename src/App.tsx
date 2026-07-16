import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Sidebar } from './components/layout/Sidebar'
import { Navbar } from './components/layout/Navbar'
import { ChatBubble } from './features/ai-assistant/components/ChatBubble'
import { ChatWindow } from './features/ai-assistant/components/ChatWindow'
import './App.css'

const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })))
const TeamPage = lazy(() => import('./pages/TeamPage').then(m => ({ default: m.TeamPage })))
const DashboardPage = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.DashboardPage })))
const LiveThreatMapPage = lazy(() => import('./pages/LiveThreatMap').then(m => ({ default: m.LiveThreatMapPage })))
const ThreatIntelligencePage = lazy(() => import('./pages/ThreatIntelligence').then(m => ({ default: m.ThreatIntelligencePage })))
const AttackAnalyticsPage = lazy(() => import('./pages/AttackAnalytics').then(m => ({ default: m.AttackAnalyticsPage })))
const VulnerabilityCenterPage = lazy(() => import('./pages/VulnerabilityCenter').then(m => ({ default: m.VulnerabilityCenterPage })))
const AIThreatDetectionPage = lazy(() => import('./pages/AIThreatDetection').then(m => ({ default: m.AIThreatDetectionPage })))
const MalwareAnalysisPage = lazy(() => import('./pages/MalwareAnalysis').then(m => ({ default: m.MalwareAnalysisPage })))
const NetworkMonitoringPage = lazy(() => import('./pages/NetworkMonitoring').then(m => ({ default: m.NetworkMonitoringPage })))
const IncidentResponsePage = lazy(() => import('./pages/IncidentResponse').then(m => ({ default: m.IncidentResponsePage })))
const LogAnalysisPage = lazy(() => import('./pages/LogAnalysis').then(m => ({ default: m.LogAnalysisPage })))
const ReportsPage = lazy(() => import('./pages/Reports').then(m => ({ default: m.ReportsPage })))
const SettingsPage = lazy(() => import('./pages/Settings').then(m => ({ default: m.SettingsPage })))
const ApplicationLayerPage = lazy(() => import('./pages/ApplicationLayer').then(m => ({ default: m.ApplicationLayerPage })))
const UrlScannerPage = lazy(() => import('./pages/UrlScanner').then(m => ({ default: m.UrlScannerPage })))

function AppShell() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-3 py-4 text-slate-100 sm:px-4 lg:px-6">
      <div className="mx-auto flex max-w-7xl gap-4">
        <Sidebar />
        <main className="flex-1">
          <Navbar />
          <Suspense fallback={<div className="flex h-96 items-center justify-center text-slate-400">Loading...</div>}>
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
          </Suspense>
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
