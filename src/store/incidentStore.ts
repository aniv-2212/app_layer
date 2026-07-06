import { create } from 'zustand'
import type {
  Incident,
  IncidentStatus,
  IncidentPriority,
  NotificationItem,
} from '../types'

const ANALYSTS = ['A. Chen', 'M. Osei', 'R. Patel', 'J. Kowalski']

const WORKFLOW_ORDER: IncidentStatus[] = [
  'new',
  'investigating',
  'contained',
  'resolved',
  'closed',
]

function id() {
  return Math.random().toString(36).slice(2, 10)
}

function now() {
  return new Date().toISOString()
}

const seedIncidents: Incident[] = [
  {
    id: id(),
    title: 'Anomalous outbound traffic from web-tier-03',
    description: 'Spike in egress traffic to unrecognized IP range, possible C2 beacon.',
    status: 'investigating',
    priority: 'high',
    assignedAnalyst: 'A. Chen',
    createdAt: now(),
    updatedAt: now(),
    timeline: [
      { id: id(), timestamp: now(), actor: 'system', action: 'Incident auto-created from alert #4821' },
      { id: id(), timestamp: now(), actor: 'A. Chen', action: 'Assigned to self, began triage' },
    ],
    evidence: [],
    notes: [],
    resolution: null,
  },
]

interface IncidentStore {
  incidents: Incident[]
  notifications: NotificationItem[]
  selectedIncidentId: string | null

  selectIncident: (incidentId: string | null) => void
  createIncident: (title: string, description: string, priority: IncidentPriority) => void
  assignAnalyst: (incidentId: string, analyst: string) => void
  setStatus: (incidentId: string, status: IncidentStatus) => void
  setPriority: (incidentId: string, priority: IncidentPriority) => void
  addNote: (incidentId: string, author: string, content: string) => void
  addEvidence: (incidentId: string, name: string, type: Incident['evidence'][number]['type']) => void
  resolveIncident: (incidentId: string, resolution: string) => void
  markNotificationRead: (notificationId: string) => void

  analysts: string[]
  workflowOrder: IncidentStatus[]
}

export const useIncidentStore = create<IncidentStore>((set) => ({
  incidents: seedIncidents,
  notifications: [],
  selectedIncidentId: seedIncidents[0]?.id ?? null,
  analysts: ANALYSTS,
  workflowOrder: WORKFLOW_ORDER,

  selectIncident: (incidentId) => set({ selectedIncidentId: incidentId }),

  createIncident: (title, description, priority) => {
    const newIncident: Incident = {
      id: id(),
      title,
      description,
      status: 'new',
      priority,
      assignedAnalyst: null,
      createdAt: now(),
      updatedAt: now(),
      timeline: [{ id: id(), timestamp: now(), actor: 'system', action: 'Incident created' }],
      evidence: [],
      notes: [],
      resolution: null,
    }
    set((s) => ({
      incidents: [newIncident, ...s.incidents],
      selectedIncidentId: newIncident.id,
      notifications: [
        { id: id(), message: `New incident created: "${title}"`, createdAt: now(), read: false },
        ...s.notifications,
      ],
    }))
  },

  assignAnalyst: (incidentId, analyst) => {
    set((s) => ({
      incidents: s.incidents.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              assignedAnalyst: analyst,
              updatedAt: now(),
              timeline: [
                ...inc.timeline,
                { id: id(), timestamp: now(), actor: 'system', action: `Assigned to ${analyst}` },
              ],
            }
          : inc
      ),
      notifications: [
        { id: id(), message: `${analyst} assigned to incident`, createdAt: now(), read: false },
        ...s.notifications,
      ],
    }))
  },

  setStatus: (incidentId, status) => {
    set((s) => ({
      incidents: s.incidents.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status,
              updatedAt: now(),
              timeline: [
                ...inc.timeline,
                { id: id(), timestamp: now(), actor: 'system', action: `Status changed to ${status}` },
              ],
            }
          : inc
      ),
      notifications: [
        { id: id(), message: `Incident status → ${status}`, createdAt: now(), read: false },
        ...s.notifications,
      ],
    }))
  },

  setPriority: (incidentId, priority) => {
    set((s) => ({
      incidents: s.incidents.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              priority,
              updatedAt: now(),
              timeline: [
                ...inc.timeline,
                { id: id(), timestamp: now(), actor: 'system', action: `Priority changed to ${priority}` },
              ],
            }
          : inc
      ),
    }))
  },

  addNote: (incidentId, author, content) => {
    set((s) => ({
      incidents: s.incidents.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              notes: [...inc.notes, { id: id(), author, content, createdAt: now() }],
              updatedAt: now(),
            }
          : inc
      ),
    }))
  },

  addEvidence: (incidentId, name, type) => {
    set((s) => ({
      incidents: s.incidents.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              evidence: [
                ...inc.evidence,
                { id: id(), name, type, addedAt: now(), addedBy: inc.assignedAnalyst ?? 'unknown' },
              ],
              updatedAt: now(),
              timeline: [
                ...inc.timeline,
                { id: id(), timestamp: now(), actor: 'system', action: `Evidence added: ${name}` },
              ],
            }
          : inc
      ),
    }))
  },

  resolveIncident: (incidentId, resolution) => {
    set((s) => ({
      incidents: s.incidents.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: 'resolved',
              resolution,
              updatedAt: now(),
              timeline: [
                ...inc.timeline,
                { id: id(), timestamp: now(), actor: 'system', action: 'Incident resolved' },
              ],
            }
          : inc
      ),
      notifications: [
        { id: id(), message: 'Incident resolved', createdAt: now(), read: false },
        ...s.notifications,
      ],
    }))
  },

  markNotificationRead: (notificationId) => {
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    }))
  },
}))
