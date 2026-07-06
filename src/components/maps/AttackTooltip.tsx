import React from 'react';
import { useMapStore } from '../../store/mapStore';

export const AttackTooltip: React.FC = () => {
  const { hoveredObject } = useMapStore();
  if (!hoveredObject) return null;

  return (
    <div className="pointer-events-none absolute right-4 top-4 z-30 w-72 rounded-xl border border-cyan-400/20 bg-slate-950/90 p-3 text-sm text-slate-300 shadow-xl backdrop-blur">
      <div className="font-semibold text-white">{hoveredObject.attack_type ?? hoveredObject.label ?? hoveredObject.name ?? 'Attack Detail'}</div>
      <div className="mt-3 space-y-2 text-xs">
        <Row label="Source" value={hoveredObject.source_country ?? hoveredObject.source_ip ?? hoveredObject.type ?? 'Unknown'} />
        <Row label="Destination" value={hoveredObject.destination_country ?? hoveredObject.destination_ip ?? hoveredObject.id ?? 'Unknown'} />
        <Row label="Endpoint" value={hoveredObject.endpoint ?? 'N/A'} />
        <Row label="Method" value={hoveredObject.http_method ?? hoveredObject.protocol ?? 'N/A'} />
        <Row label="Severity" value={hoveredObject.severity ?? `${Math.round(hoveredObject.risk_score ?? hoveredObject.risk ?? 0)}/100`} />
        <Row label="Status" value={hoveredObject.status ?? 'Observed'} />
      </div>
    </div>
  );
};

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="max-w-[150px] truncate text-right text-slate-200">{value}</span>
    </div>
  );
}
