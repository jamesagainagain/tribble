import type { Severity } from './incident';
import type { OntologyClass } from './event';

export type SubmissionStatus = 'pending' | 'in_review' | 'verified' | 'declined' | 'escalated';

export interface UserSubmission {
  id: string;
  submitter_id: string;
  is_anonymous: boolean;
  ontology_class_suggested: OntologyClass;
  severity_suggested: Severity;
  lat: number;
  lng: number;
  region_id?: string;
  description: string;
  submitted_at: string;
  status: SubmissionStatus;
  reviewed_by?: string;
  linked_event_id?: string;
  helios_confidence: number;
  helios_similar_event_id?: string;
  evidence_urls?: string[];
}
