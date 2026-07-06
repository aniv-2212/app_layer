import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, Settings, UserCircle2, Users, type LucideIcon } from 'lucide-react'
import { useState } from 'react'

export function UserMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-2">
        <UserCircle2 className="h-5 w-5 text-cyan-300" />
        <span className="text-sm text-slate-300">Ops Team</span>
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-12 z-40 w-48 rounded-[24px] border border-white/10 bg-slate-950/95 p-2 shadow-xl shadow-cyan-950/30">
            {([
              ['Profile', UserCircle2],
              ['Team', Users],
              ['Settings', Settings],
              ['Logout', LogOut],
            ] as Array<[string, LucideIcon]>).map(([label, Icon]) => (
              <button key={label} onClick={() => setOpen(false)} className="flex w-full items-center gap-2 rounded-[16px] px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10 hover:text-white">
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
