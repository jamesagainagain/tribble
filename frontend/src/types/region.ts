export type RiskTier = 'extreme' | 'high' | 'elevated' | 'moderate' | 'low' | 'minimal';

export interface Region {
  id: string;
  name: string;
  iso_code?: string;
  parent_region_id?: string | null;
  risk_score: number;
  risk_tier: RiskTier;
  geojson: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
  active_event_count: number;
  last_updated: string;
}
