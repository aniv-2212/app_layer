import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function HeroSection() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLDivElement>(null)

  const scrollToTeam = () => {
    const el = document.getElementById('team')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8"
    >
      <RadarScan />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-4"
        >
          <span className="inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
            Next-Gen Security Platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
        >
          CYBER{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="mx-auto mb-4 max-w-3xl text-lg font-medium text-slate-300 sm:text-xl md:text-2xl"
        >
          AI-Powered Cyber Threat Intelligence & Real-Time Security Analytics
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: 'easeOut' }}
          className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base"
        >
          Monitor global cyber threats, analyze malicious activity, detect emerging attack patterns, and visualize
          real-time security intelligence through an AI-powered cybersecurity platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:brightness-110 sm:text-lg"
          >
            Launch Cyber AI Dashboard
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={scrollToTeam}
            className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-slate-300 shadow-lg backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:bg-white/10 hover:text-white sm:text-lg"
          >
            Meet Our Team
            <ChevronDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
          </button>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  )
}

function RadarScan() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let angle = 0
    let animId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const maxR = Math.min(canvas.width, canvas.height) * 0.45

      for (let r = maxR * 0.2; r <= maxR; r += maxR * 0.2) {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(34,211,238,${0.08 * (1 - r / maxR)})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, maxR, -0.3, 0.3)
      ctx.closePath()
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR)
      grad.addColorStop(0, 'rgba(34,211,238,0.12)')
      grad.addColorStop(1, 'rgba(34,211,238,0)')
      ctx.fillStyle = grad
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(maxR, 0)
      ctx.strokeStyle = 'rgba(34,211,238,0.3)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.restore()

      angle += 0.003
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0" />
}

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-slate-600">Scroll</span>
        <div className="h-8 w-[1px] bg-gradient-to-b from-cyan-500/50 to-transparent" />
      </motion.div>
    </motion.div>
  )
}
