import { create } from 'zustand';
import type { ViewportState, MapProjection, MapBasemap } from '@/types';

interface MapSlice {
  viewport: ViewportState;
  projection: MapProjection;
  basemap: MapBasemap;
  setViewport: (v: Partial<ViewportState>) => void;
  flyTo: (lat: number, lng: number, zoom?: number) => void;
  setProjection: (p: MapProjection) => void;
  setBasemap: (b: MapBasemap) => void;
}

export const useMapStore = create<MapSlice>((set) => ({
  viewport: { latitude: 14.0, longitude: 17.0, zoom: 5, bearing: 0, pitch: 0 },
  projection: 'mercator',
  basemap: 'dark',
  setViewport: (v) => set((state) => ({ viewport: { ...state.viewport, ...v } })),
  flyTo: (lat, lng, zoom = 10) => set((state) => ({ viewport: { ...state.viewport, latitude: lat, longitude: lng, zoom } })),
  setProjection: (projection) => set({ projection }),
  setBasemap: (basemap) => set({ basemap }),
}));
