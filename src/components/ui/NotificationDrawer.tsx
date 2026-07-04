import { AnimatePresence, motion } from 'framer-motion'
import { Bell, X } from 'lucide-react'
import { useNotificationStore } from '../../store/notificationStore'

export function NotificationDrawer() {
  const open = useNotificationStore((state) => state.open)
  const items = useNotificationStore((state) => state.items)
  const setOpen = useNotificationStore((state) => state.setOpen)
  const clearAll = useNotificationStore((state) => state.clearAll)

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 24, opacity: 0 }} className="fixed right-4 top-24 z-50 w-80 rounded-[28px] border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-300"><Bell className="h-4 w-4" /> Notifications</div>
            <button onClick={() => setOpen(false)} className="rounded-full border border-white/10 p-2 text-slate-300"><X className="h-4 w-4" /></button>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-slate-400">Live SOC updates</p>
            <button onClick={clearAll} className="text-sm text-cyan-300">Clear All</button>
          </div>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="rounded-[20px] border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-300">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium text-white">{item.title}</span>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
                <p className="text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
