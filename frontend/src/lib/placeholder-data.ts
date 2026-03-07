import type { Incident, Drone, FlightPathSegment, NGO, Settlement, AgentMessage, HipEvent, UserSubmission, NewsEvent, PipelineHealth } from '@/types';
import type { Zone, Boundary } from '@/types/zone';
import type { Region } from '@/types/region';
import {
  DARFUR_BORDER,
  KHARTOUM_STATE_BORDER,
  EL_FASHER_SIEGE,
  EL_GENEINA_ZONE,
  GEZIRA_STATE_BORDER,
  KORDOFAN_CORRIDOR,
  PORT_SUDAN_CORRIDOR,
} from '@/lib/sudan-zones';

export const PLACEHOLDER_INCIDENTS: Incident[] = [
  { id: 'INC-0042', type: 'armed_conflict', severity: 'critical', lat: 15.50, lng: 32.56, location_name: 'Khartoum, Sudan', timestamp: '2024-11-15T06:32:00Z', description: 'RSF advances on SAF positions in Bahri district. Heavy artillery and airstrikes reported.', verification_status: 'verified', verified_by: 'ANA-007', assigned_ngo_ids: ['NGO-001'], risk_score: 96, related_incident_ids: ['INC-0038'] },
  { id: 'INC-0038', type: 'displacement', severity: 'critical', lat: 13.63, lng: 25.35, location_name: 'El Fasher, North Darfur', timestamp: '2024-11-14T14:10:00Z', description: 'RSF siege intensifies. 50,000+ civilians trapped. Hospital struck.', verification_status: 'verified', verified_by: 'ANA-003', assigned_ngo_ids: ['NGO-001', 'NGO-003'], risk_score: 94, related_incident_ids: ['INC-0042'] },
  { id: 'INC-0051', type: 'infrastructure_damage', severity: 'high', lat: 15.65, lng: 32.48, location_name: 'Omdurman Bridge, Khartoum', timestamp: '2024-11-15T09:15:00Z', description: 'Last functioning Nile bridge crossing in Khartoum confirmed destroyed by airstrikes.', verification_status: 'verified', verified_by: 'ANA-005', assigned_ngo_ids: ['NGO-002'], risk_score: 88, related_incident_ids: [] },
  { id: 'INC-0055', type: 'aid_obstruction', severity: 'high', lat: 14.40, lng: 33.52, location_name: 'Wad Medani, Gezira State', timestamp: '2024-11-15T11:40:00Z', description: 'RSF looting of food warehouses. WFP operations suspended.', verification_status: 'verified', verified_by: 'ANA-003', assigned_ngo_ids: ['NGO-002'], risk_score: 78, related_incident_ids: [] },
  { id: 'INC-0060', type: 'disease_outbreak', severity: 'medium', lat: 13.45, lng: 22.44, location_name: 'El Geneina, West Darfur', timestamp: '2024-11-13T08:00:00Z', description: 'Cholera outbreak among displaced populations. 200+ cases. Medical infrastructure non-existent.', verification_status: 'verified', verified_by: 'ANA-011', assigned_ngo_ids: ['NGO-004'], risk_score: 72, related_incident_ids: [] },
  { id: 'INC-0063', type: 'natural_disaster', severity: 'low', lat: 19.60, lng: 37.22, location_name: 'Port Sudan', timestamp: '2024-11-12T17:30:00Z', description: 'Port congestion delays humanitarian shipments. 15,000 tonnes of supplies backlogged.', verification_status: 'verified', verified_by: 'ANA-005', assigned_ngo_ids: ['NGO-005'], risk_score: 35, related_incident_ids: [] },
];

export const PLACEHOLDER_DRONES: Drone[] = [
  { id: 'DRN-001', status: 'active', battery_pct: 78, position: { lat: 15.50, lng: 32.40, altitude_m: 120, speed_kmh: 45, heading_deg: 47 }, current_mission: { id: 'MSN-019', type: 'reconnaissance', status: 'active', target_lat: 15.50, target_lng: 32.56, started_at: '2024-11-15T05:50:00Z' }, signal: 'strong' },
  { id: 'DRN-002', status: 'standby', battery_pct: 100, position: { lat: 19.60, lng: 37.22, altitude_m: 0, speed_kmh: 0, heading_deg: 210 }, signal: 'strong' },
  { id: 'DRN-003', status: 'low_battery', battery_pct: 14, position: { lat: 13.80, lng: 25.10, altitude_m: 85, speed_kmh: 30, heading_deg: 290 }, current_mission: { id: 'MSN-017', type: 'perimeter_survey', status: 'active', started_at: '2024-11-15T04:00:00Z' }, signal: 'weak' },
  { id: 'DRN-004', status: 'lost_signal', battery_pct: 43, position: { lat: 13.45, lng: 22.44, altitude_m: 0, speed_kmh: 0, heading_deg: 135 }, signal: 'lost' },
];

