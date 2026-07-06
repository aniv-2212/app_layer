import { io, type Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:8000'
const API_URL = import.meta.env.VITE_API_BASE_URL ?? SOCKET_URL

export function getBackendUrl() {
  return API_URL.replace(/\/$/, '')
}

let socket: Socket | null = null

export function getThreatSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Number.POSITIVE_INFINITY,
      reconnectionDelay: 700,
      reconnectionDelayMax: 5000,
      timeout: 12000,
    })
  }

  return socket
}

export function disconnectThreatSocket() {
  socket?.disconnect()
  socket = null
}
