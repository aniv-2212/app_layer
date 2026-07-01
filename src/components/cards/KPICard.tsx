import { motion } from 'framer-motion'
import { Activity, Brain, Bug, Globe2, Map, Radar, ShieldAlert, Users } from 'lucide-react'
import type { DashboardKpi } from '../../types'

const iconMap = {
  Globe2,
  ShieldAlert,
  Activity,
  Users,
  Radar,
  Bug,
  Map,
  Brain,
}

export function KPICard({ item }: { item: DashboardKpi }) {
  const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Globe2
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="group rounded-[24px] border border-white/10 bg-slate-950/70 p-4 shadow-lg shadow-cyan-950/20 backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{item.title}</p>
          <p className="mt-1 text-2xl font-semibold text-white">{item.value}</p>
        </div>
        <div className={`rounded-2xl bg-gradient-to-br ${item.accent} p-2`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-emerald-400">{item.change}</span>
        <span className="text-slate-500">vs last period</span>
      </div>
      <div className="flex h-8 items-end gap-1">
        {item.sparkline.map((point, index) => (
          <div key={index} className="flex-1 rounded-full bg-gradient-to-t from-cyan-500/40 to-fuchsia-500/80" style={{ height: `${20 + point / 2}%` }} />
        ))}
      </div>
    </motion.div>
  )
}
