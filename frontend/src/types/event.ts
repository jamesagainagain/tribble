import type { Severity } from './incident';

export type OntologyClass =
  | 'armed_conflict' | 'airstrike' | 'shelling' | 'sniper' | 'roadblock_military'
  | 'bridge_damaged' | 'road_blocked' | 'hospital_damaged' | 'power_outage' | 'water_contamination'
  | 'displacement_mass' | 'crossing_point' | 'border_closure' | 'checkpoint' | 'idp_camp'
  | 'food_distribution' | 'medical_post' | 'water_distribution' | 'shelter_point' | 'aid_convoy'
  | 'aid_obstruction' | 'flood' | 'earthquake' | 'fire' | 'disease_outbreak' | 'drought'
  | 'suspicious_activity' | 'casualty_report';

export type SourceType =
  | 'news_agent' | 'user_submission' | 'satellite' | 'weather_api' | 'drone' | 'analyst_input';

export type EventVerificationStatus = 'unverified' | 'pending' | 'verified' | 'disputed' | 'escalated';

export interface HipEvent {
  id: string;
  ontology_class: OntologyClass;
  severity: Severity;
  lat: number;
  lng: number;
  region_id: string;
  location_name: string;
  timestamp: string;
  description: string;
  source_type: SourceType;
  source_label: string;
  confidence_score: number;
  verification_status: EventVerificationStatus;
  verified_by?: string;
  verified_at?: string;
  assigned_ngo_ids: string[];
  related_event_ids: string[];
  evidence_urls?: string[];
  last_updated: string;
}
