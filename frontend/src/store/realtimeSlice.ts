import { create } from 'zustand';

interface RealtimeSlice {
  connected: boolean;
  lastEventAt: string | null;
  recentEventIds: string[];
  setConnected: (v: boolean) => void;
  setLastEventAt: (t: string) => void;
  addRecentEvent: (id: string) => void;
}

export const useRealtimeStore = create<RealtimeSlice>((set) => ({
  connected: true,
  lastEventAt: new Date().toISOString(),
  recentEventIds: [],
  setConnected: (v) => set({ connected: v }),
  setLastEventAt: (t) => set({ lastEventAt: t }),
  addRecentEvent: (id) => set((state) => ({
    recentEventIds: [id, ...state.recentEventIds].slice(0, 10),
  })),
}));
