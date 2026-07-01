import { useMemo, useState } from 'react'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useAttackStore } from '../../store/attackStore'
import type { AttackLogRow } from '../../types'

const columns = [
  { header: 'Timestamp', accessorKey: 'timestamp' },
  { header: 'Source IP', accessorKey: 'sourceIp' },
  { header: 'Destination', accessorKey: 'destination' },
  { header: 'Endpoint', accessorKey: 'endpoint' },
  { header: 'Attack Type', accessorKey: 'attackType' },
  { header: 'HTTP Method', accessorKey: 'httpMethod' },
  { header: 'Country', accessorKey: 'country' },
  { header: 'Severity', accessorKey: 'severity' },
  { header: 'Status', accessorKey: 'status' },
]

export function AttackLogTable() {
  const attackLogs = useAttackStore((state) => state.attackLogs)
  const [globalFilter, setGlobalFilter] = useState('')
  const data = useMemo<AttackLogRow[]>(() => attackLogs, [attackLogs])

  const table = useReactTable({
    data,
    columns: columns as any,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">Attack Log Table</h3>
        <input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search table" className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 outline-none" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-slate-300">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-white/10 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-2 py-2">{flexRender(header.column.columnDef.header, header.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-white/5 text-sm text-slate-300">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-2 py-2">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
        <button onClick={() => table.previousPage()} className="rounded-full border border-white/10 px-3 py-2">Previous</button>
        <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
        <button onClick={() => table.nextPage()} className="rounded-full border border-white/10 px-3 py-2">Next</button>
      </div>
    </div>
  )
}
