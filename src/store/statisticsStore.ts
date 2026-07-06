import { create } from 'zustand';

interface StatisticsState {
  statistics: any;
  setStatistics: (stats: any) => void;
  timeline: any[];
  setTimeline: (timeline: any[]) => void;
}

export const useStatisticsStore = create<StatisticsState>((set) => ({
  statistics: null,
  setStatistics: (statistics) => set({ statistics }),
  timeline: [],
  setTimeline: (timeline) => set({ timeline }),
}));
