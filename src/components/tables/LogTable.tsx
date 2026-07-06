import React from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

interface LogTableProps {
  data?: any[];
}

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor((row) => row.timestamp, { id: 'timestamp', header: 'Timestamp' }),
  columnHelper.accessor((row) => row.source ?? row.sourceIp, { id: 'source', header: 'Source' }),
  columnHelper.accessor((row) => row.type ?? row.attackType, { id: 'type', header: 'Type' }),
  columnHelper.accessor((row) => row.severity, { id: 'severity', header: 'Severity' }),
  columnHelper.accessor((row) => row.status, { id: 'status', header: 'Status' }),
  columnHelper.accessor((row) => row.message ?? row.endpoint, { id: 'message', header: 'Message' }),
];

export const LogTable: React.FC<LogTableProps> = ({ data }) => {
  const table = useReactTable({ data: data ?? [], columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-slate-900/50">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-800/50 text-xs uppercase text-slate-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => <th key={header.id} className="px-4 py-3">{flexRender(header.column.columnDef.header, header.getContext())}</th>)}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-white/5">
              {row.getVisibleCells().map((cell) => <td key={cell.id} className="px-4 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
            </tr>
          )) : (
            <tr><td className="px-4 py-6 text-slate-500" colSpan={columns.length}>No logs available</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
