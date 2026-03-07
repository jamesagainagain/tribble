import { create } from 'zustand';
import type { HeliosStream } from '@/types';

interface UISlice {
  rightPanelOpen: boolean;
  rightPanelWidth: number;
  rightPanelTab: 'agent' | 'news_feed' | 'drone_ops';
  filterPanelOpen: boolean;
  commandPaletteOpen: boolean;
  timelineOpen: boolean;
  selectedIncidentId: string | null;
  selectedEventId: string | null;
  selectedSubmissionId: string | null;
  selectedDroneId: string | null;
  sidebarExpanded: boolean;
  riskViewActive: boolean;
  submissionQueueOpen: boolean;
  heliosStream: HeliosStream;
  activeConflictZoneId: string | null;
  setRightPanelOpen: (open: boolean) => void;
  setRightPanelWidth: (width: number) => void;
  setRightPanelTab: (tab: 'agent' | 'news_feed' | 'drone_ops') => void;
  setFilterPanelOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setTimelineOpen: (open: boolean) => void;
  setSelectedIncidentId: (id: string | null) => void;
  setSelectedEventId: (id: string | null) => void;
  setSelectedSubmissionId: (id: string | null) => void;
  setSelectedDroneId: (id: string | null) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  setRiskViewActive: (active: boolean) => void;
  setSubmissionQueueOpen: (open: boolean) => void;
  setHeliosStream: (stream: HeliosStream) => void;
  setActiveConflictZoneId: (id: string | null) => void;
}

export const useUIStore = create<UISlice>((set) => ({
  rightPanelOpen: false,
  rightPanelWidth: 380,
  rightPanelTab: 'agent',
  filterPanelOpen: false,
  commandPaletteOpen: false,
  timelineOpen: false,
  selectedIncidentId: null,
  selectedEventId: null,
  selectedSubmissionId: null,
  selectedDroneId: null,
  sidebarExpanded: false,
  riskViewActive: false,
  submissionQueueOpen: false,
  heliosStream: 'A',
  activeConflictZoneId: null,
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  setRightPanelWidth: (width) => set({ rightPanelWidth: width }),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  setFilterPanelOpen: (open) => set({ filterPanelOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setTimelineOpen: (open) => set({ timelineOpen: open }),
  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),
  setSelectedEventId: (id) => set({ selectedEventId: id }),
  setSelectedSubmissionId: (id) => set({ selectedSubmissionId: id }),
  setSelectedDroneId: (id) => set({ selectedDroneId: id }),
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  setRiskViewActive: (active) => set({ riskViewActive: active }),
  setSubmissionQueueOpen: (open) => set({ submissionQueueOpen: open }),
  setHeliosStream: (stream) => set({ heliosStream: stream }),
  setActiveConflictZoneId: (id) => set({ activeConflictZoneId: id }),
}));
