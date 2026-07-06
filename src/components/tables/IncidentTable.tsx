import React from 'react';

interface IncidentTableProps {
  data?: any[];
}

export const IncidentTable: React.FC<IncidentTableProps> = ({ data }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-slate-900/50">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-800/50 text-xs uppercase text-slate-400">
          <tr><th className="px-6 py-3">IncidentTable</th></tr>
        </thead>
        <tbody>
          <tr className="border-b border-white/5"><td className="px-6 py-4">Data goes here</td></tr>
        </tbody>
      </table>
    </div>
  );
};
