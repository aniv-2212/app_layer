import { motion } from 'framer-motion'
import { AlertTriangle, ShieldCheck } from 'lucide-react'

type AlertCardProps = {
  title: string
  detail: string
  time: string
  severity?: 'Critical' | 'High' | 'Medium' | 'Low'
}

const severityStyles = {
  Critical: 'text-rose-300',
  High: 'text-orange-300',
  Medium: 'text-amber-300',
  Low: 'text-emerald-300',
}

export function AlertCard({ title, detail, time, severity = 'High' }: AlertCardProps) {
  return (
    <motion.div whileHover={{ y: -2, scale: 1.01 }} className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4 shadow-lg shadow-cyan-950/20 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-2">
            {severity === 'Critical' ? <AlertTriangle className="h-5 w-5 text-rose-300" /> : <ShieldCheck className="h-5 w-5 text-cyan-300" />}
          </div>
          <div>
            <p className="font-medium text-white">{title}</p>
            <p className="mt-1 text-sm text-slate-400">{detail}</p>
          </div>
        </div>
        <span className={`text-sm ${severityStyles[severity]}`}>{time}</span>
      </div>
    </motion.div>
  )
}
