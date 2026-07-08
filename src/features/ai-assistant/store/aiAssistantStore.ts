import { create } from 'zustand'
import type { ChatMessage } from '../types'
import { sendChatMessage, type AiAssistantError } from '../services/aiAssistantApi'

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'CyberAI Assistant online. Ask me about threats, suspicious URLs, attack patterns, security events, or cybersecurity concepts.',
  timestamp: Date.now(),
}

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem('cyberai_chat_history')
    if (!raw) return [WELCOME_MESSAGE]
    const parsed = JSON.parse(raw) as ChatMessage[]
    return parsed.length > 0 ? parsed : [WELCOME_MESSAGE]
  } catch {
    return [WELCOME_MESSAGE]
  }
}

function saveHistory(messages: ChatMessage[]) {
  try {
    localStorage.setItem('cyberai_chat_history', JSON.stringify(messages.slice(-100)))
  } catch {
    /* quota exceeded — silently ignore */
  }
}

type AiAssistantState = {
  messages: ChatMessage[]
  isOpen: boolean
  isMinimized: boolean
  isLoading: boolean
  error: string | null
  conversationId: string | null

  open: () => void
  close: () => void
  toggle: () => void
  minimize: () => void
  maximize: () => void
  send: (content: string, context?: Record<string, unknown>) => Promise<void>
  clear: () => void
}

export const useAiAssistantStore = create<AiAssistantState>((set, get) => ({
  messages: loadHistory(),
  isOpen: false,
  isMinimized: false,
  isLoading: false,
  error: null,
  conversationId: null,

  open: () => set({ isOpen: true, isMinimized: false }),

  close: () => set({ isOpen: false, isMinimized: false, error: null }),

  toggle: () => {
    const { isOpen, isMinimized } = get()
    if (!isOpen) {
      set({ isOpen: true, isMinimized: false })
    } else if (isMinimized) {
      set({ isMinimized: false })
    } else {
      set({ isOpen: false, isMinimized: false, error: null })
    }
  },

  minimize: () => set({ isMinimized: true, error: null }),

  maximize: () => set({ isMinimized: false }),

  send: async (content: string, context?: Record<string, unknown>) => {
    const { messages, conversationId } = get()
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      role: 'user',
      content: content.slice(0, 4096),
      timestamp: Date.now(),
    }

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    }))

    try {
      const history = [...get().messages.slice(-50)].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const result = await sendChatMessage({
        message: content.slice(0, 4096),
        conversation_history: history,
        context: context as any,
      })

      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        role: 'assistant',
        content: result.response,
        timestamp: Date.now(),
      }

      set((state) => ({
        messages: [...state.messages, aiMessage],
        isLoading: false,
        conversationId: result.conversation_id,
      }))

      saveHistory([...get().messages])
    } catch (err: unknown) {
      const error = err as AiAssistantError
      set({
        isLoading: false,
        error: error.message || 'Failed to get response from AI assistant',
      })
    }
  },

  clear: () => {
    const welcome = { ...WELCOME_MESSAGE, timestamp: Date.now() }
    set({ messages: [welcome], error: null, conversationId: null })
    saveHistory([welcome])
  },
}))
