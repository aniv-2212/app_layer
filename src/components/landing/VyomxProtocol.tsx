import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const principles = [
  {
    id: 1,
    title: 'QUESTION',
    tagline: 'Challenge what already exists.',
    desc: 'We challenge conventional approaches and explore better ways to understand the constantly evolving cyber threat landscape.',
  },
  {
    id: 2,
    title: 'BUILD',
    tagline: 'Turn intelligence into systems.',
    desc: 'We transform ideas into intelligent systems by combining development, artificial intelligence, and cybersecurity technologies.',
  },
  {
    id: 3,
    title: 'BREAK',
    tagline: 'Discover weakness before threats do.',
    desc: 'We test assumptions, identify weaknesses, and push our systems beyond expected conditions to improve reliability.',
  },
  {
    id: 4,
    title: 'EVOLVE',
    tagline: 'Intelligence never stops learning.',
    desc: 'We learn from data, experimentation, and failure — continuously improving the intelligence behind CYBER AI.',
  },
]

function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const points: { x: number; y: number; vx: number; vy: number; label: string }[] = []
    const CENTER = { x: 0, y: 0 }
    const RADIUS = 100
    const labels = ['DEV', 'ML', 'UI', 'QA']

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      CENTER.x = canvas.width / 2
      CENTER.y = canvas.height / 2
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 - Math.PI / 2
        points[i] = {
          x: CENTER.x + Math.cos(angle) * RADIUS * 1.5,
          y: CENTER.y + Math.sin(angle) * RADIUS * 1.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          label: labels[i],
        }
      }
    }
    resize()
    window.addEventListener('resize', resize)

    let pulse = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pulse += 0.005

      for (const p of points) {
        const dx = CENTER.x - p.x
        const dy = CENTER.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const targetDist = RADIUS * 1.5 + Math.sin(pulse + p.label.charCodeAt(0)) * 20

        if (dist > targetDist + 1) {
          p.vx += (dx / dist) * 0.01
          p.vy += (dy / dist) * 0.01
        }
        p.vx += (Math.random() - 0.5) * 0.05
        p.vy += (Math.random() - 0.5) * 0.05
        p.vx *= 0.97
        p.vy *= 0.97
        p.x += p.vx
        p.y += p.vy
      }

      for (const p of points) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(34, 211, 238, 0.4)'
        ctx.fill()
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          ctx.beginPath()
          ctx.moveTo(points[i].x, points[i].y)
          ctx.lineTo(points[j].x, points[j].y)
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.06 + Math.sin(pulse + i + j) * 0.03})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      for (const p of points) {
        ctx.beginPath()
        ctx.moveTo(CENTER.x, CENTER.y)
        ctx.lineTo(p.x, p.y)
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.04 + Math.sin(pulse + p.label.charCodeAt(0)) * 0.02})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      ctx.beginPath()
      for (let i = 0; i <= 10; i++) {
        const angle = (i / 10) * Math.PI * 2
        const r = RADIUS * 0.3 + Math.sin(pulse * 2 + i) * 8
        const x = CENTER.x + Math.cos(angle) * r
        const y = CENTER.y + Math.sin(angle) * r
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = `rgba(34, 211, 238, ${0.15 + Math.sin(pulse) * 0.05})`
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(CENTER.x, CENTER.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(34, 211, 238, 0.6)'
      ctx.fill()

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
    />
  )
}

function PrincipleRow({ principle, index }: { principle: typeof principles[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative cursor-pointer py-6 sm:py-8">
        <div className="flex items-start gap-6 sm:gap-12">
          <motion.span
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ duration: 0.3 }}
            className="hidden w-12 shrink-0 text-sm font-semibold tracking-wider text-slate-500 sm:block"
          >
            {String(principle.id).padStart(2, '0')}
          </motion.span>

          <span className="block w-12 shrink-0 text-sm font-semibold tracking-wider text-slate-500 sm:hidden">
            {String(principle.id).padStart(2, '0')}
          </span>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <motion.span
                animate={{ x: hovered ? 6 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold tracking-tight text-white transition-colors sm:text-3xl md:text-4xl"
              >
                {principle.title}
              </motion.span>
              <motion.span
                animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
                className="hidden text-sm text-cyan-400 sm:block"
              >
                {principle.tagline} →
              </motion.span>
            </div>

            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: hovered ? 'auto' : 0,
                opacity: hovered ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden text-sm leading-relaxed text-slate-500 sm:hidden"
            >
              <span className="block pt-2">{principle.tagline}</span>
            </motion.p>

            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: hovered ? 'auto' : 0,
                opacity: hovered ? 1 : 0,
              }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden text-xs leading-relaxed text-slate-500 sm:text-sm"
            >
              <span className="block pt-3">{principle.desc}</span>
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="mt-6 h-[1px] origin-left bg-gradient-to-r from-cyan-500/40 to-transparent"
        />

        {!hovered && (
          <div className="mt-6 h-[1px] bg-white/5" />
        )}
      </div>
    </motion.div>
  )
}

export function VyomxProtocol() {
  const navigate = useNavigate()

  return (
    <section id="vyomx" className="relative border-t border-white/5">
      <div className="px-4 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <span className="inline-block text-xs font-medium uppercase tracking-[0.35em] text-cyan-500/70">
              BEHIND THE SYSTEM / 04
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="mb-8 max-w-5xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            WE DON'T JUST{' '}
            <span className="text-cyan-400">OBSERVE</span>{' '}
            THREATS.
            <br />
            WE TEACH SYSTEMS TO{' '}
            <span className="text-cyan-400">UNDERSTAND</span>{' '}
            THEM.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
            className="max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base"
          >
            VYOMX is the collective intelligence behind CYBER AI — a team driven by the idea that cybersecurity
            should move beyond passive monitoring.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
            className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base"
          >
            We combine artificial intelligence, intelligent engineering, real-time threat intelligence, and
            human-centered design to transform complex security signals into meaningful action.
          </motion.p>
        </div>
      </div>

      <div className="mt-24 border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-16 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <span className="inline-block text-xs font-medium uppercase tracking-[0.35em] text-cyan-500/70">
                  THE VYOMX PROTOCOL
                </span>
              </motion.div>

              <div className="space-y-2">
                {principles.map((p, i) => (
                  <PrincipleRow key={p.id} principle={p} index={i} />
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, delay: 0.4 }}
              className="hidden h-[500px] lg:col-span-2 lg:block"
            >
              <div className="sticky top-32 h-[400px] w-full">
                <NetworkCanvas />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 px-4 py-28 sm:px-6 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-7xl">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-6 text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
          >
            <span>DIFFERENT DISCIPLINES.</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              ONE SHARED INTELLIGENCE.
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
          >
            ONE SYSTEM BUILT
            <br />
            <span className="text-cyan-400">TO SEE WHAT OTHERS MISS.</span>
          </motion.p>
        </div>
      </div>

      <div className="border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-slate-600"
          >
            THE PEOPLE BEHIND THE INTELLIGENCE
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            onClick={() => navigate('/team')}
            className="group inline-flex items-center gap-3 text-2xl font-bold tracking-tight text-white transition-all hover:text-cyan-300 sm:text-3xl md:text-4xl"
          >
            MEET VYOMX
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight className="h-6 w-6 sm:h-8 sm:w-8" />
            </motion.span>
          </motion.button>
        </div>
      </div>
    </section>
  )
}
