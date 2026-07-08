import { useEffect, useState } from 'react'
import { ShieldCheck, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'

export function TeamNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isLanding = location.pathname === '/team'

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/5 bg-slate-950/80 shadow-lg shadow-cyan-950/10 backdrop-blur-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); navigate('/') }}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-fuchsia-500 shadow-lg shadow-cyan-500/25">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            CYBER <span className="text-cyan-400">AI</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate('/') }}
            className="text-sm font-medium text-slate-400 transition-colors hover:text-cyan-300"
          >
            Home
          </a>
          <a
            href="/team"
            onClick={(e) => { e.preventDefault(); navigate('/team') }}
            className={`text-sm font-medium transition-colors ${
              isLanding ? 'text-cyan-300' : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            Team
          </a>
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 hover:brightness-110"
          >
            Open Dashboard
          </button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="relative z-50 rounded-lg border border-white/10 bg-slate-900/80 p-2 text-slate-300 md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 bg-slate-950/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-2 px-4 py-5">
              <button
                onClick={() => { setMobileOpen(false); navigate('/') }}
                className="rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-cyan-300"
              >
                Home
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate('/team') }}
                className="rounded-lg px-4 py-3 text-left text-sm font-medium text-cyan-300 transition-colors hover:bg-white/5"
              >
                Team
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate('/dashboard') }}
                className="mt-3 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg"
              >
                Open Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
