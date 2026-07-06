import { useState } from 'react'
import { Search } from 'lucide-react'
import { api } from '../../services/api'

export function UrlScanner() {
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<{ type: 'safe' | 'malicious', message: string } | null>(null)

  const handleScan = async () => {
    if (!url) return
    setScanning(true)
    setResult(null)

    try {
      const report = await api.phishtankCheck(url)
      if (report.in_database && report.valid) {
        setResult({
          type: 'malicious',
          message: `Known phishing URL (PhishTank #${report.phish_id ?? 'n/a'}${report.verified ? ', verified' : ''}).`,
        })
      } else if (report.in_database) {
        setResult({ type: 'safe', message: 'URL is in PhishTank but not flagged as a valid phish.' })
      } else {
        setResult({ type: 'safe', message: 'URL not found in the PhishTank phishing database.' })
      }
    } catch (error) {
      setResult({ type: 'malicious', message: `Scan failed: ${error instanceof Error ? error.message : 'backend unreachable'}` })
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
          disabled={scanning || !url}
          className="w-full sm:w-auto whitespace-nowrap rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-6 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50"
        >
          {scanning ? 'Scanning...' : 'Scan Now'}
        </button>
      </div>
      
      {result && (
        <div className={`rounded-[20px] border px-4 py-3 text-sm ${
          result.type === 'safe' 
            ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200' 
            : 'border-rose-400/20 bg-rose-500/10 text-rose-200'
        }`}>
          {result.message}
        </div>
      )}
    </div>
  )
}
