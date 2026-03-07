/**
 * Conflict intensity by ISO 3166-1 numeric country code.
 * 0 = peaceful, 1 = extreme active conflict.
 * Based on real-world conflict data patterns (ACLED/Uppsala).
 */
export const CONFLICT_INTENSITY: Record<string, number> = {
  // Extreme (0.8-1.0)
  '804': 0.95,  // Ukraine
  '729': 0.92,  // Sudan
  '760': 0.90,  // Syria
  '887': 0.88,  // Yemen
  '104': 0.85,  // Myanmar
  '716': 0.40,  // Zimbabwe
  
  // Very High (0.6-0.8)
  '004': 0.78,  // Afghanistan
  '706': 0.76,  // Somalia
  '368': 0.72,  // Iraq
  '148': 0.70,  // Chad
  '466': 0.68,  // Mali
  '854': 0.66,  // Burkina Faso
  '180': 0.65,  // DR Congo
  '566': 0.62,  // Nigeria
  '728': 0.60,  // South Sudan
  '434': 0.58,  // Libya
  
  // High (0.4-0.6)
  '140': 0.55,  // Central African Republic
  '562': 0.52,  // Niger
  '508': 0.48,  // Mozambique
  '120': 0.45,  // Cameroon
  '231': 0.42,  // Ethiopia
  '478': 0.40,  // Mauritania
  '800': 0.38,  // Uganda
  '404': 0.35,  // Kenya
  '178': 0.32,  // Congo
  '012': 0.30,  // Algeria
  
  // Elevated (0.15-0.3)
  '792': 0.28,  // Turkey
  '586': 0.26,  // Pakistan
  '818': 0.25,  // Egypt
  '076': 0.22,  // Brazil
  '170': 0.20,  // Colombia
  '484': 0.18,  // Mexico
  '356': 0.16,  // India
  '608': 0.15,  // Philippines
  '764': 0.14,  // Thailand
  '643': 0.30,  // Russia
  '376': 0.22,  // Israel
  '275': 0.35,  // Palestine
  '422': 0.28,  // Lebanon
  
  // Low (0.05-0.15)
  '710': 0.12,  // South Africa
  '682': 0.10,  // Saudi Arabia
  '364': 0.15,  // Iran
  '862': 0.14,  // Venezuela
  '332': 0.10,  // Haiti
};

/**
 * Returns a conflict color based on intensity (0-1).
 * 0 = neutral dark, 1 = deep red/orange glow
 */
export function conflictColor(intensity: number): string {
  if (intensity <= 0) return 'hsl(224, 30%, 9%)'; // hip-dark
  if (intensity < 0.2) return `hsla(190, 60%, 20%, ${intensity * 2})`; // faint cyan tint
  if (intensity < 0.4) return `hsla(48, 80%, 40%, ${intensity * 0.6})`; // amber
  if (intensity < 0.6) return `hsla(33, 90%, 35%, ${intensity * 0.7})`; // orange
  if (intensity < 0.8) return `hsla(15, 90%, 30%, ${intensity * 0.8})`; // deep orange
  return `hsla(348, 90%, 30%, ${Math.min(0.9, intensity * 0.9)})`; // red
}

/**
 * Disputed borders / boundary disputes for rendering.
 * Each entry is a polyline (array of [lng, lat] coords).
 */
export interface DisputedBorder {
  id: string;
  name: string;
  coords: [number, number][];
  type: 'disputed' | 'ceasefire' | 'defacto' | 'claimed';
}

