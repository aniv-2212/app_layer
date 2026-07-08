import { useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { urlScannerApi, UrlScannerApiError } from '../../features/url-scanner/services/urlScannerApi'
import type { ScanStatusClass } from '../../features/url-scanner/types'

const RESULT_STYLES: Record<ScanStatusClass, string> = {
  safe: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
  warning: 'border-amber-400/20 bg-amber-500/10 text-amber-200',
  danger: 'border-rose-400/20 bg-rose-500/10 text-rose-200',
}

export function UrlScanner() {
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<{ statusClass: ScanStatusClass; message: string } | null>(null)

  const handleScan = async () => {
    if (!url.trim()) return
    setScanning(true)
    setResult(null)

    try {
      const scan = await urlScannerApi.scan(url.trim(), false)
      setResult({
        statusClass: scan.status_class,
        message: `${scan.verdict} — risk score ${Math.round(scan.risk_percentage)}%${scan.model_used ? ' (ML model)' : ''}.`,
      })
    } catch (error) {
      setResult({
        statusClass: 'danger',
        message: error instanceof UrlScannerApiError ? error.message : 'Scan failed: backend unreachable.',
      })
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="space-y-4 text-slate-300">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-full border border-white/10 bg-slate-900/70 py-2 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
          />
        </div>
        <button
          onClick={handleScan}
          disabled={scanning || !url.trim()}
          className="w-full sm:w-auto whitespace-nowrap rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-6 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50"
        >
          {scanning ? 'Scanning...' : 'Scan Now'}
        </button>
      </div>

      {result && (
        <div className={`rounded-[20px] border px-4 py-3 text-sm ${RESULT_STYLES[result.statusClass]}`}>
          {result.message}
        </div>
      )}

      <Link to="/url-scanner" className="inline-flex items-center gap-1.5 text-sm text-cyan-300 hover:text-cyan-200">
        Open full URL Scanner — features & domain intelligence
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