export const PLACEHOLDER_FLIGHT_PATHS: FlightPathSegment[] = [
  { drone_id: 'DRN-001', coordinates: [[32.20, 15.40], [32.30, 15.45], [32.40, 15.50]], segment_type: 'completed' },
  { drone_id: 'DRN-001', coordinates: [[32.40, 15.50], [32.48, 15.55], [32.56, 15.60]], segment_type: 'planned' },
  { drone_id: 'DRN-003', coordinates: [[24.80, 13.50], [24.95, 13.60], [25.10, 13.80]], segment_type: 'completed' },
];

export const PLACEHOLDER_NGOS: NGO[] = [
  { id: 'NGO-001', name: 'MSF', abbreviation: 'MSF', zone_name: 'Greater Darfur', colour: '#00D4FF', zone_geojson: { type: 'Feature', properties: { id: 'NGO-001', name: 'Greater Darfur' }, geometry: { type: 'Polygon', coordinates: [DARFUR_BORDER] } } },
  { id: 'NGO-002', name: 'OCHA', abbreviation: 'OCHA', zone_name: 'Khartoum / Gezira', colour: '#7B61FF', zone_geojson: { type: 'Feature', properties: { id: 'NGO-002', name: 'Khartoum / Gezira' }, geometry: { type: 'Polygon', coordinates: [KHARTOUM_STATE_BORDER] } } },
  { id: 'NGO-003', name: 'UNHCR', abbreviation: 'UNHCR', zone_name: 'El Fasher Operations', colour: '#00FF88', zone_geojson: { type: 'Feature', properties: { id: 'NGO-003', name: 'El Fasher Operations' }, geometry: { type: 'Polygon', coordinates: [EL_FASHER_SIEGE] } } },
  { id: 'NGO-004', name: 'ICRC', abbreviation: 'ICRC', zone_name: 'Kordofan Corridor', colour: '#FF9500', zone_geojson: { type: 'Feature', properties: { id: 'NGO-004', name: 'Kordofan Corridor' }, geometry: { type: 'Polygon', coordinates: [KORDOFAN_CORRIDOR] } } },
  { id: 'NGO-005', name: 'WFP', abbreviation: 'WFP', zone_name: 'Port Sudan Hub', colour: '#FF6B35', zone_geojson: { type: 'Feature', properties: { id: 'NGO-005', name: 'Port Sudan Hub' }, geometry: { type: 'Polygon', coordinates: [PORT_SUDAN_CORRIDOR] } } },
];

