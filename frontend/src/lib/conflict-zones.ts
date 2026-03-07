/**
 * Active Conflict Zones — clickable regions that zoom in and show filtered news.
 * Each zone has a bounding box, center, and curated strategic route data.
 */

export interface ConflictZone {
  id: string;
  name: string;
  region: string;
  severity: 'critical' | 'high' | 'medium';
  center: [number, number]; // [lng, lat]
  zoom: number;             // target zoom when clicked
  bbox: [[number, number], [number, number]]; // [sw, ne]
  activeIncidents: number;
  displaced: string;
  description: string;
  routes: StrategicRoute[];
  newsKeywords: string[];
}

export interface StrategicRoute {
  id: string;
  name: string;
  status: 'open' | 'contested' | 'blocked' | 'destroyed';
  type: 'highway' | 'supply_corridor' | 'border_crossing' | 'bridge' | 'airstrip';
  coords: [number, number][]; // [lng, lat] pairs
  notes?: string;
}

const ROUTE_COLORS: Record<StrategicRoute['status'], string> = {
  open: 'hsl(var(--hip-green))',
  contested: 'hsl(var(--hip-warn))',
  blocked: 'hsl(var(--hip-high))',
  destroyed: 'hsl(var(--hip-critical))',
};

const ROUTE_DASH: Record<StrategicRoute['status'], string> = {
  open: '',
  contested: '6 3',
  blocked: '4 4',
  destroyed: '2 2',
};

export { ROUTE_COLORS, ROUTE_DASH };

import {
  DARFUR_BORDER,
  KHARTOUM_STATE_BORDER,
  EL_FASHER_SIEGE,
  EL_GENEINA_ZONE,
  GEZIRA_STATE_BORDER,
  KORDOFAN_CORRIDOR,
  PORT_SUDAN_CORRIDOR,
} from './sudan-zones';

