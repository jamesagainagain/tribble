import { create } from 'zustand';
import type { HipEvent, Region, Zone, Boundary, NewsEvent } from '@/types';

interface EventSlice {
  events: HipEvent[];
  regions: Region[];
  zones: Zone[];
  boundaries: Boundary[];
  newsEvents: NewsEvent[];
  selectedEventId: string | null;
  setEvents: (events: HipEvent[]) => void;
  upsertEvent: (event: HipEvent) => void;
  setRegions: (regions: Region[]) => void;
  setZones: (zones: Zone[]) => void;
  setBoundaries: (boundaries: Boundary[]) => void;
  setNewsEvents: (newsEvents: NewsEvent[]) => void;
  setSelectedEventId: (id: string | null) => void;
}

export const useEventStore = create<EventSlice>((set) => ({
  events: [],
  regions: [],
  zones: [],
  boundaries: [],
  newsEvents: [],
  selectedEventId: null,
  setEvents: (events) => set({ events }),
  upsertEvent: (event) => set((state) => {
    const idx = state.events.findIndex(e => e.id === event.id);
    if (idx >= 0) {
      const updated = [...state.events];
      updated[idx] = event;
      return { events: updated };
    }
    return { events: [event, ...state.events] };
  }),
  setRegions: (regions) => set({ regions }),
  setZones: (zones) => set({ zones }),
  setBoundaries: (boundaries) => set({ boundaries }),
  setNewsEvents: (newsEvents) => set({ newsEvents }),
  setSelectedEventId: (id) => set({ selectedEventId: id }),
}));