export const PLACEHOLDER_SETTLEMENTS: Settlement[] = [
  { id: 'SET-001', name: 'Khartoum', population_estimate: 5200000, risk_score: 96, assigned_ngo_ids: ['NGO-002'], geojson: { type: 'Feature', properties: { id: 'SET-001', name: 'Khartoum', risk_score: 96 }, geometry: { type: 'Polygon', coordinates: [[[32.45, 15.55], [32.55, 15.50], [32.65, 15.55], [32.65, 15.65], [32.55, 15.70], [32.45, 15.65], [32.45, 15.55]]] } } },
  { id: 'SET-002', name: 'El Fasher', population_estimate: 264000, risk_score: 94, assigned_ngo_ids: ['NGO-001', 'NGO-003'], geojson: { type: 'Feature', properties: { id: 'SET-002', name: 'El Fasher', risk_score: 94 }, geometry: { type: 'Polygon', coordinates: [[[25.28, 13.58], [25.38, 13.55], [25.45, 13.60], [25.42, 13.70], [25.32, 13.72], [25.25, 13.65], [25.28, 13.58]]] } } },
  { id: 'SET-003', name: 'Wad Medani', population_estimate: 350000, risk_score: 82, assigned_ngo_ids: ['NGO-002'], geojson: { type: 'Feature', properties: { id: 'SET-003', name: 'Wad Medani', risk_score: 82 }, geometry: { type: 'Polygon', coordinates: [[[33.48, 14.35], [33.58, 14.32], [33.62, 14.42], [33.55, 14.50], [33.45, 14.48], [33.42, 14.40], [33.48, 14.35]]] } } },
  { id: 'SET-004', name: 'El Geneina', population_estimate: 130000, risk_score: 99, assigned_ngo_ids: ['NGO-001'], geojson: { type: 'Feature', properties: { id: 'SET-004', name: 'El Geneina', risk_score: 99 }, geometry: { type: 'Polygon', coordinates: [[[22.40, 13.42], [22.50, 13.40], [22.55, 13.48], [22.50, 13.55], [22.42, 13.52], [22.38, 13.48], [22.40, 13.42]]] } } },
  { id: 'SET-005', name: 'Port Sudan', population_estimate: 490000, risk_score: 20, assigned_ngo_ids: ['NGO-005'], geojson: { type: 'Feature', properties: { id: 'SET-005', name: 'Port Sudan', risk_score: 20 }, geometry: { type: 'Polygon', coordinates: [[[37.15, 19.55], [37.25, 19.52], [37.32, 19.58], [37.28, 19.68], [37.18, 19.68], [37.12, 19.62], [37.15, 19.55]]] } } },
];

export const PLACEHOLDER_ARCS = [
  { source: [32.56, 15.50], target: [37.22, 19.60] },  // Khartoum → Port Sudan evacuation
  { source: [25.35, 13.63], target: [21.00, 13.47] },  // El Fasher → Chad border (Adré)
  { source: [33.52, 14.40], target: [32.56, 15.50] },  // Wad Medani → Khartoum
  { source: [22.44, 13.45], target: [25.35, 13.63] },  // El Geneina → El Fasher
];

export const PLACEHOLDER_AGENT_MESSAGES: AgentMessage[] = [
  { id: 'msg-001', role: 'user', content: 'What is the current situation in Khartoum?', timestamp: '2024-11-15T06:40:00Z' },
  { id: 'msg-002', role: 'agent', content: [
    { type: 'text_block', payload: { text: 'Situation report for **Khartoum State** as of 06:45 UTC. RSF controls most of Omdurman and Bahri. SAF holds central Khartoum. Infrastructure is 80% destroyed. Risk score: **96/100**.' } },
    { type: 'event_card', payload: { event_id: 'EVT-0042' } },
    { type: 'risk_summary', payload: { region: 'Khartoum State', score: 96, trend: 'rising', factors: ['RSF advancing on SAF positions in Bahri', 'All Nile bridges destroyed or contested', 'Civilian population trapped — 2.1M displaced'] } },
    { type: 'map_command', payload: { action: 'flyTo', lat: 15.50, lng: 32.56, zoom: 9, label: 'Khartoum' } },
    { type: 'source_citations', payload: { sources: [{ label: 'OCHA Flash Update #47', confidence: 95 }, { label: 'Satellite Pass 2024-11-14', confidence: 91 }, { label: 'Field Analyst ANA-007', confidence: 96 }] } },
  ], timestamp: '2024-11-15T06:45:00Z' },
  { id: 'msg-003', role: 'user', content: 'Dispatch a drone to verify INC-0051.', timestamp: '2024-11-15T06:50:00Z' },
  { id: 'msg-004', role: 'agent', content: [
    { type: 'dispatch_confirm', payload: { drone_id: 'DRN-002', target_lat: 15.65, target_lng: 32.48, incident_id: 'INC-0051', location_label: 'Omdurman Bridge, Khartoum' } },
  ], timestamp: '2024-11-15T06:50:30Z' },
  { id: 'msg-005', role: 'user', content: 'Show me incident trend data for the last 30 days.', timestamp: '2024-11-15T07:00:00Z' },
  { id: 'msg-006', role: 'agent', content: [
    { type: 'chart_block', payload: { title: 'Incident Trend — Last 30 Days' } },
    { type: 'source_citations', payload: { sources: [{ label: 'Ground Report GR-2291', confidence: 92 }, { label: 'Satellite Pass 2024-11-14', confidence: 87 }, { label: 'Field Analyst ANA-007', confidence: 96 }] } },
  ], timestamp: '2024-11-15T07:00:30Z' },
];

