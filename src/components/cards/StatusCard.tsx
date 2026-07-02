import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

type StatusCardProps = {
  title: string
  value: string
  detail: string
  icon: LucideIcon
  accent: string
}

export function StatusCard({ title, value, detail, icon: Icon, accent }: StatusCardProps) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4 shadow-lg shadow-cyan-950/20 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
        </div>
        <div className={`rounded-2xl bg-gradient-to-br ${accent} p-2`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500">{detail}</p>
    </motion.div>
  )
}
