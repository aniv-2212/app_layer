import { getBackendUrl } from '../../../services/socket'
import type { ScanHistoryResponse, ScannerHealth, ScanResult } from '../types'

const SCAN_TIMEOUT_MS = 45_000

export class UrlScannerApiError extends Error {
  status: number | null

  constructor(message: string, status: number | null = null) {
    super(message)
    this.name = 'UrlScannerApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), SCAN_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(`${getBackendUrl()}/api/url-scanner${path}`, {
      ...init,
      signal: controller.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new UrlScannerApiError('Scan timed out — the backend took too long to respond.')
    }
    throw new UrlScannerApiError('Cannot reach the CyberAI backend. Is it running?')
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`
    try {
      const body = await response.json()
      if (typeof body?.detail === 'string') detail = body.detail
      else if (Array.isArray(body?.detail) && body.detail[0]?.msg) detail = body.detail[0].msg
    } catch {
      // non-JSON error body — keep the generic message
    }
    throw new UrlScannerApiError(detail, response.status)
  }

  return response.json() as Promise<T>
}

export const urlScannerApi = {
  scan: (url: string, includeDomainIntel = true) =>
    request<ScanResult>('/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, include_domain_intel: includeDomainIntel }),
    }),
  history: (limit = 50) => request<ScanHistoryResponse>(`/history?limit=${limit}`),
  result: (scanId: string) => request<ScanResult>(`/result/${encodeURIComponent(scanId)}`),
  health: () => request<ScannerHealth>('/health'),
}
