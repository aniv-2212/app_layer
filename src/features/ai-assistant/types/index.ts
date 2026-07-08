export type MessageRole = 'user' | 'assistant' | 'system'

export type ChatMessage = {
  id: string
  role: MessageRole
  content: string
  timestamp: number
}

export type AssistantContext = {
  feature?: string
  url?: string
  risk_score?: number
  classification?: string
  attack_type?: string
  source_country?: string
  target_country?: string
}

export type ChatRequest = {
  message: string
  conversation_history: { role: string; content: string }[]
  context?: AssistantContext
}

export type ChatResponse = {
  response: string
  timestamp: string
  conversation_id: string
}
