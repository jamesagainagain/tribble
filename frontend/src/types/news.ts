import type { Severity } from './incident';
import type { OntologyClass } from './event';

export interface NewsEvent {
  id: string;
  source_name: string;
  headline: string;
  agent_summary: string;
  article_url: string;
  lat: number;
  lng: number;
  region_id?: string;
  ontology_class: OntologyClass;
  severity: Severity;
  confidence_score: number;
  ingested_at: string;
  linked_event_id?: string;
}
