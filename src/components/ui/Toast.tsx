import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

type ToastProps = {
  message: string
  open: boolean
}

export function Toast({ message, open }: ToastProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 backdrop-blur">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
