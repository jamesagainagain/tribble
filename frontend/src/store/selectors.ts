import type { Incident, NGO, Drone, HipEvent } from '@/types';
import { PLACEHOLDER_INCIDENTS, PLACEHOLDER_NGOS, PLACEHOLDER_DRONES, PLACEHOLDER_EVENTS } from '@/lib/placeholder-data';
import { useFilterStore } from './filterSlice';
import { ONTOLOGY_TO_LAYER } from '@/lib/icon-registry';

export const selectFilteredIncidents = (): Incident[] => {
  const { severities, ngoZoneIds, verificationStatus } = useFilterStore.getState();
  return PLACEHOLDER_INCIDENTS.filter((i) => {
    if (!severities.includes(i.severity)) return false;
    if (ngoZoneIds.length > 0 && !i.assigned_ngo_ids.some((id) => ngoZoneIds.includes(id))) return false;
    if (verificationStatus !== 'all' && i.verification_status !== verificationStatus) return false;
    return true;
  });
};

export const selectFilteredEvents = (): HipEvent[] => {
  const { severities, ontologyClasses, sourcesVisible, verificationStatus, regionIds } = useFilterStore.getState();
  return PLACEHOLDER_EVENTS.filter((e) => {
    if (!severities.includes(e.severity)) return false;
    if (!ontologyClasses.includes(e.ontology_class)) return false;
    if (!sourcesVisible.includes(e.source_type)) return false;
    if (verificationStatus !== 'all' && e.verification_status !== verificationStatus) return false;
    if (regionIds.length > 0 && !regionIds.includes(e.region_id)) return false;
    return true;
  });
};

export const selectEventsByRegion = (regionId: string): HipEvent[] => {
  return PLACEHOLDER_EVENTS.filter(e => e.region_id === regionId);
};

export const selectSubmissionsByStatus = (status: string) => {
  // Placeholder — wired to real data by backend
  return [];
};

export const selectVisibleNGOZones = (): NGO[] => {
  const { ngoZoneIds } = useFilterStore.getState();
  if (ngoZoneIds.length === 0) return PLACEHOLDER_NGOS;
  return PLACEHOLDER_NGOS.filter((n) => ngoZoneIds.includes(n.id));
};

export const selectNGOById = (id: string): NGO | undefined =>
  PLACEHOLDER_NGOS.find((n) => n.id === id);

export const selectIncidentById = (id: string | null): Incident | undefined =>
  id ? PLACEHOLDER_INCIDENTS.find((i) => i.id === id) : undefined;

export const selectEventById = (id: string | null): HipEvent | undefined =>
  id ? PLACEHOLDER_EVENTS.find((e) => e.id === id) : undefined;

export const selectDroneById = (id: string | null): Drone | undefined =>
  id ? PLACEHOLDER_DRONES.find((d) => d.id === id) : undefined;
