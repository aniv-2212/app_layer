import { ShieldCheck } from 'lucide-react'

export function LandingFooter() {
  const scrollToSection = (id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <footer className="relative border-t border-white/5 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-fuchsia-500">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                CYBER <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              AI-Powered Cyber Threat Intelligence Platform
            </p>
            <p className="mt-2 text-sm text-slate-600">Team VYOMX</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', id: 'home' },
                { label: 'Platform', id: 'platform' },
                { label: 'Dashboard', id: '' },
                { label: 'About Team', id: 'team' },
              ].map((link) => (
                <li key={link.label}>
                  {link.id ? (
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToSection(link.id)
                      }}
                      className="text-sm text-slate-500 transition-colors hover:text-cyan-400"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      href="/dashboard"
                      className="text-sm text-slate-500 transition-colors hover:text-cyan-400"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">Tech Stack</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>React + TypeScript</li>
              <li>Tailwind CSS v4</li>
              <li>Framer Motion</li>
              <li>FastAPI + Python</li>
              <li>AI & Machine Learning</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-xs text-slate-600">
            Built with AI, Cybersecurity, and Real-Time Threat Intelligence.
          </p>
        </div>
      </div>
    </footer>
  )
}
