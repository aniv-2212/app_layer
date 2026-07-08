import { Clock } from 'lucide-react'
import type { ScanHistoryEntry, ScanStatusClass } from '../types'

const BADGE_STYLES: Record<ScanStatusClass, string> = {
  safe: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
  warning: 'border-amber-400/20 bg-amber-500/10 text-amber-200',
  danger: 'border-rose-400/20 bg-rose-500/10 text-rose-200',
}

type ScanHistoryListProps = {
  items: ScanHistoryEntry[]
  onSelect: (scanId: string) => void
}

export function ScanHistoryList({ items, onSelect }: ScanHistoryListProps) {
  if (!items.length) {
    return (
      <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-6 text-center text-sm text-slate-400">
        No scans yet this session. Submit a URL to get started.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <button
          key={item.scan_id}
          onClick={() => onSelect(item.scan_id)}
          className="flex w-full items-center justify-between gap-3 rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/10"
        >
          <div className="min-w-0">
            <p className="truncate text-slate-200" title={item.url}>{item.url}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              {new Date(item.scanned_at).toLocaleTimeString()}
            </p>
          </div>
          <span className={`shrink-0 rounded-full border px-3 py-1 text-xs ${BADGE_STYLES[item.status_class] ?? BADGE_STYLES.warning}`}>
            {Math.round(item.risk_percentage)}%
          </span>
        </button>
      ))}
    </div>
  )
}