export const CONFLICT_ZONES: ConflictZone[] = [
  // ═══════════════════════════════════════════
  // SUDAN — Khartoum State (primary focus)
  // ═══════════════════════════════════════════
  {
    id: 'CZ-SUDAN-KHARTOUM',
    name: 'Khartoum State',
    region: 'Sudan',
    severity: 'critical',
    center: [32.56, 15.50],
    zoom: 8,
    bbox: [[31.90, 14.90], [33.30, 16.15]],
    activeIncidents: 47,
    displaced: '2.1M',
    description: 'SAF vs RSF urban warfare. Infrastructure destroyed. Bridges blocked. Entire state depopulated.',
    newsKeywords: ['khartoum', 'sudan', 'RSF', 'SAF', 'omdurman', 'bahri'],
    routes: [
      { id: 'RT-SD-001', name: 'Khartoum–Port Sudan Highway', status: 'contested', type: 'highway',
        coords: [[32.56, 15.5], [33.0, 16.0], [33.8, 17.0], [34.5, 18.0], [36.0, 19.0], [37.2, 19.6]],
        notes: 'Primary evacuation corridor. RSF checkpoints at km 45, 120.' },
      { id: 'RT-SD-002', name: 'Omdurman Bridge Crossing', status: 'destroyed', type: 'bridge',
        coords: [[32.45, 15.65], [32.50, 15.62], [32.55, 15.60]],
        notes: 'Destroyed April 2024. No alternative crossing.' },
      { id: 'RT-SD-003', name: 'Khartoum–Wad Medani Road', status: 'blocked', type: 'highway',
        coords: [[32.56, 15.5], [32.8, 14.8], [33.2, 14.4], [33.5, 14.4]],
        notes: 'RSF controlled since Dec 2023.' },
      { id: 'RT-SD-004', name: 'Khartoum Airport', status: 'destroyed', type: 'airstrip',
        coords: [[32.55, 15.59], [32.56, 15.59]],
        notes: 'Runway cratered. Non-operational.' },
    ],
  },
  // ═══════════════════════════════════════════
  // SUDAN — Greater Darfur (5 states combined)
  // ═══════════════════════════════════════════
  {
    id: 'CZ-SUDAN-DARFUR',
    name: 'Greater Darfur',
    region: 'Sudan',
    severity: 'critical',
    center: [25.00, 13.50],
    zoom: 5.5,
    bbox: [[20.50, 9.00], [28.00, 20.50]],
    activeIncidents: 58,
    displaced: '3.8M',
    description: 'RSF controls most of Darfur. El Fasher under siege. El Geneina destroyed. Mass ethnic cleansing documented.',
    newsKeywords: ['darfur', 'el fasher', 'el geneina', 'RSF', 'janjaweed', 'nyala', 'zalingei'],
    routes: [
      { id: 'RT-DF-001', name: 'El Fasher–Nyala Road', status: 'blocked', type: 'highway',
        coords: [[25.35, 13.63], [25.0, 13.0], [24.9, 12.5], [24.88, 12.05]],
        notes: 'RSF blockade. No aid convoys since March.' },
      { id: 'RT-DF-002', name: 'El Fasher–El Geneina Corridor', status: 'contested', type: 'supply_corridor',
        coords: [[25.35, 13.63], [24.0, 13.5], [23.0, 13.4], [22.44, 13.45]],
        notes: 'Sporadic clashes. High-risk corridor.' },
      { id: 'RT-DF-003', name: 'Chad Border Crossing – Adré', status: 'open', type: 'border_crossing',
        coords: [[22.0, 13.5], [21.5, 13.5], [21.0, 13.47]],
        notes: 'Main humanitarian entry point. UNHCR operations.' },
      { id: 'RT-DF-004', name: 'El Fasher Airstrip', status: 'contested', type: 'airstrip',
        coords: [[25.32, 13.62], [25.36, 13.64]],
        notes: 'Intermittent operations. Shelling damage.' },
      { id: 'RT-DF-005', name: 'Zalingei–Geneina Road', status: 'blocked', type: 'highway',
        coords: [[23.47, 12.91], [23.0, 13.1], [22.5, 13.3], [22.44, 13.45]],
        notes: 'Ambush risk. Multiple burned vehicles.' },
    ],
  },
  // ═══════════════════════════════════════════
  // SUDAN — Gezira State (RSF-held agricultural heartland)
  // ═══════════════════════════════════════════
  {
    id: 'CZ-SUDAN-GEZIRA',
    name: 'Gezira State',
    region: 'Sudan',
    severity: 'high',
    center: [33.00, 14.00],
    zoom: 7,
    bbox: [[32.00, 13.10], [33.80, 15.10]],
    activeIncidents: 22,
    displaced: '1.2M',
    description: 'RSF occupation. Mass looting of Gezira agricultural scheme. Famine conditions emerging.',
    newsKeywords: ['gezira', 'wad medani', 'RSF', 'famine', 'sudan'],
    routes: [
      { id: 'RT-GZ-001', name: 'Wad Medani–Sennar Road', status: 'contested', type: 'highway',
        coords: [[33.52, 14.40], [33.60, 13.80], [33.62, 13.55]],
        notes: 'RSF checkpoints. Civilian traffic disrupted.' },
      { id: 'RT-GZ-002', name: 'Gezira–Khartoum Highway', status: 'blocked', type: 'highway',
        coords: [[33.52, 14.40], [33.20, 14.80], [32.80, 15.10], [32.56, 15.50]],
        notes: 'Frontline area. No civilian movement.' },
    ],
  },
  // ═══════════════════════════════════════════
  // SUDAN — Kordofan Corridor (contested link between Darfur & Khartoum)
  // ═══════════════════════════════════════════
  {
    id: 'CZ-SUDAN-KORDOFAN',
    name: 'Kordofan Corridor',
    region: 'Sudan',
    severity: 'high',
    center: [30.00, 13.50],
    zoom: 6,
    bbox: [[28.00, 11.50], [32.00, 15.50]],
    activeIncidents: 15,
    displaced: '600K',
    description: 'Contested corridor linking Darfur to central Sudan. SPLM-N activity in south. RSF supply lines.',
    newsKeywords: ['kordofan', 'el obeid', 'kadugli', 'SPLM-N', 'nuba mountains'],
    routes: [
      { id: 'RT-KD-001', name: 'El Obeid–Khartoum Highway', status: 'contested', type: 'highway',
        coords: [[30.22, 13.18], [30.80, 13.80], [31.50, 14.50], [32.00, 15.00]],
        notes: 'Strategic RSF supply route. SAF airstrikes reported.' },
      { id: 'RT-KD-002', name: 'Kadugli–El Obeid Road', status: 'blocked', type: 'highway',
        coords: [[29.72, 11.02], [29.90, 11.80], [30.10, 12.50], [30.22, 13.18]],
        notes: 'SPLM-N controls southern section.' },
    ],
  },
  // ═══════════════════════════════════════════
  // SAHEL — Mali / Burkina Faso / Niger (secondary)
  // ═══════════════════════════════════════════
  {
    id: 'CZ-SAHEL-MALI',
    name: 'Central Sahel',
    region: 'Mali / Burkina Faso / Niger',
    severity: 'high',
    center: [-2.0, 14.0],
    zoom: 4.5,
    bbox: [[-5.0, 10.0], [5.0, 18.0]],
    activeIncidents: 24,
    displaced: '780K',
    description: 'JNIM/ISGS jihadist insurgency. Wagner Group presence. French withdrawal.',
    newsKeywords: ['sahel', 'mali', 'burkina faso', 'JNIM', 'wagner'],
    routes: [
      { id: 'RT-SH-001', name: 'Bamako–Mopti Highway', status: 'contested', type: 'highway',
        coords: [[-8.0, 12.64], [-6.0, 13.0], [-5.0, 13.5], [-4.19, 14.48]],
        notes: 'IED attacks weekly. Military escort zone.' },
      { id: 'RT-SH-002', name: 'Ouagadougou–Djibo Road', status: 'blocked', type: 'highway',
        coords: [[-1.52, 12.37], [-1.5, 13.0], [-1.49, 13.5], [-1.63, 14.1]],
        notes: 'JNIM blockade since 2022. City under siege.' },
      { id: 'RT-SH-003', name: 'Niamey–Tillabéri Corridor', status: 'contested', type: 'supply_corridor',
        coords: [[2.11, 13.51], [1.5, 13.8], [1.2, 14.0], [1.45, 14.21]],
        notes: 'ISGS activity. Aid workers targeted.' },
    ],
  },
  // ═══════════════════════════════════════════
  // CHAD — Lake Chad Basin (secondary)
  // ═══════════════════════════════════════════
  {
    id: 'CZ-CHAD-LAKE',
    name: "Lake Chad Basin",
    region: 'Chad / Nigeria / Niger',
    severity: 'high',
    center: [14.5, 13.3],
    zoom: 5,
    bbox: [[12.0, 11.0], [17.0, 15.5]],
    activeIncidents: 18,
    displaced: '450K',
    description: 'Boko Haram / ISWAP insurgency. Aid routes disrupted. Refugee influx from Sudan.',
    newsKeywords: ['lake chad', 'boko haram', 'ISWAP', 'chad'],
    routes: [
      { id: 'RT-CH-001', name: "N'Djamena–Mao Highway", status: 'open', type: 'highway',
        coords: [[15.06, 12.13], [15.1, 12.8], [15.2, 13.5], [15.3, 14.1]],
        notes: 'Primary aid route. Military escort required north of Massakory.' },
      { id: 'RT-CH-002', name: 'Bol–Baga Sola Road', status: 'contested', type: 'supply_corridor',
        coords: [[14.72, 13.45], [14.5, 13.5], [14.3, 13.6], [14.2, 13.65]],
        notes: 'Boko Haram attacks reported. Convoy schedule suspended.' },
    ],
  },
];

