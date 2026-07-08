import { motion } from 'framer-motion'
import { Bot, X } from 'lucide-react'
import { useAiAssistantStore } from '../store/aiAssistantStore'

export function ChatBubble() {
  const { isOpen, isMinimized, toggle, open } = useAiAssistantStore()

  if (isOpen && !isMinimized) return null

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={
        isMinimized
          ? { scale: 1, opacity: 1, y: 0, width: 'auto', borderRadius: '9999px' }
          : { scale: 1, opacity: 1, y: 0 }
      }
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={isMinimized ? open : toggle}
      aria-label={isMinimized ? 'Open CyberAI Assistant' : 'Open CyberAI Assistant'}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 p-3.5 text-white shadow-2xl shadow-cyan-500/30 ring-1 ring-white/20 backdrop-blur-xl"
    >
      {isMinimized ? (
        <>
          <Bot className="h-5 w-5" />
          <span className="pr-1 text-sm font-medium">CyberAI Assistant</span>
        </>
      ) : (
        <Bot className="h-6 w-6" />
      )}
      <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
    </motion.button>
  )
}
