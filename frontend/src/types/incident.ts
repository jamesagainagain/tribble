export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentType = 'armed_conflict' | 'displacement' | 'infrastructure_damage' | 'aid_obstruction' | 'natural_disaster' | 'disease_outbreak';
export type VerificationStatus = 'verified' | 'unverified' | 'pending';

export interface Incident {
  id: string;
  type: IncidentType;
  severity: Severity;
  lat: number;
  lng: number;
  location_name: string;
  timestamp: string;
  description: string;
  verification_status: VerificationStatus;
  verified_by?: string;
  assigned_ngo_ids: string[];
  risk_score: number;
  related_incident_ids: string[];
}
