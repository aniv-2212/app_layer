import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Member {
  id: number
  name: string
  fullName: string
  role: string
  description: string
  responsibilities: string[]
  initials: string
  imagePath: string
  gradient: string
  roleLines: string[]
  displayName: string[]
}

const members: Member[] = [
  {
    id: 1,
    name: 'ANMOL VERMA',
    fullName: 'Anmol Verma',
    role: 'FULL STACK DEVELOPER',
    description: 'Building and integrating the complete CYBER AI ecosystem, from interactive frontend experiences to backend services, APIs, and real-time threat intelligence systems.',
    responsibilities: [
      'Full-stack application development',
      'Frontend and backend integration',
      'CYBER AI dashboard development',
      'FastAPI backend integration',
      'REST API integration',
      'Socket.IO and real-time telemetry integration',
      'UI/UX implementation',
      'System architecture and project integration',
    ],
    initials: 'AV',
    imagePath: '/team/anmol-verma.jpg',
    gradient: 'from-cyan-500/15 via-blue-500/10 to-transparent',
    roleLines: ['FULL STACK', 'DEVELOPER'],
    displayName: ['ANMOL', 'VERMA'],
  },
  {
    id: 2,
    name: 'JASLEEN KAUR',
    fullName: 'Jasleen Kaur',
    role: 'MACHINE LEARNING & MODEL TRAINING',
    description: 'Developing, training, and evaluating intelligent machine learning models that power the AI-driven capabilities of the CYBER AI platform.',
    responsibilities: [
      'Machine learning model development',
      'Dataset preparation',
      'Data preprocessing',
      'Model training',
      'Model evaluation',
      'Performance analysis',
      'AI model integration',
    ],
    initials: 'JK',
    imagePath: '/team/jasleen-kaur.jpg',
    gradient: 'from-indigo-500/15 via-fuchsia-500/10 to-transparent',
    roleLines: ['MACHINE LEARNING', '& MODEL TRAINING'],
    displayName: ['JASLEEN', 'KAUR'],
  },
  {
    id: 3,
    name: 'LOKANKSHI GUPTA',
    fullName: 'Lokankshi Gupta',
    role: 'FRONTEND DEVELOPER',
    description: 'Creating responsive, interactive, and visually engaging user interfaces that make complex cybersecurity intelligence accessible and intuitive.',
    responsibilities: [
      'Frontend development',
      'User interface implementation',
      'Responsive design',
      'Interactive components',
      'Dashboard interface development',
      'Visual consistency',
      'Frontend optimization',
    ],
    initials: 'LG',
    imagePath: '/team/lokankshi-gupta.jpg',
    gradient: 'from-emerald-500/15 via-cyan-500/10 to-transparent',
    roleLines: ['FRONTEND', 'DEVELOPER'],
    displayName: ['LOKANKSHI', 'GUPTA'],
  },
  {
    id: 4,
    name: 'KARUN BEHL',
    fullName: 'Karun Behl',
    role: 'TESTING & TRAINING',
    description: 'Testing, validating, and evaluating CYBER AI to improve platform reliability, functionality, usability, and overall system quality.',
    responsibilities: [
      'Application testing',
      'Feature validation',
      'System testing',
      'Bug identification',
      'Quality assurance',
      'Project training support',
      'Platform evaluation',
    ],
    initials: 'KB',
    imagePath: '/team/karun-behl.jpg',
    gradient: 'from-amber-500/15 via-rose-500/10 to-transparent',
    roleLines: ['TESTING &', 'TRAINING'],
    displayName: ['KARUN', 'BEHL'],
  },
]

function TeamImage({ member, hovered }: { member: Member; hovered: boolean }) {
  const [imgError, setImgError] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = imgRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      setMousePos({ x, y })
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={imgRef}
      className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-900/80 sm:aspect-[4/5] lg:aspect-[3/4] xl:aspect-[4/5]"
      style={{
        transform: `perspective(1000px) rotateY(${mousePos.x * 3}deg) rotateX(${-mousePos.y * 3}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
    >
      {!imgError ? (
        <img
          src={member.imagePath}
          alt={member.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className={`h-full w-full object-cover transition-all duration-700 ${
            hovered ? 'scale-105' : 'scale-100'
          }`}
          style={{
            filter: hovered ? 'grayscale(0%) brightness(105%)' : 'grayscale(100%) brightness(80%)',
          }}
        />
      ) : null}

      {!imgError && (
        <div
          className={`absolute inset-0 bg-gradient-to-t ${member.gradient} transition-opacity duration-700 ${
            hovered ? 'opacity-20' : 'opacity-60'
          }`}
        />
      )}

      {imgError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-bold tracking-tight text-white/10 sm:text-7xl md:text-8xl">
            {member.initials}
          </span>
        </div>
      )}

      <div
        className={`absolute inset-0 rounded-2xl ring-1 transition-all duration-700 ${
          hovered ? 'ring-cyan-500/30 shadow-[inset_0_0_60px_rgba(34,211,238,0.1)]' : 'ring-white/5'
        }`}
      />
    </div>
  )
}

export function TeamMembers() {
  return (
    <section className="relative">
      {members.map((member, index) => (
        <MemberSection key={member.id} member={member} index={index} />
      ))}
    </section>
  )
}

function MemberSection({ member, index }: { member: Member; index: number }) {
  const [hovered, setHovered] = useState(false)
  const isImageLeft = index % 2 === 1

  return (
    <div
      id={`member-${member.id}`}
      className="group relative min-h-screen border-b border-white/5 px-4 py-24 last:border-b-0 sm:px-6 lg:px-8 lg:py-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${member.gradient} opacity-0 transition-opacity duration-700 group-hover:opacity-100`}
      />

      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 select-none text-[18vw] font-extrabold leading-none tracking-tighter text-white/[0.02] sm:left-8 md:text-[16vw] lg:left-12 xl:text-[14vw]">
        {String(member.id).padStart(2, '0')}
      </span>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <motion.div
            initial={{ opacity: 0, x: isImageLeft ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={`order-1 ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <div
                className={`absolute -inset-4 rounded-3xl bg-gradient-to-br ${member.gradient} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100`}
              />
              <div className="relative">
                <TeamImage member={member} hovered={hovered} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`order-2 ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}
          >
            {member.displayName.map((line, i) => (
              <motion.h3
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                className={`text-5xl font-extrabold leading-[1.05] tracking-tight text-white transition-transform duration-700 sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl ${
                  hovered ? (isImageLeft ? '-translate-x-2' : 'translate-x-2') : 'translate-x-0'
                }`}
              >
                {line}
              </motion.h3>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="mb-6 mt-4 space-y-0.5"
            >
              {member.roleLines.map((line, i) => (
                <p
                  key={i}
                  className={`text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 transition-all duration-500 sm:text-sm`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {line}
                </p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="mb-5 h-[1px] origin-left bg-gradient-to-r from-cyan-500/40 to-transparent"
            />

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
              className="mb-5 text-sm leading-relaxed text-slate-400 sm:text-base"
            >
              {member.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              className="mb-5 h-[1px] origin-left bg-gradient-to-r from-indigo-500/20 to-transparent"
            />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
              className={`space-y-2 transition-all duration-500 ${
                hovered ? 'opacity-100' : 'opacity-50'
              }`}
            >
              {member.responsibilities.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.05, ease: 'easeOut' }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cyan-500/60" />
                  <span className="text-xs leading-relaxed text-slate-500 sm:text-sm">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
