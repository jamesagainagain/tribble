import type { Feature } from 'geojson';

export interface Settlement {
  id: string;
  name: string;
  population_estimate: number;
  risk_score: number;
  assigned_ngo_ids: string[];
  geojson: Feature;
}
