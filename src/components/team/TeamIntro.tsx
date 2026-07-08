import { motion } from 'framer-motion'

export function TeamIntro() {
  return (
    <section className="relative border-t border-white/5 px-4 py-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          FOUR MINDS.
          <br />
          <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            ONE VISION.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="max-w-3xl text-base leading-relaxed text-slate-500 sm:text-lg"
        >
          CYBER AI is built by a multidisciplinary team combining full-stack development, machine learning, frontend
          engineering, testing, and training. Together, we are developing an intelligent cybersecurity platform
          designed to transform complex threat intelligence into accessible, real-time security insights.
        </motion.p>
      </div>
    </section>
  )
}
