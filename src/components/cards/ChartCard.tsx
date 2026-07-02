import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type ChartCardProps = {
  title: string
  subtitle?: string
  children: ReactNode
  action?: ReactNode
}

export function ChartCard({ title, subtitle, children, action }: ChartCardProps) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  )
}
