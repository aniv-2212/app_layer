import { motion } from 'framer-motion'
import { ExternalLink, GitBranch, Mail, User } from 'lucide-react'

interface TeamMember {
  name: string
  role: string
  skills: string[]
  color: string
}

const team: TeamMember[] = [
  {
    name: 'Gurwinder',
    role: 'Full Stack Developer',
    skills: ['HTML', 'CSS', 'JavaScript', 'Java', 'Artificial Intelligence'],
    color: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    name: 'Anmol',
    role: 'Security & ML Engineer',
    skills: ['Cloud Security', 'Model Training', 'UI/UX'],
    color: 'from-indigo-500/20 to-fuchsia-500/20',
  },
  {
    name: 'Ankit',
    role: 'Frontend Developer',
    skills: ['HTML', 'CSS', 'JavaScript'],
    color: 'from-emerald-500/20 to-cyan-500/20',
  },
  {
    name: 'Kamna',
    role: 'Team Management & Coordination',
    skills: [],
    color: 'from-amber-500/20 to-rose-500/20',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
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

export function TeamSection() {
  return (
    <section id="team" className="relative px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-indigo-400">
            Team
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            About{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              VYOMX
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            The team behind CyberAI — passionate about cybersecurity, AI, and building tools that protect the digital
            world.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {team.map((member) => (
            <motion.div
              key={member.name}
              variants={cardVariants}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 transition-opacity group-hover:opacity-100`}
              />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-700 ring-2 ring-white/5 transition-all group-hover:ring-cyan-500/30">
                  <User className="h-10 w-10 text-slate-500" />
                </div>

                <h3 className="mb-1 text-lg font-semibold text-white">{member.name}</h3>
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-cyan-400">{member.role}</p>

                {member.skills.length > 0 && (
                  <div className="mb-5 flex flex-wrap justify-center gap-1.5">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/5 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  {['github', 'linkedin', 'mail'].map((social) => {
                    const Icon = social === 'github' ? GitBranch : social === 'linkedin' ? ExternalLink : Mail
                    return (
                      <a
                        key={social}
                        href="#"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 text-slate-500 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
