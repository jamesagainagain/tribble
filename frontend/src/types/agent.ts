export type AgentMessageRole = 'user' | 'agent';
export type AgentResponseBlockType =
  | 'text_block' | 'incident_card' | 'event_card' | 'risk_summary' | 'map_command'
  | 'drone_status' | 'dispatch_confirm' | 'chart_block' | 'source_citations'
  | 'proactive_alert' | 'submission_review' | 'region_brief' | 'news_cluster' | 'weather_alert';

export interface AgentResponseBlock {
  type: AgentResponseBlockType;
  payload: unknown;
}

export interface AgentMessage {
  id: string;
  role: AgentMessageRole;
  content: string | AgentResponseBlock[];
  timestamp: string;
}

export type AgentStatus = 'online' | 'thinking' | 'offline';
export type HeliosStream = 'A' | 'B';
