import React from 'react';
import { useAttackStore } from '../../store/attackStore';
import { Play, Pause } from 'lucide-react';

export const ReplayControls: React.FC = () => {
  const { replaying, setReplaying } = useAttackStore();
  return (
    <button onClick={() => setReplaying(!replaying)} className="absolute left-4 top-4 rounded-full border border-cyan-400/20 bg-cyan-500/10 p-2 text-cyan-200">
      {replaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </button>
  );
};
