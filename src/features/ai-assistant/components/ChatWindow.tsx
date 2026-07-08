import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Loader } from 'lucide-react'
import { useAiAssistantStore } from '../store/aiAssistantStore'
import { SUGGESTED_QUESTIONS } from '../services/aiAssistantApi'
import { ChatHeader } from './ChatHeader'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'

export function ChatWindow() {
  const { isOpen, isMinimized, messages, isLoading, error, send } = useAiAssistantStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <AnimatePresence>
      {isOpen && !isMinimized ? (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/95 shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl"
        >
          <ChatHeader />

          <div className="flex-1 overflow-y-auto px-3 py-3">
            {messages.length === 1 && messages[0].id === 'welcome' ? (
              <div className="mb-4 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-500">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm text-slate-300">{messages[0].content}</p>
                </div>
                <div className="grid gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      disabled={isLoading}
                      className="rounded-full border border-white/10 bg-slate-900/50 px-4 py-2 text-left text-sm text-slate-400 transition hover:border-cyan-400/30 hover:bg-slate-900 hover:text-cyan-200 disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
              </div>
            )}

            {isLoading ? (
              <div className="mt-3 flex items-center gap-2.5 text-sm text-slate-400">
                <Loader className="h-4 w-4 animate-spin text-cyan-400" />
                CyberAI is thinking...
              </div>
            ) : null}

            {error ? (
              <div className="mt-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
            ) : null}

            <div ref={bottomRef} />
          </div>

          <ChatInput />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
