import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useMapStore } from '../../store/mapStore'
import { useDashboardStore } from '../../store/dashboardStore'

export function CountryDrawer() {
  const drawerOpen = useMapStore((state) => state.drawerOpen)
  const selectedCountry = useMapStore((state) => state.selectedCountry)
  const setDrawerOpen = useMapStore((state) => state.setDrawerOpen)
  const countrySummaries = useDashboardStore((state) => state.countrySummaries)
  const country = selectedCountry ?? countrySummaries[0]

  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.aside initial={{ x: 320, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 320, opacity: 0 }} className="fixed right-4 top-24 z-30 w-[320px] rounded-[28px] border border-white/10 bg-slate-950/90 p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
          <button onClick={() => setDrawerOpen(false)} className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-slate-300">
            <X className="h-4 w-4" />
          </button>
          <div className="mb-4">
            <p className="text-sm text-cyan-400">Country Detail</p>
            <h3 className="text-xl font-semibold text-white">{country.flag} {country.country}</h3>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Total Requests: <span className="font-semibold text-white">{country.totalRequests.toLocaleString()}</span></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Blocked Requests: <span className="font-semibold text-white">{country.blockedRequests.toLocaleString()}</span></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Attack Rate: <span className="font-semibold text-white">{country.attackRate}%</span></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Threat Score: <span className="font-semibold text-white">{country.threatScore}/100</span></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Top Attack Type: <span className="font-semibold text-white">{country.topAttackType}</span></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Top Target Endpoint: <span className="font-semibold text-white">{country.topTargetEndpoint}</span></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Top Source Countries: <span className="font-semibold text-white">{country.topSourceCountries.join(', ')}</span></div>
          </div>
          <div className="mt-4 rounded-[24px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 p-4 text-sm text-slate-200">
            <p className="mb-2 font-medium text-white">AI Summary</p>
            <p>{country.aiSummary}</p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