/**
 * Live conflict news ticker items — simulated real-time feed
 */
export interface ConflictNewsItem {
  id: string;
  zoneId: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  headline: string;
  source: string;
  breaking?: boolean;
}

export const CONFLICT_NEWS_FEED: ConflictNewsItem[] = [
  { id: 'CN-001', zoneId: 'CZ-SUDAN-KHARTOUM', timestamp: '2026-03-07T01:45:00Z', severity: 'critical', headline: 'RSF advances on SAF positions in Bahri district — heavy artillery reported', source: 'REUTERS', breaking: true },
  { id: 'CN-002', zoneId: 'CZ-SUDAN-DARFUR', timestamp: '2026-03-07T01:30:00Z', severity: 'critical', headline: 'El Fasher hospital struck — MSF confirms 12 casualties, facility non-operational', source: 'MSF', breaking: true },
  { id: 'CN-003', zoneId: 'CZ-SUDAN-GEZIRA', timestamp: '2026-03-07T01:15:00Z', severity: 'high', headline: 'RSF loots WFP warehouses in Wad Medani — food supplies for 500K destroyed', source: 'WFP' },
  { id: 'CN-004', zoneId: 'CZ-SUDAN-KORDOFAN', timestamp: '2026-03-07T01:00:00Z', severity: 'high', headline: 'SAF airstrikes hit RSF convoy near El Obeid — civilian market damaged', source: 'AL JAZEERA' },
  { id: 'CN-005', zoneId: 'CZ-SUDAN-KHARTOUM', timestamp: '2026-03-07T00:45:00Z', severity: 'high', headline: 'Khartoum water treatment plant damaged — 500K affected', source: 'OCHA' },
  { id: 'CN-006', zoneId: 'CZ-SUDAN-DARFUR', timestamp: '2026-03-07T00:30:00Z', severity: 'medium', headline: 'UNHCR opens new refugee registration at Adré border crossing', source: 'UNHCR' },
  { id: 'CN-007', zoneId: 'CZ-CHAD-LAKE', timestamp: '2026-03-07T00:15:00Z', severity: 'medium', headline: 'Sudanese refugees overwhelm Chad border camps — 50K new arrivals this week', source: 'IOM' },
  { id: 'CN-008', zoneId: 'CZ-SUDAN-DARFUR', timestamp: '2026-03-07T00:00:00Z', severity: 'critical', headline: 'Famine declared in North Darfur — 25M facing acute hunger across Sudan', source: 'UN', breaking: true },
  { id: 'CN-009', zoneId: 'CZ-SUDAN-KHARTOUM', timestamp: '2026-03-06T23:45:00Z', severity: 'medium', headline: 'Port Sudan receives 200 tonnes of medical supplies via Red Sea corridor', source: 'ICRC' },
  { id: 'CN-010', zoneId: 'CZ-SUDAN-DARFUR', timestamp: '2026-03-06T23:30:00Z', severity: 'high', headline: 'Zalingei displacement camp capacity exceeded 300% — new arrivals turned away', source: 'IOM' },
  { id: 'CN-011', zoneId: 'CZ-SAHEL-MALI', timestamp: '2026-03-06T23:15:00Z', severity: 'medium', headline: 'Wagner Group convoy spotted on Bamako–Ségou highway', source: 'ACLED' },
  { id: 'CN-012', zoneId: 'CZ-SUDAN-GEZIRA', timestamp: '2026-03-06T23:00:00Z', severity: 'high', headline: 'RSF forcibly recruits civilians in Gezira — mass displacement southward', source: 'REUTERS' },
];
