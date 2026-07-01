import { motion } from 'framer-motion'
import { useDashboardStore } from '../../store/dashboardStore'

export function LiveEvents() {
  const eventFeed = useDashboardStore((state) => state.eventFeed)
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Live Events</h3>
        <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">Auto-Scroll</div>
      </div>
      <div className="space-y-3">
        {eventFeed.map((event, index) => (
          <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-white">{event.attackType} {event.status}</p>
              <span className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-400">
              <span>{event.sourceCountry}</span>
              <span>{event.endpoint}</span>
              <span>{event.severity}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
