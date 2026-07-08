import { AnimatePresence, motion } from 'framer-motion'
import { FileDown, Loader, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { api, downloadFile } from '../../services/api'

type ExportModalProps = {
  open: boolean
  onClose: () => void
}

export function ExportModal({ open, onClose }: ExportModalProps) {
  const [selected, setSelected] = useState('PDF')
  const [busy, setBusy] = useState(false)

  const handleExport = async () => {
    setBusy(true)
    try {
      if (selected === 'CSV') {
        const csv = await api.exportCsv()
        downloadFile('cyberai-export.csv', csv, 'text/csv')
      } else if (selected === 'JSON') {
        const payload = await api.exportJson()
        downloadFile('cyberai-export.json', JSON.stringify(payload, null, 2), 'application/json')
      } else {
        toast.success('Opening print dialog for PDF export')
        window.print()
      }
      onClose()
    } catch {
      toast.error('Export failed — backend may be unavailable')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }} className="w-full max-w-md rounded-[28px] border border-white/10 bg-slate-950/95 p-5 shadow-2xl shadow-cyan-950/30">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-400">Export</p>
                <h3 className="text-lg font-semibold text-white">Choose a format</h3>
              </div>
              <button onClick={onClose} className="rounded-full border border-white/10 p-2 text-slate-300"><X className="h-4 w-4" /></button>
            </div>
            <div className="mb-4 grid gap-3">
              {['PDF', 'CSV', 'JSON'].map((format) => (
                <button key={format} onClick={() => setSelected(format)} className={`rounded-[20px] border px-4 py-3 text-left text-sm ${selected === format ? 'border-cyan-400/20 bg-cyan-500/10 text-cyan-200' : 'border-white/10 bg-slate-900/70 text-slate-300'}`}>
                  <div className="flex items-center gap-2"><FileDown className="h-4 w-4" /> {format}</div>
                </button>
              ))}
            </div>
            <button onClick={handleExport} disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              {busy ? <Loader className="h-4 w-4 animate-spin" /> : null}
              {busy ? 'Exporting…' : `Export ${selected}`}
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