export const PLACEHOLDER_USER = {
  id: 'USR-001',
  name: 'Sarah Chen',
  email: 'sarah.chen@msf.org',
  organisation: 'MSF',
  role: 'analyst' as const,
  ngo_id: 'NGO-001',
  avatar_initials: 'SC',
};

// ═══════════════════════════════════════════════════════════════
// NEW PLACEHOLDER DATA — Ontology-based events, zones, etc.
// ═══════════════════════════════════════════════════════════════

export const PLACEHOLDER_EVENTS: HipEvent[] = [
  {
    id: 'EVT-0042', ontology_class: 'armed_conflict', severity: 'critical', lat: 15.50, lng: 32.56,
    region_id: 'REG-002', location_name: 'Khartoum, Sudan', timestamp: '2024-11-15T06:32:00Z',
    description: 'RSF advances on SAF positions in Bahri district. Heavy artillery and airstrikes reported.',
    source_type: 'drone', source_label: 'DRN-001', confidence_score: 0.94,
    verification_status: 'verified', verified_by: 'ANA-007', verified_at: '2024-11-15T06:45:00Z',
    assigned_ngo_ids: ['NGO-002'], related_event_ids: ['EVT-0038'], last_updated: '2024-11-15T06:45:00Z',
  },
  {
    id: 'EVT-0038', ontology_class: 'displacement_mass', severity: 'critical', lat: 13.63, lng: 25.35,
    region_id: 'REG-001', location_name: 'El Fasher, North Darfur', timestamp: '2024-11-14T14:10:00Z',
    description: 'RSF siege intensifies. 50,000+ civilians trapped. Hospital struck by shelling.',
    source_type: 'satellite', source_label: 'Satellite Pass 2024-11-14', confidence_score: 0.91,
    verification_status: 'verified', verified_by: 'ANA-003',
    assigned_ngo_ids: ['NGO-001', 'NGO-003'], related_event_ids: ['EVT-0042'], last_updated: '2024-11-14T15:00:00Z',
  },
  {
    id: 'EVT-0051', ontology_class: 'bridge_damaged', severity: 'high', lat: 15.65, lng: 32.48,
    region_id: 'REG-002', location_name: 'Omdurman Bridge, Khartoum', timestamp: '2024-11-15T09:15:00Z',
    description: 'Last functioning Nile bridge crossing destroyed by airstrikes. Khartoum effectively bisected.',
    source_type: 'satellite', source_label: 'Satellite Pass 2024-11-15', confidence_score: 0.88,
    verification_status: 'verified', verified_by: 'ANA-005',
    assigned_ngo_ids: ['NGO-002'], related_event_ids: [], last_updated: '2024-11-15T09:15:00Z',
  },
  {
    id: 'EVT-0055', ontology_class: 'aid_obstruction', severity: 'high', lat: 14.40, lng: 33.52,
    region_id: 'REG-003', location_name: 'Wad Medani, Gezira State', timestamp: '2024-11-15T11:40:00Z',
    description: 'RSF looting of WFP food warehouses. All humanitarian operations suspended.',
    source_type: 'analyst_input', source_label: 'ANA-003', confidence_score: 0.82,
    verification_status: 'verified', verified_by: 'ANA-003',
    assigned_ngo_ids: ['NGO-002'], related_event_ids: [], last_updated: '2024-11-15T11:40:00Z',
  },
  {
    id: 'EVT-0060', ontology_class: 'disease_outbreak', severity: 'medium', lat: 13.45, lng: 22.44,
    region_id: 'REG-001', location_name: 'El Geneina, West Darfur', timestamp: '2024-11-13T08:00:00Z',
    description: 'Cholera outbreak among displaced populations. 200+ cases. No medical infrastructure.',
    source_type: 'news_agent', source_label: 'Reuters', confidence_score: 0.72,
    verification_status: 'verified', verified_by: 'ANA-011',
    assigned_ngo_ids: ['NGO-001'], related_event_ids: [], last_updated: '2024-11-13T10:00:00Z',
  },
  {
    id: 'EVT-0063', ontology_class: 'food_distribution', severity: 'low', lat: 19.60, lng: 37.22,
    region_id: 'REG-005', location_name: 'Port Sudan', timestamp: '2024-11-12T17:30:00Z',
    description: 'WFP distribution hub operational. 15,000 tonnes of supplies being processed.',
    source_type: 'analyst_input', source_label: 'ANA-005', confidence_score: 0.95,
    verification_status: 'verified', verified_by: 'ANA-005',
    assigned_ngo_ids: ['NGO-005'], related_event_ids: [], last_updated: '2024-11-12T18:00:00Z',
  },
  {
    id: 'EVT-0068', ontology_class: 'armed_conflict', severity: 'high', lat: 13.18, lng: 30.22,
    region_id: 'REG-004', location_name: 'El Obeid, North Kordofan', timestamp: '2024-11-15T08:00:00Z',
    description: 'SAF airstrikes on RSF positions. Civilian casualties reported in market area.',
    source_type: 'news_agent', source_label: 'Al Jazeera', confidence_score: 0.78,
    verification_status: 'verified', verified_by: 'ANA-007',
    assigned_ngo_ids: ['NGO-004'], related_event_ids: [], last_updated: '2024-11-15T08:00:00Z',
  },
  {
    id: 'EVT-0071', ontology_class: 'suspicious_activity', severity: 'medium', lat: 12.05, lng: 24.88,
    region_id: 'REG-001', location_name: 'Nyala, South Darfur', timestamp: '2024-11-15T03:20:00Z',
    description: 'RSF vehicle convoy moving toward El Fasher. Estimated 40+ technicals observed.',
    source_type: 'drone', source_label: 'DRN-003', confidence_score: 0.65,
    verification_status: 'unverified',
    assigned_ngo_ids: [], related_event_ids: [], last_updated: '2024-11-15T03:20:00Z',
  },
];

