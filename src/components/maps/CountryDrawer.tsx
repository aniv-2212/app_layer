import React from 'react';
import { useMapStore } from '../../store/mapStore';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { buildCountryRollup } from '../../store/liveThreatStore';
import { useAttackStore } from '../../store/attackStore';

function getCountryName(selectedCountry: any) {
  if (!selectedCountry) return null;
  if (typeof selectedCountry === 'string') return selectedCountry;
  return selectedCountry.country ?? selectedCountry.name ?? selectedCountry.destination_country ?? selectedCountry.source_country ?? null;
}

export const CountryDrawer: React.FC = () => {
  const { selectedCountry, setSelectedCountry } = useMapStore();
  const attacks = useAttackStore((state) => state.attacks);
  const countryName = getCountryName(selectedCountry);
  const rollup = countryName ? buildCountryRollup(attacks, countryName) : null;

  return (
    <AnimatePresence>
      {countryName ? (
        <motion.aside initial={{ x: 420, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 420, opacity: 0 }} className="absolute bottom-4 right-4 top-4 z-40 w-80 rounded-[24px] border border-white/10 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex justify-between text-slate-200">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Country</p>
              <h2 className="text-xl font-semibold">{countryName}</h2>
            </div>
            <button onClick={() => setSelectedCountry(null)}><X className="h-5 w-5" /></button>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Metric label="Requests" value={rollup ? rollup.requests.toLocaleString() : '0'} />
            <Metric label="Attacks" value={rollup ? rollup.attacks.toLocaleString() : '0'} />
            <Metric label="Blocked" value={rollup ? rollup.blocked.toLocaleString() : '0'} />
            <Metric label="Threat Score" value={rollup ? `${rollup.threatScore}/100` : '0/100'} />
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Top Attack</p>
            <p className="mt-2 text-sm font-medium text-white">{rollup?.topAttack ?? 'No active attacks'}</p>
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Top Sources</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(rollup?.topSources.length ? rollup.topSources : ['No sources']).map((source) => (
                <span key={source} className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">{source}</span>
              ))}
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
};

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
