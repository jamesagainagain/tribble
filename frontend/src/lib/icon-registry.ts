import type { OntologyClass, SourceType } from '@/types';

/**
 * Maps OntologyClass → SVG icon character + default colour CSS variable.
 * All icons are rendered as SVG text elements or inline SVG paths.
 */
export const ONTOLOGY_ICONS: Record<OntologyClass, { symbol: string; colour: string; label: string }> = {
  // Armed Conflict Events
  armed_conflict:     { symbol: '✕', colour: 'var(--hip-critical)', label: 'Armed Conflict' },
  airstrike:          { symbol: '▽', colour: 'var(--hip-critical)', label: 'Airstrike' },
  shelling:           { symbol: '◎', colour: 'var(--hip-critical)', label: 'Shelling' },
  sniper:             { symbol: '⊕', colour: 'var(--hip-high)', label: 'Sniper' },
  roadblock_military: { symbol: '═', colour: 'var(--hip-high)', label: 'Military Roadblock' },
  // Infrastructure
  bridge_damaged:     { symbol: '⌒', colour: 'var(--hip-high)', label: 'Bridge Damaged' },
  road_blocked:       { symbol: '⊘', colour: 'var(--hip-warn)', label: 'Road Blocked' },
  hospital_damaged:   { symbol: '✚', colour: 'var(--hip-critical)', label: 'Hospital Damaged' },
  power_outage:       { symbol: '⚡', colour: 'var(--hip-warn)', label: 'Power Outage' },
  water_contamination:{ symbol: '💧', colour: 'var(--hip-warn)', label: 'Water Contamination' },
  // Displacement
  displacement_mass:  { symbol: '→', colour: 'var(--hip-high)', label: 'Mass Displacement' },
  crossing_point:     { symbol: '⇌', colour: 'var(--hip-accent2)', label: 'Crossing Point' },
  border_closure:     { symbol: '⊗', colour: 'var(--hip-critical)', label: 'Border Closure' },
  checkpoint:         { symbol: '▮', colour: 'var(--hip-warn)', label: 'Checkpoint' },
  idp_camp:           { symbol: '⛺', colour: 'var(--hip-accent2)', label: 'IDP Camp' },
  // Aid & Humanitarian
  food_distribution:  { symbol: '🍲', colour: 'var(--hip-green)', label: 'Food Distribution' },
  medical_post:       { symbol: '✚', colour: 'var(--hip-green)', label: 'Medical Post' },
  water_distribution: { symbol: '💧', colour: 'var(--hip-accent)', label: 'Water Distribution' },
  shelter_point:      { symbol: '⌂', colour: 'var(--hip-green)', label: 'Shelter Point' },
  aid_convoy:         { symbol: '🚚', colour: 'var(--hip-accent)', label: 'Aid Convoy' },
  aid_obstruction:    { symbol: '🚫', colour: 'var(--hip-warn)', label: 'Aid Obstruction' },
  // Natural & Environmental
  flood:              { symbol: '≈', colour: '#3498DB', label: 'Flood' },
  earthquake:         { symbol: '⚡', colour: 'var(--hip-warn)', label: 'Earthquake' },
  fire:               { symbol: '🔥', colour: 'var(--hip-warn)', label: 'Fire' },
  disease_outbreak:   { symbol: '☣', colour: '#9B59B6', label: 'Disease Outbreak' },
  drought:            { symbol: '☀', colour: 'var(--hip-warn)', label: 'Drought' },
  // Other
  suspicious_activity:{ symbol: '👁', colour: 'var(--hip-warn)', label: 'Suspicious Activity' },
  casualty_report:    { symbol: '†', colour: 'var(--hip-critical)', label: 'Casualty Report' },
};

export const SOURCE_ICONS: Record<SourceType, { icon: string; colour: string; label: string }> = {
  news_agent:       { icon: '📡', colour: 'var(--hip-accent)', label: 'News Agent' },
  user_submission:   { icon: '👤', colour: 'var(--hip-warn)', label: 'User Submission' },
  satellite:        { icon: '🛰', colour: '#9B59B6', label: 'Satellite' },
  weather_api:      { icon: '🌦', colour: '#3498DB', label: 'Weather' },
  drone:            { icon: '✈', colour: 'var(--hip-green)', label: 'Drone' },
  analyst_input:    { icon: '🔬', colour: '#E74C3C', label: 'Analyst' },
};

/**
 * Maps ontology class to the layer group C sub-layer it belongs to.
 */
export const ONTOLOGY_TO_LAYER: Record<OntologyClass, string> = {
  armed_conflict: 'C1', airstrike: 'C1', shelling: 'C1', sniper: 'C1', roadblock_military: 'C1',
  bridge_damaged: 'C2', road_blocked: 'C2', hospital_damaged: 'C2', power_outage: 'C2', water_contamination: 'C2',
  displacement_mass: 'C3', crossing_point: 'C3', border_closure: 'C3', checkpoint: 'C3', idp_camp: 'C3',
  food_distribution: 'C4', medical_post: 'C4', water_distribution: 'C4', shelter_point: 'C4', aid_convoy: 'C4', aid_obstruction: 'C4',
  flood: 'C5', earthquake: 'C5', fire: 'C5', disease_outbreak: 'C5', drought: 'C5',
  suspicious_activity: 'C1', casualty_report: 'C1',
};
