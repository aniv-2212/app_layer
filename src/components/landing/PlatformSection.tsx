import { motion } from 'framer-motion'
import {
  Shield,
  Brain,
  Globe2,
  BarChart3,
  ScanSearch,
  Zap,
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Real-Time Threat Intelligence',
    desc: 'Aggregate and analyze threat data from global feeds, providing instant visibility into emerging cyber threats.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Threat Analysis',
    desc: 'Leverage machine learning models to detect anomalies, classify attacks, and predict threat patterns.',
  },
  {
    icon: Globe2,
    title: 'Global Cyber Attack Visualization',
    desc: 'Live interactive map displaying real-time cyber attacks, geographic threat distribution, and attack vectors.',
  },
  {
    icon: BarChart3,
    title: 'Security Analytics Dashboard',
    desc: 'Comprehensive metrics, charts, and telemetry data for monitoring your security posture at a glance.',
  },
  {
    icon: ScanSearch,
    title: 'Malicious URL Detection',
    desc: 'AI-driven URL scanner that analyzes websites for phishing, malware, and other malicious indicators.',
  },
  {
    icon: Zap,
    title: 'Threat Intelligence APIs',
    desc: 'Extensible API layer integrating VirusTotal, Shodan, AbuseIPDB, and other threat intelligence sources.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export function PlatformSection() {
  return (
    <section id="platform" className="relative px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
            Platform
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Built for{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Modern Security
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            A comprehensive suite of tools designed to give security teams complete visibility and control.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20">
                    <Icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{feature.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
