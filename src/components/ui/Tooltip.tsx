import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type TooltipProps = {
  label: string
  children: ReactNode
}

export function Tooltip({ label, children }: TooltipProps) {
  return (
    <div className="group relative inline-flex">
      {children}
      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-slate-900/95 px-3 py-1 text-xs text-slate-200 shadow-lg group-hover:block">
        {label}
      </motion.div>
    </div>
  )
}
