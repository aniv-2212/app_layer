import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Globe2,
  Activity,
  BarChart3,
  Radar,
  Bot,
  ScanSearch,
  ArrowRight,
} from 'lucide-react'

const previewItems = [
  { icon: Globe2, label: 'Live Threat Map' },
  { icon: Activity, label: 'Attack Telemetry' },
  { icon: BarChart3, label: 'Global Threat Statistics' },
  { icon: Radar, label: 'Threat Intelligence Feeds' },
  { icon: Bot, label: 'AI Security Assistant' },
  { icon: ScanSearch, label: 'URL Security Scanner' },
]

export function DashboardPreview() {
  const navigate = useNavigate()

  return (
    <section id="features" className="relative px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-fuchsia-400">
            Live System
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Your{' '}
            <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Security Operations Center
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            A fully interactive SOC command center with real-time monitoring, threat detection, and analytics.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.06),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.04),transparent_50%)]" />

          <div className="relative z-10 p-8 sm:p-10 lg:p-14">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500">
                <Globe2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">CyberAI</p>
                <h3 className="text-xl font-semibold text-white">SOC Command Center</h3>
              </div>
            </div>

            <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {previewItems.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition-colors hover:border-cyan-500/15"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
                      <Icon className="h-4 w-4 text-cyan-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">{item.label}</span>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 hover:brightness-110"
              >
                Launch Dashboard
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
