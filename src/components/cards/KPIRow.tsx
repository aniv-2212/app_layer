import { motion } from 'framer-motion'
import { useDashboardStore } from '../../store/dashboardStore'
import { KPICard } from './KPICard'

export function KPIRow() {
  const kpis = useDashboardStore((state) => state.kpis)
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi, index) => (
        <motion.div key={kpi.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
          <KPICard item={kpi} />
        </motion.div>
      ))}
    </div>
  )
}
