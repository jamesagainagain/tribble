import { create } from 'zustand';
import type { PipelineHealth } from '@/types';

interface PipelineSlice {
  health: PipelineHealth[];
  setHealth: (h: PipelineHealth[]) => void;
}

export const usePipelineStore = create<PipelineSlice>((set) => ({
  health: [],
  setHealth: (health) => set({ health }),
}));
