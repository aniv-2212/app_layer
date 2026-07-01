import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDashboardStore } from '../../store/dashboardStore'
import { useMapStore } from '../../store/mapStore'
import type { AttackEvent, CountrySummary } from '../../types'
import { seedCountrySummaries } from '../../mock/data'

export function ApplicationAttackMap() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const eventFeed = useDashboardStore((state) => state.eventFeed)
  const setDrawerOpen = useMapStore((state) => state.setDrawerOpen)
  const setSelectedCountry = useMapStore((state) => state.setSelectedCountry)
  const setHoveredAttack = useMapStore((state) => state.setHoveredAttack)

  const summaries = useMemo(() => seedCountrySummaries, [])
  const attackEvents = useMemo(() => eventFeed.slice(0, 5), [eventFeed])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 500
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#020617'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = 'rgba(34,211,238,0.18)'
    ctx.lineWidth = 1
    for (let x = 0; x < canvas.width; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
    }
    ctx.beginPath()
    ctx.arc(600, 220, 120, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(192,132,252,0.12)'
    ctx.stroke()
    ctx.fillStyle = 'rgba(34,211,238,0.08)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    el.innerHTML = ''
    el.appendChild(canvas)
  }, [])

  const handleOpenDrawer = (country: CountrySummary) => {
    setSelectedCountry(country)
    setDrawerOpen(true)
  }

  const handleHover = (event: AttackEvent) => {
    setHoveredAttack(event)
  }

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm text-cyan-400">Live Interactive Attack Map</p>
          <h2 className="text-xl font-semibold text-white">Geo-Distributed Threat Surface</h2>
        </div>
        <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">Realtime</div>
      </div>
      <div ref={containerRef} className="relative min-h-[440px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_40%)]" />
      <div className="pointer-events-none absolute inset-x-4 top-20 flex justify-center">
        <div className="rounded-full border border-cyan-400/20 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 backdrop-blur">Heatmap • Curved Arcs • Country Highlight</div>
      </div>
      <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3">
        {attackEvents.map((event) => (
          <motion.button key={event.id} whileHover={{ y: -2, scale: 1.01 }} onMouseEnter={() => handleHover(event)} onClick={() => handleOpenDrawer(summaries[0])} className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-left text-sm text-slate-300 backdrop-blur">
            <div className="font-medium text-white">{event.attackType}</div>
            <div className="text-xs text-slate-500">{event.sourceCountry} → {event.destinationCountry}</div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
