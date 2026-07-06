import React from 'react';

interface AttackReplayMapProps {
  data?: any;
}

export const AttackReplayMap: React.FC<AttackReplayMapProps> = ({ data }) => {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-slate-900/50 p-4 text-slate-400">
      AttackReplayMap Component (MapLibre/Deck.gl Placeholder)
    </div>
  );
};
