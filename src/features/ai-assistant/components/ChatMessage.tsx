import { Bot, User } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '../types'

type Props = {
  message: ChatMessageType
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isUser ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'bg-cyan-500/20 text-cyan-300'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={`max-w-[calc(100%-44px)] space-y-1 ${isUser ? 'items-end' : ''}`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'rounded-tr-md bg-fuchsia-500/15 text-fuchsia-100'
              : 'rounded-tl-md border border-white/10 bg-slate-900/80 text-slate-200'
          }`}
        >
          {message.content}
        </div>
        <p className={`text-[10px] text-slate-500 ${isUser ? 'text-right' : ''}`}>{time}</p>
      </div>
    </div>
  )
}