export const PLACEHOLDER_REGIONS: Region[] = [
  {
    id: 'REG-001', name: 'Greater Darfur', risk_score: 96, risk_tier: 'extreme',
    active_event_count: 58, last_updated: '2024-11-15T06:45:00Z',
    geojson: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [DARFUR_BORDER] } },
  },
  {
    id: 'REG-002', name: 'Khartoum State', risk_score: 94, risk_tier: 'extreme',
    active_event_count: 47, last_updated: '2024-11-15T09:15:00Z',
    geojson: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [KHARTOUM_STATE_BORDER] } },
  },
  {
    id: 'REG-003', name: 'Gezira State', risk_score: 82, risk_tier: 'high',
    active_event_count: 22, last_updated: '2024-11-15T08:00:00Z',
    geojson: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [GEZIRA_STATE_BORDER] } },
  },
  {
    id: 'REG-004', name: 'Kordofan Corridor', risk_score: 72, risk_tier: 'high',
    active_event_count: 15, last_updated: '2024-11-14T14:10:00Z',
    geojson: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [KORDOFAN_CORRIDOR] } },
  },
  {
    id: 'REG-005', name: 'Port Sudan Safe Zone', risk_score: 25, risk_tier: 'low',
    active_event_count: 2, last_updated: '2024-11-12T17:30:00Z',
    geojson: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [PORT_SUDAN_CORRIDOR] } },
  },
];

