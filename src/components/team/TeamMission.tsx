import { motion } from 'framer-motion'

export function TeamMission() {
  return (
    <section className="relative border-t border-white/5 px-4 py-32 sm:px-6 lg:px-8 lg:py-48">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="mb-10 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
        >
          BUILDING{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            INTELLIGENCE
          </span>
          <br />
          FOR AN EVER-CHANGING
          <br />
          THREAT LANDSCAPE.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="max-w-3xl text-base leading-relaxed text-slate-500 sm:text-lg"
        >
          Team VYOMX is developing CYBER AI as a unified platform for threat intelligence, real-time attack
          visualization, AI-powered security analysis, malicious URL detection, and cybersecurity monitoring.
        </motion.p>
      </div>
    </section>
  )
}
