import React from 'react';

interface FiltersProps {
  data?: any;
}

export const Filters: React.FC<FiltersProps> = ({ data }) => {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-slate-900/50 p-4 text-slate-400">
      Filters Component (MapLibre/Deck.gl Placeholder)
    </div>
  );
};
