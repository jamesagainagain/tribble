import type { SourceType } from './event';

export type PipelineStatus = 'running' | 'degraded' | 'down';

export interface PipelineHealth {
  source_type: SourceType;
  status: PipelineStatus;
  last_event_at: string;
  events_today: number;
  notes?: string;
}
