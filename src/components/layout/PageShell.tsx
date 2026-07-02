import { motion } from 'framer-motion'
import { Filter, RefreshCw, Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { EmptyState } from '../ui/EmptyState'
import { LoadingSkeleton } from '../LoadingSkeleton'

type PageShellProps = {
  title: string
  subtitle: string
  searchPlaceholder?: string
  actions?: ReactNode
  filters?: ReactNode
  kpiSection?: ReactNode
  children: ReactNode
  loading?: boolean
  empty?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export function PageShell({
  title,
  subtitle,
  searchPlaceholder = 'Search events',
  actions,
  filters,
  kpiSection,
  children,
  loading = false,
  empty = false,
  emptyTitle = 'No data available',
  emptyDescription = 'Mock telemetry is being prepared for this view.',
}: PageShellProps) {
  return (
    <div className="space-y-6">
      <motion.header initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="rounded-[28px] border border-white/10 bg-slate-950/70 px-5 py-5 shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-400">SOC Command Center</p>
            <h1 className="mt-1 text-2xl font-semibold text-white">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-400">
              <Search className="h-4 w-4" />
              <input className="w-36 bg-transparent outline-none" placeholder={searchPlaceholder} />
            </label>
            <button className="rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-300">
              <Filter className="h-4 w-4" />
            </button>
            <button className="rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-300">
              <RefreshCw className="h-4 w-4" />
            </button>
            {actions}
          </div>
        </div>
        {filters ? <div className="mt-4 flex flex-wrap gap-3">{filters}</div> : null}
      </motion.header>

      {kpiSection ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{kpiSection}</div> : null}

      {loading ? (
        <LoadingSkeleton />
      ) : empty ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="space-y-6">{children}</div>
      )}
    </div>
  )
}