export const PLACEHOLDER_ZONES: Zone[] = [
  {
    id: 'ZON-001', zone_type: 'conflict_zone', name: 'Active Conflict — Greater Darfur',
    geojson: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [DARFUR_BORDER] } },
    risk_score: 96, confidence_score: 0.92, source_type: 'analyst_input', last_updated: '2024-11-15T06:00:00Z',
  },
  {
    id: 'ZON-002', zone_type: 'conflict_zone', name: 'Active Conflict — Khartoum State',
    geojson: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [KHARTOUM_STATE_BORDER] } },
    risk_score: 94, confidence_score: 0.95, source_type: 'analyst_input', last_updated: '2024-11-15T06:00:00Z',
  },
  {
    id: 'ZON-003', zone_type: 'no_go_zone', name: 'No-Go — El Fasher Siege Zone',
    geojson: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [EL_FASHER_SIEGE] } },
    risk_score: 98, confidence_score: 0.95, source_type: 'satellite', last_updated: '2024-11-15T00:00:00Z',
  },
  {
    id: 'ZON-004', zone_type: 'no_go_zone', name: 'No-Go — El Geneina (Destroyed)',
    geojson: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [EL_GENEINA_ZONE] } },
    risk_score: 99, confidence_score: 0.98, source_type: 'analyst_input', last_updated: '2024-11-15T00:00:00Z',
  },
  {
    id: 'ZON-005', zone_type: 'contested_territory', name: 'Contested — Gezira State (RSF-held)',
    geojson: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [GEZIRA_STATE_BORDER] } },
    risk_score: 82, confidence_score: 0.88, source_type: 'satellite', last_updated: '2024-11-14T16:00:00Z',
  },
  {
    id: 'ZON-006', zone_type: 'contested_territory', name: 'Contested — Kordofan Corridor',
    geojson: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [KORDOFAN_CORRIDOR] } },
    risk_score: 72, confidence_score: 0.75, source_type: 'analyst_input', last_updated: '2024-11-14T12:00:00Z',
  },
  {
    id: 'ZON-007', zone_type: 'safe_zone', name: 'Safe Zone — Port Sudan Corridor',
    geojson: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [PORT_SUDAN_CORRIDOR] } },
    risk_score: 15, controlling_entity: 'SAF / Government of Sudan', confidence_score: 0.91, source_type: 'analyst_input', last_updated: '2024-11-15T07:00:00Z',
  },
];

export const PLACEHOLDER_BOUNDARIES: Boundary[] = [
  {
    id: 'BND-001', boundary_type: 'frontline_active', name: 'Khartoum Frontline — SAF vs RSF',
    geojson: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[32.30, 15.70], [32.45, 15.62], [32.55, 15.58], [32.70, 15.55], [32.85, 15.50]] } },
    advance_direction: 180, confidence_score: 0.88, last_updated: '2024-11-15T05:00:00Z',
  },
  {
    id: 'BND-002', boundary_type: 'frontline_active', name: 'El Fasher Siege Perimeter',
    geojson: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[25.00, 13.90], [25.20, 13.75], [25.50, 13.70], [25.80, 13.80], [25.95, 14.00]] } },
    advance_direction: 0, confidence_score: 0.82, last_updated: '2024-11-15T05:00:00Z',
  },
  {
    id: 'BND-003', boundary_type: 'disputed_border', name: 'RSF / SAF Control Line — Kordofan',
    geojson: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[29.00, 13.50], [30.00, 14.00], [31.00, 14.50], [31.50, 15.00]] } },
    confidence_score: 0.65, last_updated: '2024-11-12T00:00:00Z',
  },
];

export const PLACEHOLDER_NEWS_EVENTS: NewsEvent[] = [
  {
    id: 'NEWS-001', source_name: 'Reuters', headline: 'RSF advances in Bahri district amid heavy fighting',
    agent_summary: 'RSF forces have advanced positions in Bahri (Khartoum North) following overnight operations. SAF responding with airstrikes. Civilian casualties reported.',
    article_url: 'https://reuters.com/example-1', lat: 15.65, lng: 32.55, region_id: 'REG-002',
    ontology_class: 'armed_conflict', severity: 'critical', confidence_score: 0.92, ingested_at: '2024-11-15T06:20:00Z',
  },
  {
    id: 'NEWS-002', source_name: 'MSF', headline: 'El Fasher hospital struck — 12 casualties confirmed',
    agent_summary: 'MSF confirms South Hospital in El Fasher struck by shelling. Facility non-operational. 12 casualties including 3 medical staff.',
    article_url: 'https://msf.org/example-2', lat: 13.63, lng: 25.35, region_id: 'REG-001',
    ontology_class: 'armed_conflict', severity: 'critical', confidence_score: 0.95, ingested_at: '2024-11-14T22:00:00Z',
  },
  {
    id: 'NEWS-003', source_name: 'OCHA', headline: 'Famine declared in parts of Greater Darfur',
    agent_summary: 'UN declares famine conditions in North Darfur camps. 25 million people across Sudan face acute food insecurity — largest hunger crisis globally.',
    article_url: 'https://unocha.org/example-3', lat: 14.50, lng: 24.00, region_id: 'REG-001',
    ontology_class: 'displacement_mass', severity: 'critical', confidence_score: 0.98, ingested_at: '2024-11-14T16:30:00Z',
  },
  {
    id: 'NEWS-004', source_name: 'Al Jazeera', headline: 'RSF loots Gezira food warehouses; WFP suspends operations',
    agent_summary: 'RSF fighters systematically loot WFP food warehouses in Wad Medani. All humanitarian operations in Gezira State suspended indefinitely.',
    article_url: 'https://aljazeera.com/example-4', lat: 14.40, lng: 33.52, region_id: 'REG-003',
    ontology_class: 'aid_obstruction', severity: 'high', confidence_score: 0.88, ingested_at: '2024-11-15T10:00:00Z',
  },
  {
    id: 'NEWS-005', source_name: 'ICRC', headline: 'Port Sudan receives 200 tonnes of medical supplies',
    agent_summary: 'ICRC shipment arrives at Port Sudan via Red Sea corridor. Distribution to inland facilities depends on access negotiations.',
    article_url: 'https://icrc.org/example-5', lat: 19.60, lng: 37.22, region_id: 'REG-005',
    ontology_class: 'food_distribution', severity: 'low', confidence_score: 0.95, ingested_at: '2024-11-12T19:00:00Z',
  },
];

