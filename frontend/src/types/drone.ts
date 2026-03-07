export type DroneStatus = 'active' | 'standby' | 'low_battery' | 'lost_signal';
export type MissionType = 'reconnaissance' | 'aid_delivery' | 'perimeter_survey';
export type MissionStatus = 'active' | 'completed' | 'aborted';

export interface DronePosition {
  lat: number;
  lng: number;
  altitude_m: number;
  speed_kmh: number;
  heading_deg: number;
}

export interface Mission {
  id: string;
  type: MissionType;
  status: MissionStatus;
  target_lat?: number;
  target_lng?: number;
  started_at: string;
  ended_at?: string;
}

export interface Drone {
  id: string;
  status: DroneStatus;
  battery_pct: number;
  position: DronePosition;
  current_mission?: Mission;
  signal: 'strong' | 'weak' | 'lost';
}

export interface FlightPathSegment {
  drone_id: string;
  coordinates: [number, number][];
  segment_type: 'completed' | 'planned' | 'historical';
}
