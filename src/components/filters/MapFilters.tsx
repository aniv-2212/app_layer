import { useFilterStore } from '../../store/filterStore'

const attackTypes = ['All', 'SQL Injection', 'XSS', 'Command Injection', 'RCE', 'Path Traversal', 'File Inclusion']
const countries = ['All', 'United States', 'Germany', 'Singapore', 'United Kingdom', 'Brazil', 'Russia']
const severities = ['All', 'Low', 'Medium', 'High', 'Critical']
const methods = ['All', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH']
const statuses = ['All', '200', '301', '302', '403', '404', '429', '500']
const ranges = ['24h', '7d', '30d']

export function MapFilters() {
  const filters = useFilterStore((state) => state.filters)
  const updateFilter = useFilterStore((state) => state.updateFilter)

  return (
    <div className="mb-6 grid gap-3 rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-cyan-950/20 backdrop-blur-xl md:grid-cols-2 xl:grid-cols-6">
      {[
        { key: 'attackType', options: attackTypes },
        { key: 'country', options: countries },
        { key: 'severity', options: severities },
        { key: 'httpMethod', options: methods },
        { key: 'statusCode', options: statuses },
        { key: 'timeRange', options: ranges },
      ].map((filter) => (
        <label key={filter.key} className="flex flex-col gap-1 text-sm text-slate-400">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{filter.key}</span>
          <select value={filters[filter.key as keyof typeof filters]} onChange={(e) => updateFilter(filter.key as keyof typeof filters, e.target.value)} className="rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-300 outline-none">
            {filter.options.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      ))}
    </div>
  )
}
