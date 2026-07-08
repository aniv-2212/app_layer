import { io, type Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:8000'
const API_URL = import.meta.env.VITE_API_BASE_URL ?? SOCKET_URL

export function getBackendUrl() {
  return API_URL.replace(/\/$/, '')
}

let socket: Socket | null = null

export function getThreatSocket() {
  if (!socket) {
    console.info(`[socket] connecting to ${SOCKET_URL}`)
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 700,
      reconnectionDelayMax: 5000,
      timeout: 12000,
    })

    socket.on('connect', () => console.info('[socket] connected'))
    socket.on('disconnect', (reason) => console.info('[socket] disconnected:', reason))
    socket.on('connect_error', (err) => console.warn('[socket] connect error:', err.message))
    socket.on('reconnect_attempt', (attempt) => console.info('[socket] reconnect attempt', attempt))
    socket.on('reconnect', (attempt) => console.info('[socket] reconnected after', attempt, 'attempts'))
    socket.on('reconnect_error', (err) => console.warn('[socket] reconnect error:', err.message))
    socket.on('reconnect_failed', () => console.error('[socket] reconnection failed — giving up'))
  }

  return socket
}

export function disconnectThreatSocket() {
  socket?.disconnect()
  socket = null
}
