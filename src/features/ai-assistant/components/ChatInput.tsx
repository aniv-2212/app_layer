import { useState, useRef, type KeyboardEvent } from 'react'
import { ArrowUp, Loader } from 'lucide-react'
import { useAiAssistantStore } from '../store/aiAssistantStore'

export function ChatInput() {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { send, isLoading } = useAiAssistantStore()

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    send(trimmed)
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`
    }
  }

  return (
    <div className="border-t border-white/10 px-3 py-3">
      <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          rows={1}
          maxLength={4096}
          placeholder="Ask about threats, URLs, attacks..."
          className="max-h-[120px] min-h-[24px] flex-1 resize-none bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || isLoading}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white disabled:opacity-40"
          aria-label="Send message"
        >
          {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
        </button>
      </div>
      <p className="mt-1.5 text-[10px] text-slate-600">Enter to send · Shift+Enter for new line</p>
    </div>
  )
}
