import type { Feature } from 'geojson';

export interface NGO {
  id: string;
  name: string;
  abbreviation: string;
  zone_name: string;
  zone_geojson: Feature;
  colour: string;
}
