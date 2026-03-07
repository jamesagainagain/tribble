import { create } from 'zustand';
import type { Severity, OntologyClass, SourceType, EventVerificationStatus } from '@/types';

interface FilterSlice {
  timeRange: { start: string; end: string };
  severities: Severity[];
  ontologyClasses: OntologyClass[];
  sourcesVisible: SourceType[];
  ngoZoneIds: string[];
  verificationStatus: 'all' | EventVerificationStatus;
  regionIds: string[];
  viewportRegionLabel: string;
  setFilter: (key: string, value: unknown) => void;
  resetFilters: () => void;
}

const ALL_SOURCES: SourceType[] = ['news_agent', 'user_submission', 'satellite', 'weather_api', 'drone', 'analyst_input'];
const ALL_ONTOLOGY: OntologyClass[] = [
  'armed_conflict', 'airstrike', 'shelling', 'sniper', 'roadblock_military',
  'bridge_damaged', 'road_blocked', 'hospital_damaged', 'power_outage', 'water_contamination',
  'displacement_mass', 'crossing_point', 'border_closure', 'checkpoint', 'idp_camp',
  'food_distribution', 'medical_post', 'water_distribution', 'shelter_point', 'aid_convoy',
  'aid_obstruction', 'flood', 'earthquake', 'fire', 'disease_outbreak', 'drought',
  'suspicious_activity', 'casualty_report',
];

const defaults = {
  timeRange: { start: '2024-10-15T00:00:00Z', end: '2024-11-15T23:59:59Z' },
  severities: ['critical', 'high', 'medium', 'low'] as Severity[],
  ontologyClasses: ALL_ONTOLOGY,
  sourcesVisible: ALL_SOURCES,
  ngoZoneIds: [] as string[],
  verificationStatus: 'all' as const,
  regionIds: [] as string[],
  viewportRegionLabel: 'Sahel Region',
};

export const useFilterStore = create<FilterSlice>((set) => ({
  ...defaults,
  setFilter: (key, value) => set({ [key]: value }),
  resetFilters: () => set(defaults),
}));
