import { useState } from 'react'
import { ClipboardList, Clock3, ShieldCheck, Users } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { StatusCard } from '../components/cards/StatusCard'
import { ChartCard } from '../components/cards/ChartCard'
import { useIncidentStore } from '../store/incidentStore'
import type { IncidentPriority, IncidentStatus } from '../types'

const PRIORITY_STYLE: Record<IncidentPriority, string> = {
  low: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-200',
  medium: 'border-amber-400/20 bg-amber-500/10 text-amber-200',
  high: 'border-orange-400/20 bg-orange-500/10 text-orange-200',
  critical: 'border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-200',
}

const STATUS_STYLE: Record<IncidentStatus, string> = {
  new: 'border-white/10 bg-slate-900/70 text-slate-300',
  investigating: 'border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-200',
  contained: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-200',
  resolved: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
  closed: 'border-white/10 bg-slate-800/70 text-slate-400',
}

export function IncidentResponsePage() {
  const {
    incidents,
    selectedIncidentId,
    analysts,
    workflowOrder,
    selectIncident,
    createIncident,
    assignAnalyst,
    setStatus,
    setPriority,
    addNote,
    addEvidence,
    resolveIncident,
  } = useIncidentStore()

  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPriority, setNewPriority] = useState<IncidentPriority>('medium')

  // Draft text keyed by incident id, so unsent input for one incident
  // never bleeds into another when the user switches selection.
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})
  const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, string>>({})

  const selected = incidents.find((i) => i.id === selectedIncidentId) ?? incidents[0] ?? null

  const noteText = selected ? noteDrafts[selected.id] ?? '' : ''
  const resolutionText = selected ? resolutionDrafts[selected.id] ?? '' : ''

  const setNoteText = (value: string) => {
    if (!selected) return
    setNoteDrafts((prev) => ({ ...prev, [selected.id]: value }))
  }

  const setResolutionText = (value: string) => {
    if (!selected) return
    setResolutionDrafts((prev) => ({ ...prev, [selected.id]: value }))
  }

  const clearNoteDraft = (incidentId: string) => {
    setNoteDrafts((prev) => {
      const next = { ...prev }
      delete next[incidentId]
      return next
    })
  }

  const clearResolutionDraft = (incidentId: string) => {
    setResolutionDrafts((prev) => {
      const next = { ...prev }
      delete next[incidentId]
      return next
    })
  }

  const submitNote = () => {
    if (!selected || !noteText.trim()) return
    addNote(selected.id, selected.assignedAnalyst ?? 'Analyst', noteText.trim())
    clearNoteDraft(selected.id)
  }

  const submitResolution = () => {
    if (!selected || !resolutionText.trim()) return
    resolveIncident(selected.id, resolutionText.trim())
    clearResolutionDraft(selected.id)
  }

  const activeCount = incidents.filter((i) => i.status !== 'resolved' && i.status !== 'closed').length
  const assignedCount = new Set(incidents.filter((i) => i.assignedAnalyst).map((i) => i.assignedAnalyst)).size
  const containedPct = incidents.length
    ? Math.round(
      (incidents.filter((i) => ['contained', 'resolved', 'closed'].includes(i.status)).length /
        incidents.length) *
      100
    )
    : 0
  const resolvedPct = incidents.length
    ? Math.round(
      (incidents.filter((i) => ['resolved', 'closed'].includes(i.status)).length / incidents.length) * 100
    )
    : 0

  return (
    <PageShell
      title="Incident Response"
      subtitle="SOC case management, analyst assignments, evidence review, and recovery progress."
      actions={
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white"
        >
          New Incident
        </button>
      }
      filters={
        <>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
            {activeCount} open
          </span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">
            {incidents.length} total cases
          </span>
        </>
      }
      kpiSection={[
        <StatusCard key="queue" title="Incident Queue" value={String(activeCount)} detail="Active investigations" icon={ClipboardList} accent="from-cyan-500 to-sky-600" />,
        <StatusCard key="analysts" title="Assigned Analysts" value={String(assignedCount)} detail="On watch" icon={Users} accent="from-fuchsia-500 to-violet-600" />,
        <StatusCard key="status" title="Containment" value={`${containedPct}%`} detail="Containment complete" icon={ShieldCheck} accent="from-amber-400 to-orange-600" />,
        <StatusCard key="timeline" title="Resolution Progress" value={`${resolvedPct}%`} detail="Cases resolved" icon={Clock3} accent="from-emerald-500 to-teal-600" />,
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Incident Queue" subtitle="Priority-ranked cases">
          <div className="space-y-3 text-sm text-slate-300">
            {incidents.map((inc) => (
              <button
                key={inc.id}
                onClick={() => selectIncident(inc.id)}
                className={`w-full rounded-[20px] border px-4 py-3 text-left transition ${inc.id === selected?.id
                    ? 'border-cyan-400/40 bg-slate-900'
                    : 'border-white/10 bg-slate-900/70 hover:bg-slate-900'
                  }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span>{inc.title}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-xs ${PRIORITY_STYLE[inc.priority]}`}>
                    {inc.priority}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-xs ${STATUS_STYLE[inc.status]}`}>
                    {inc.status}
                  </span>
                  <span className="text-xs text-slate-500">{inc.assignedAnalyst ?? 'Unassigned'}</span>
                </div>
              </button>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Incident Timeline" subtitle="Stage progression">
          <div className="space-y-3 text-sm text-slate-300">
            {selected?.timeline.length ? (
              selected.timeline.map((t) => (
                <div key={t.id} className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">
                  <span className="text-xs text-slate-500">{new Date(t.timestamp).toLocaleTimeString()} — </span>
                  {t.action}
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-500">
                No timeline events yet.
              </div>
            )}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="Assigned Analysts" subtitle="Response owners">
          <div className="space-y-2 text-sm text-slate-300">
            {selected ? (
              <select
                value={selected.assignedAnalyst ?? ''}
                onChange={(e) => assignAnalyst(selected.id, e.target.value)}
                className="w-full rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-200"
              >
                <option value="">Unassigned</option>
                {analysts.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            ) : (
              <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-500">
                Select a case
              </div>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Evidence Panel" subtitle="Artifacts ready for review">
          <div className="space-y-2">
            <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">
              {selected?.evidence.length ?? 0} item(s) attached
            </div>
            {selected && (
              <button
                onClick={() => addEvidence(selected.id, `evidence-${selected.evidence.length + 1}.log`, 'log')}
                className="text-xs text-cyan-300 hover:text-cyan-200"
              >
                + Attach log file
              </button>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Investigation Notes" subtitle="Analyst commentary">
          <div className="space-y-2">
            <div className="max-h-24 space-y-1 overflow-y-auto">
              {selected?.notes.map((n) => (
                <div key={n.id} className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-3 text-xs text-fuchsia-200">
                  <span className="text-fuchsia-400">{n.author}: </span>
                  {n.content}
                </div>
              ))}
            </div>
            {selected && (
              <div className="flex gap-2">
                <input
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitNote()
                  }}
                  placeholder="Add a note..."
                  className="flex-1 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-200"
                />
                <button
                  onClick={submitNote}
                  className="rounded-full bg-fuchsia-500/20 px-3 py-1.5 text-xs text-fuchsia-200"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Priority Matrix" subtitle="Impact vs urgency">
          <div className="space-y-2">
            {selected ? (
              <>
                <select
                  value={selected.priority}
                  onChange={(e) => setPriority(selected.id, e.target.value as IncidentPriority)}
                  className="w-full rounded-[20px] border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-200"
                >
                  {(['low', 'medium', 'high', 'critical'] as IncidentPriority[]).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <select
                  value={selected.status}
                  onChange={(e) => setStatus(selected.id, e.target.value as IncidentStatus)}
                  className="w-full rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-200"
                >
                  {workflowOrder.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </>
            ) : (
              <div className="rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-200">
                Select a case
              </div>
            )}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Response Statistics" subtitle="Operational readiness and workload">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
            {incidents.reduce((sum, i) => sum + i.evidence.length, 0)} evidence items
          </span>
          <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-2 text-sm text-fuchsia-200">
            {incidents.reduce((sum, i) => sum + i.notes.length, 0)} notes logged
          </span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {resolvedPct}% resolved
          </span>

          {selected && selected.status !== 'resolved' && (
            <div className="ml-auto flex items-center gap-2">
              <input
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitResolution()
                }}
                placeholder="Resolution summary..."
                className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-200"
              />
              <button
                onClick={submitResolution}
                className="rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs text-emerald-200"
              >
                Resolve
              </button>
            </div>
          )}
        </div>
        {selected?.resolution && (
          <div className="mt-3 rounded-[20px] border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Resolved: {selected.resolution}
          </div>
        )}
      </ChartCard>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-96 space-y-3 rounded-[24px] border border-white/10 bg-slate-950 p-5">
            <h3 className="font-semibold text-slate-100">Create Incident</h3>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
              className="w-full rounded-[16px] border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-200"
            />
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description"
              rows={3}
              className="w-full rounded-[16px] border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-200"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as IncidentPriority)}
              className="w-full rounded-[16px] border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-200"
            >
              {(['low', 'medium', 'high', 'critical'] as IncidentPriority[]).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowCreate(false)} className="px-3 py-1.5 text-sm text-slate-400">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newTitle.trim()) return
                  createIncident(newTitle.trim(), newDesc.trim(), newPriority)
                  setNewTitle('')
                  setNewDesc('')
                  setShowCreate(false)
                }}
                className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-1.5 text-sm font-medium text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
