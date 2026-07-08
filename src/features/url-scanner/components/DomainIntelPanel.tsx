import { Lock, Unlock } from 'lucide-react'
import type { DomainIntelligence } from '../types'

type DomainIntelPanelProps = {
  intel: DomainIntelligence
}

export function DomainIntelPanel({ intel }: DomainIntelPanelProps) {
  const metrics: Array<{ label: string; value: string }> = [
    { label: 'WHOIS Lookup', value: intel.whois_status },
    { label: 'Domain Age', value: intel.age },
    { label: 'Registrar', value: intel.registrar },
    { label: 'Expiration Date', value: intel.expiration_date },
    { label: 'DNS Records', value: `${intel.dns_record_count} Found` },
    { label: 'IP Address', value: intel.ip_address },
  ]

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">
            <p className="text-xs text-slate-400">{metric.label}</p>
            <p className="mt-1 truncate text-sm text-slate-200" title={metric.value}>{metric.value}</p>
          </div>
        ))}
        <div
          className={`rounded-[20px] border px-4 py-3 ${
            intel.ssl_valid
              ? 'border-emerald-400/20 bg-emerald-500/10'
              : 'border-rose-400/20 bg-rose-500/10'
          }`}
        >
          <p className="text-xs text-slate-400">SSL Certificate</p>
          <p className={`mt-1 flex items-center gap-2 text-sm ${intel.ssl_valid ? 'text-emerald-200' : 'text-rose-200'}`}>
            {intel.ssl_valid ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            {intel.ssl_valid ? 'Valid' : 'Invalid / None'}
          </p>
        </div>
      </div>
    </div>
  )
}