export const PLACEHOLDER_SUBMISSIONS: UserSubmission[] = [
  {
    id: 'RPT-20241115-0847', submitter_id: 'USR-IND-001', is_anonymous: false,
    ontology_class_suggested: 'aid_obstruction', severity_suggested: 'high',
    lat: 14.40, lng: 33.52, region_id: 'REG-003',
    description: 'RSF soldiers looting food warehouse in Wad Medani. Civilians fleeing south.',
    submitted_at: '2024-11-15T11:03:00Z', status: 'pending',
    helios_confidence: 0.61, helios_similar_event_id: 'EVT-0055',
  },
  {
    id: 'RPT-20241115-0912', submitter_id: 'USR-IND-002', is_anonymous: true,
    ontology_class_suggested: 'armed_conflict', severity_suggested: 'critical',
    lat: 15.65, lng: 32.48, region_id: 'REG-002',
    description: 'Heavy shelling on Omdurman bridge. Bodies visible in the river.',
    submitted_at: '2024-11-15T09:12:00Z', status: 'in_review', reviewed_by: 'ANA-003',
    helios_confidence: 0.78, helios_similar_event_id: 'EVT-0042',
  },
  {
    id: 'RPT-20241114-1630', submitter_id: 'USR-IND-003', is_anonymous: false,
    ontology_class_suggested: 'water_contamination', severity_suggested: 'medium',
    lat: 13.45, lng: 22.44, region_id: 'REG-001',
    description: 'No clean water in El Geneina camp. Many children sick with diarrhoea.',
    submitted_at: '2024-11-14T16:30:00Z', status: 'verified', reviewed_by: 'ANA-011',
    linked_event_id: 'EVT-0060', helios_confidence: 0.88,
  },
  {
    id: 'RPT-20241113-0800', submitter_id: 'USR-IND-004', is_anonymous: false,
    ontology_class_suggested: 'displacement_mass', severity_suggested: 'high',
    lat: 13.63, lng: 25.35, region_id: 'REG-001',
    description: 'Thousands arriving at El Fasher from Nyala. No food, no shelter.',
    submitted_at: '2024-11-13T08:00:00Z', status: 'verified', reviewed_by: 'ANA-005',
    linked_event_id: 'EVT-0038', helios_confidence: 0.85,
  },
];

export const PLACEHOLDER_PIPELINE_HEALTH: PipelineHealth[] = [
  { source_type: 'news_agent', status: 'running', last_event_at: '2024-11-15T11:58:00Z', events_today: 847 },
  { source_type: 'user_submission', status: 'running', last_event_at: '2024-11-15T11:55:00Z', events_today: 14, notes: 'Queue depth: normal' },
  { source_type: 'satellite', status: 'degraded', last_event_at: '2024-11-15T11:42:00Z', events_today: 23, notes: 'Compression latency' },
  { source_type: 'weather_api', status: 'running', last_event_at: '2024-11-15T11:56:00Z', events_today: 96 },
  { source_type: 'drone', status: 'running', last_event_at: '2024-11-15T11:59:00Z', events_today: 342, notes: '4 active drones' },
  { source_type: 'analyst_input', status: 'running', last_event_at: '2024-11-15T11:50:00Z', events_today: 18, notes: '3 analysts online' },
];
