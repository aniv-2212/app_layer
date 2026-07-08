import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export function TeamCTA() {
  const navigate = useNavigate()

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="mb-10 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
        >
          TOGETHER,
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            WE BUILT SOMETHING
          </span>
          <br />
          BEYOND A DASHBOARD.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center gap-5 sm:flex-row"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:brightness-110 sm:text-lg"
          >
            EXPLORE CYBER AI
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-slate-300 shadow-lg backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:bg-white/10 hover:text-white sm:text-lg"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            BACK TO HOME
          </button>
        </motion.div>
      </div>
    </section>
  )
}