export const DISPUTED_BORDERS: DisputedBorder[] = [
  // Kashmir (India-Pakistan-China)
  {
    id: 'DSP-001', name: 'Line of Control — Kashmir',
    type: 'ceasefire',
    coords: [[73.5, 32.5], [74.0, 33.0], [74.8, 33.8], [75.5, 34.5], [76.0, 35.0], [76.8, 35.5], [77.5, 35.8]],
  },
  // Crimea
  {
    id: 'DSP-002', name: 'Crimea — Ukraine/Russia',
    type: 'disputed',
    coords: [[33.4, 46.2], [33.6, 45.8], [34.0, 45.3], [34.5, 45.0], [35.0, 45.1], [35.5, 45.3], [36.0, 45.4], [36.5, 45.2]],
  },
  // Eastern Ukraine front
  {
    id: 'DSP-003', name: 'Donbas Frontline',
    type: 'ceasefire',
    coords: [[36.0, 49.5], [37.0, 49.0], [37.5, 48.5], [38.0, 48.0], [38.5, 47.5], [38.0, 47.0], [37.5, 46.8], [36.8, 46.5]],
  },
  // Golan Heights
  {
    id: 'DSP-004', name: 'Golan Heights',
    type: 'disputed',
    coords: [[35.7, 33.3], [35.8, 33.1], [35.9, 32.9], [35.85, 32.7]],
  },
  // Western Sahara
  {
    id: 'DSP-005', name: 'Western Sahara — Moroccan Wall',
    type: 'defacto',
    coords: [[-8.7, 27.7], [-10.0, 26.5], [-12.0, 25.0], [-13.0, 24.0], [-13.5, 23.5], [-14.0, 23.0], [-15.0, 22.0], [-16.0, 21.5], [-17.0, 21.3]],
  },
  // Abyei (Sudan/South Sudan)
  {
    id: 'DSP-006', name: 'Abyei Disputed Area',
    type: 'disputed',
    coords: [[28.5, 10.5], [29.0, 10.2], [29.5, 9.8], [29.8, 9.5], [29.5, 9.2], [29.0, 9.0], [28.5, 9.2], [28.5, 10.5]],
  },
  // Somaliland
  {
    id: 'DSP-007', name: 'Somaliland Border',
    type: 'claimed',
    coords: [[43.0, 11.0], [44.0, 11.0], [45.0, 11.0], [46.0, 11.0], [47.0, 11.0], [48.0, 11.0], [49.0, 11.0]],
  },
  // Taiwan Strait
  {
    id: 'DSP-008', name: 'Taiwan Strait',
    type: 'defacto',
    coords: [[119.5, 22.0], [119.8, 23.0], [120.0, 24.0], [120.5, 25.0], [121.0, 25.5]],
  },
  // Israel-Palestine
  {
    id: 'DSP-009', name: 'West Bank Barrier',
    type: 'defacto',
    coords: [[34.9, 31.3], [35.0, 31.5], [35.1, 31.8], [35.15, 32.0], [35.2, 32.3], [35.25, 32.5]],
  },
  // Ethiopia-Eritrea
  {
    id: 'DSP-010', name: 'Ethiopia-Eritrea Border',
    type: 'disputed',
    coords: [[36.5, 14.0], [37.5, 14.5], [38.5, 14.8], [39.5, 15.0], [40.5, 14.5], [41.5, 13.5], [42.5, 13.0], [43.0, 12.5]],
  },
  // India-China LAC (Aksai Chin / Arunachal)
  {
    id: 'DSP-011', name: 'LAC — Aksai Chin',
    type: 'disputed',
    coords: [[77.5, 35.5], [78.0, 35.2], [78.5, 35.0], [79.0, 34.8], [79.5, 34.5], [80.0, 34.8], [80.5, 35.0]],
  },
  // Korean DMZ
  {
    id: 'DSP-012', name: 'Korean DMZ',
    type: 'ceasefire',
    coords: [[124.6, 37.7], [125.5, 37.8], [126.5, 37.9], [127.0, 38.0], [127.5, 38.3], [128.0, 38.5], [128.5, 38.6], [129.0, 38.6]],
  },
];

/**
 * Disputed border dash patterns by type
 */
export const DISPUTED_STYLES: Record<DisputedBorder['type'], { dash: string; color: string; width: number }> = {
  disputed:  { dash: '6 3',   color: 'hsl(var(--hip-critical))', width: 1.2 },
  ceasefire: { dash: '8 4 2 4', color: 'hsl(var(--hip-high))',  width: 1.0 },
  defacto:   { dash: '4 4',   color: 'hsl(var(--hip-warn))',     width: 0.8 },
  claimed:   { dash: '2 4',   color: 'hsl(var(--hip-medium))',   width: 0.6 },
};
