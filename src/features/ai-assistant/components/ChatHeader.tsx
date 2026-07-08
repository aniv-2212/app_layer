import { Bot, Eraser, Minus, X } from 'lucide-react'
import { useAiAssistantStore } from '../store/aiAssistantStore'

export function ChatHeader() {
  const { minimize, close, clear } = useAiAssistantStore()

  return (
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-fuchsia-500">
          <Bot className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">CyberAI Assistant</p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-emerald-400">Online</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={clear}
          aria-label="Clear conversation"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
        >
          <Eraser className="h-4 w-4" />
        </button>
        <button
          onClick={minimize}
          aria-label="Minimize"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          onClick={close}
          aria-label="Close"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
