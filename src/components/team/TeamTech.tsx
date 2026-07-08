import { motion } from 'framer-motion'

const technologies = [
  'REACT',
  'TYPESCRIPT',
  'VITE',
  'TAILWIND CSS',
  'FRAMER MOTION',
  'FASTAPI',
  'PYTHON',
  'MACHINE LEARNING',
  'ARTIFICIAL INTELLIGENCE',
  'SOCKET.IO',
  'CLOUD SECURITY',
  'THREAT INTELLIGENCE APIs',
]

export function TeamTech() {
  return (
    <section className="relative border-t border-white/5 px-4 py-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-16 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          WHAT POWERS
          <br />
          <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            OUR VISION
          </span>
        </motion.h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {technologies.map((tech, i) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: 'easeOut' }}
              className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] px-4 py-5 text-center transition-all hover:border-cyan-500/15 hover:bg-cyan-500/[0.03]"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 transition-colors group-hover:text-cyan-300 sm:text-sm">
                {tech}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
