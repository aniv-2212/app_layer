import { motion } from 'framer-motion'
import type { ScanStatusClass } from '../types'

const STATUS_STYLES: Record<ScanStatusClass, { stroke: string; text: string; badge: string }> = {
  safe: {
    stroke: '#34d399',
    text: 'text-emerald-300',
    badge: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
  },
  warning: {
    stroke: '#fbbf24',
    text: 'text-amber-300',
    badge: 'border-amber-400/20 bg-amber-500/10 text-amber-200',
  },
  danger: {
    stroke: '#fb7185',
    text: 'text-rose-300',
    badge: 'border-rose-400/20 bg-rose-500/10 text-rose-200',
  },
}

type RiskGaugeProps = {
  risk: number
  verdict: string
  statusClass: ScanStatusClass
}

export function RiskGauge({ risk, verdict, statusClass }: RiskGaugeProps) {
  const styles = STATUS_STYLES[statusClass] ?? STATUS_STYLES.warning
  const radius = 84
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(Math.max(risk, 0), 100) / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-52 w-52">
        <svg width="208" height="208" className="-rotate-90">
          <circle cx="104" cy="104" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
          <motion.circle
            cx="104"
            cy="104"
            r={radius}
            fill="none"
            stroke={styles.stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 10px ${styles.stroke})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-semibold ${styles.text}`}>{Math.round(risk)}%</span>
          <span className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-400">Risk Score</span>
        </div>
      </div>
      <span className={`rounded-full border px-4 py-1.5 text-sm ${styles.badge}`}>{verdict}</span>
    </div>
  )
}
