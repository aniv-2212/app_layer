import { getBackendUrl } from '../../../services/socket'
import type { ChatRequest, ChatResponse } from '../types'

export class AiAssistantError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'AiAssistantError'
    this.code = code
  }
}

export async function sendChatMessage(request: ChatRequest, signal?: AbortSignal): Promise<ChatResponse> {
  const response = await fetch(`${getBackendUrl()}/api/ai-assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal,
  })

  if (!response.ok) {
    if (response.status === 400) {
      throw new AiAssistantError('Invalid request', 'INVALID_REQUEST')
    }
    if (response.status === 503) {
      throw new AiAssistantError('AI assistant service unavailable', 'SERVICE_UNAVAILABLE')
    }
    throw new AiAssistantError(`Backend returned ${response.status}`, 'BACKEND_ERROR')
  }

  return response.json()
}

export const SUGGESTED_QUESTIONS = [
  'Analyze a suspicious URL',
  'What is phishing?',
  'Explain this attack pattern',
  'How do I respond to a breach?',
]
