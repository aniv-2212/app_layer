import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Cpu, Link2, Loader2, ScanSearch, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageShell } from '../components/layout/PageShell'
import { ChartCard } from '../components/cards/ChartCard'
import { RiskGauge } from '../features/url-scanner/components/RiskGauge'
import { DomainIntelPanel } from '../features/url-scanner/components/DomainIntelPanel'
import { FeatureGrid } from '../features/url-scanner/components/FeatureGrid'
import { ScanHistoryList } from '../features/url-scanner/components/ScanHistoryList'
import { urlScannerApi, UrlScannerApiError } from '../features/url-scanner/services/urlScannerApi'
import type { ScanHistoryEntry, ScannerHealth, ScanResult } from '../features/url-scanner/types'

export function UrlScannerPage() {
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [history, setHistory] = useState<ScanHistoryEntry[]>([])
  const [health, setHealth] = useState<ScannerHealth | null>(null)

  const refreshHistory = useCallback(async () => {
    try {
      const response = await urlScannerApi.history(20)
      setHistory(response.items)
    } catch {
      // history is non-critical — ignore fetch failures silently
    }
  }, [])

  useEffect(() => {
    void refreshHistory()
    urlScannerApi.health().then(setHealth).catch(() => setHealth(null))
  }, [refreshHistory])

  const handleScan = async () => {
    const trimmed = url.trim()
    if (!trimmed) {
      setError('Please enter a URL to scan.')
      return
    }

    setScanning(true)
    setError(null)

    try {
      const scan = await urlScannerApi.scan(trimmed)
      setResult(scan)
      toast.success(`Scan complete — ${scan.verdict}`)
      void refreshHistory()
    } catch (err) {
      const message =
        err instanceof UrlScannerApiError
          ? err.message
          : 'Unexpected error while scanning. Please try again.'
      setError(message)
      toast.error(message)
    } finally {
      setScanning(false)
    }
  }

  const handleSelectHistory = async (scanId: string) => {
    try {
      const scan = await urlScannerApi.result(scanId)
      setResult(scan)
      setUrl(scan.url)
    } catch (err) {
      toast.error(err instanceof UrlScannerApiError ? err.message : 'Could not load scan result.')
    }
  }

  return (
    <PageShell
      title="URL Scanner"
      subtitle="Deep-inspection engine for suspicious links — ML risk scoring across 33 lexical features plus live WHOIS, DNS, and SSL domain intelligence."
      searchPlaceholder="Search scans"
      filters={
        <>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
            <Cpu className="mr-1.5 inline h-3.5 w-3.5" />
            {health?.model_loaded ? 'XGBoost model active' : 'Heuristic engine'}
          </span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">
            {health ? `${health.scans_performed} scans this session` : 'Scanner status unknown'}
          </span>
        </>
      }
    >
      <ChartCard title="Analyze a URL" subtitle="Only http:// and https:// targets — internal hosts and private ranges are blocked">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full flex-1">
            <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !scanning && handleScan()}
              placeholder="https://example.com/path"
              disabled={scanning}
              className="w-full rounded-full border border-white/10 bg-slate-900/70 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 disabled:opacity-60"
            />
          </div>
          <button
            onClick={handleScan}
            disabled={scanning || !url.trim()}
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-6 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-50 sm:w-auto"
          >
            {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}
            {scanning ? 'Scanning…' : 'Scan Now'}
          </button>
        </div>
        {error ? (
          <div className="mt-4 flex items-center gap-2 rounded-[20px] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        ) : null}
      </ChartCard>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <ChartCard title="Analysis Verdict" subtitle={result.url}>
              <div className="flex flex-col items-center gap-2 py-2">
                <RiskGauge risk={result.risk_percentage} verdict={result.verdict} statusClass={result.status_class} />
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Scored by {result.model_used ? 'XGBoost ML model' : 'heuristic rules (model unavailable)'} · {new Date(result.scanned_at).toLocaleString()}
                </p>
              </div>
            </ChartCard>
            {result.domain_intelligence ? (
              <ChartCard title="Domain Intelligence" subtitle="Live WHOIS, DNS, and TLS checks">
                <DomainIntelPanel intel={result.domain_intelligence} />
              </ChartCard>
            ) : null}
          </div>
          <ChartCard title="Extracted Features" subtitle="The 33-feature lexical vector fed to the model">
            <FeatureGrid features={result.extracted_features} />
          </ChartCard>
        </motion.div>
      ) : null}

      <ChartCard title="Recent Scans" subtitle="This session's scan history">
        <ScanHistoryList items={history} onSelect={handleSelectHistory} />
      </ChartCard>
    </PageShell>
  )
}
