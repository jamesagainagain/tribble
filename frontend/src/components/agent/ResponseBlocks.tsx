import { motion } from 'framer-motion';
import { MapPin, Navigation, AlertTriangle, BarChart3, FileText, Send, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { BatteryBar } from '@/components/shared/BatteryBar';
import { RiskGauge } from '@/components/shared/RiskGauge';
import { PLACEHOLDER_INCIDENTS, PLACEHOLDER_DRONES, PLACEHOLDER_EVENTS } from '@/lib/placeholder-data';
import { useUIStore } from '@/store/uiSlice';
import type { AgentResponseBlock } from '@/types';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';

// Fake chart data
const CHART_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  incidents: Math.floor(Math.random() * 8) + 2 + (i > 20 ? Math.floor(Math.random() * 5) : 0),
}));

const blockVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/* ─── TEXT BLOCK ─── */
const TextBlock = ({ payload }: { payload: { text: string } }) => (
  <motion.div variants={blockVariants} className="prose prose-invert prose-xs max-w-none">
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="text-[12px] leading-relaxed text-foreground/90 my-1">{children}</p>,
        strong: ({ children }) => <strong className="text-primary font-semibold">{children}</strong>,
      }}
    >
      {payload.text}
    </ReactMarkdown>
  </motion.div>
);

/* ─── INCIDENT CARD ─── */
const IncidentCard = ({ payload }: { payload: { incident_id: string } }) => {
  const inc = PLACEHOLDER_INCIDENTS.find(i => i.id === payload.incident_id);
  const { setSelectedIncidentId, setRightPanelOpen } = useUIStore();
  if (!inc) return null;

  return (
    <motion.button
      variants={blockVariants}
      onClick={() => { setSelectedIncidentId(inc.id); }}
      className="w-full text-left rounded border border-border bg-card/60 p-2.5 hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-[11px] text-primary">{inc.id}</span>
        <SeverityBadge severity={inc.severity} />
      </div>
      <p className="text-[11px] text-foreground/80 leading-snug line-clamp-2">{inc.description}</p>
      <div className="flex items-center gap-2 mt-1.5">
        <MapPin className="w-3 h-3 text-muted-foreground" />
        <span className="font-mono text-[10px] text-muted-foreground">{inc.location_name}</span>
      </div>
    </motion.button>
  );
};

/* ─── RISK SUMMARY ─── */
const RiskSummary = ({ payload }: { payload: { region: string; score: number; trend: string; factors: string[] } }) => {
  const TrendIcon = payload.trend === 'rising' ? TrendingUp : payload.trend === 'falling' ? TrendingDown : Minus;
  const trendColor = payload.trend === 'rising' ? 'text-hip-critical' : payload.trend === 'falling' ? 'text-hip-green' : 'text-muted-foreground';

  return (
    <motion.div variants={blockVariants} className="rounded border border-border bg-card/60 p-2.5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-[11px] text-foreground">{payload.region}</span>
        </div>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          <span className="font-mono text-[10px] uppercase">{payload.trend}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-2">
        <RiskGauge score={payload.score} size={56} />
        <div className="flex-1">
          <ul className="space-y-0.5">
            {payload.factors.map((f, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <AlertTriangle className="w-2.5 h-2.5 text-hip-warn mt-0.5 flex-shrink-0" />
                <span className="text-[10px] text-muted-foreground leading-tight">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── MAP COMMAND ─── */
const MapCommand = ({ payload }: { payload: { action: string; lat: number; lng: number; zoom: number; label: string } }) => (
  <motion.button
    variants={blockVariants}
    className="w-full flex items-center gap-2 rounded border border-primary/30 bg-primary/5 px-3 py-2 hover:bg-primary/10 transition-colors"
  >
    <Navigation className="w-3.5 h-3.5 text-primary" />
    <span className="font-mono text-[11px] text-primary">
      FLY TO {payload.label.toUpperCase()}
    </span>
    <span className="ml-auto font-mono text-[9px] text-muted-foreground">
      {payload.lat.toFixed(2)}°N {payload.lng.toFixed(2)}°E
    </span>
  </motion.button>
);

/* ─── SOURCE CITATIONS ─── */
const SourceCitations = ({ payload }: { payload: { sources: { label: string; confidence: number }[] } }) => (
  <motion.div variants={blockVariants} className="space-y-1">
    <span className="font-mono text-[9px] text-muted-foreground tracking-wider">SOURCES</span>
    {payload.sources.map((s, i) => (
      <div key={i} className="flex items-center gap-2 px-2 py-1 rounded bg-card/40 border border-border/50">
        <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        <span className="text-[10px] text-foreground/80 flex-1">{s.label}</span>
        <span className={`font-mono text-[9px] ${s.confidence >= 90 ? 'text-hip-green' : s.confidence >= 70 ? 'text-hip-medium' : 'text-hip-warn'}`}>
          {s.confidence}%
        </span>
      </div>
    ))}
  </motion.div>
);

/* ─── DISPATCH CONFIRM ─── */
const DispatchConfirm = ({ payload }: { payload: { drone_id: string; target_lat: number; target_lng: number; incident_id: string; location_label: string } }) => {
  const drone = PLACEHOLDER_DRONES.find(d => d.id === payload.drone_id);

  return (
    <motion.div variants={blockVariants} className="rounded border border-hip-green/30 bg-hip-green/5 p-2.5">
      <div className="flex items-center gap-2 mb-2">
        <Send className="w-3.5 h-3.5 text-hip-green" />
        <span className="font-mono text-[11px] text-hip-green">DISPATCH CONFIRMATION</span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
        <span className="text-muted-foreground">Drone</span>
        <span className="font-mono text-foreground">{payload.drone_id}</span>
        <span className="text-muted-foreground">Target</span>
        <span className="font-mono text-foreground">{payload.incident_id}</span>
        <span className="text-muted-foreground">Location</span>
        <span className="text-foreground">{payload.location_label}</span>
        {drone && (
          <>
            <span className="text-muted-foreground">Battery</span>
            <BatteryBar percentage={drone.battery_pct} />
          </>
        )}
      </div>
      <div className="flex gap-2 mt-2.5">
        <button className="flex-1 font-mono text-[10px] tracking-wider py-1.5 rounded bg-hip-green/20 text-hip-green hover:bg-hip-green/30 transition-colors border border-hip-green/30">
          CONFIRM
        </button>
        <button className="flex-1 font-mono text-[10px] tracking-wider py-1.5 rounded bg-card text-muted-foreground hover:text-foreground transition-colors border border-border">
          CANCEL
        </button>
      </div>
    </motion.div>
  );
};

/* ─── CHART BLOCK ─── */
const ChartBlock = ({ payload }: { payload: { title: string } }) => (
  <motion.div variants={blockVariants} className="rounded border border-border bg-card/60 p-2.5">
    <div className="flex items-center gap-2 mb-2">
      <BarChart3 className="w-3.5 h-3.5 text-primary" />
      <span className="font-mono text-[11px] text-foreground">{payload.title}</span>
    </div>
    <div className="h-[100px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={CHART_DATA}>
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(190 100% 50%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(190 100% 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(222 20% 59%)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: 'hsl(222 20% 59%)' }} axisLine={false} tickLine={false} width={20} />
          <ReTooltip
            contentStyle={{ background: 'hsl(224 30% 9%)', border: '1px solid hsl(217 44% 20%)', borderRadius: 4, fontSize: 10 }}
            labelStyle={{ color: 'hsl(222 25% 90%)' }}
          />
          <Area type="monotone" dataKey="incidents" stroke="hsl(190 100% 50%)" fill="url(#chartGrad)" strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

/* ─── DRONE STATUS (bonus block type from types) ─── */
const DroneStatusBlock = ({ payload }: { payload: { drone_id: string } }) => {
  const drone = PLACEHOLDER_DRONES.find(d => d.id === payload.drone_id);
  if (!drone) return null;

  return (
    <motion.div variants={blockVariants} className="rounded border border-border bg-card/60 p-2.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-primary">{drone.id}</span>
        <BatteryBar percentage={drone.battery_pct} />
      </div>
    </motion.div>
  );
};

/* ─── EVENT CARD (replaces incident_card for new events) ─── */
const EventCard = ({ payload }: { payload: { event_id: string } }) => {
  const evt = PLACEHOLDER_EVENTS.find(e => e.id === payload.event_id);
  if (!evt) return null;
  return (
    <motion.div variants={blockVariants} className="w-full text-left rounded border border-border bg-card/60 p-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-[11px] text-primary">{evt.id}</span>
        <SeverityBadge severity={evt.severity} />
      </div>
      <p className="text-[11px] text-foreground/80 leading-snug line-clamp-2">{evt.description}</p>
      <div className="flex items-center gap-2 mt-1.5">
        <MapPin className="w-3 h-3 text-muted-foreground" />
        <span className="font-mono text-[10px] text-muted-foreground">{evt.location_name}</span>
      </div>
    </motion.div>
  );
};

/* ─── PROACTIVE ALERT ─── */
const ProactiveAlertBlock = ({ payload }: { payload: { description: string; recommended_action?: string } }) => (
  <motion.div variants={blockVariants} className="rounded border-l-2 border-destructive bg-destructive/5 p-2.5">
    <div className="flex items-center gap-2 mb-1.5">
      <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
      <span className="font-mono text-[10px] text-destructive tracking-wider">HELIOS INTELLIGENCE ALERT</span>
    </div>
    <p className="text-[11px] text-foreground/80 leading-relaxed">{payload.description}</p>
    <div className="flex gap-2 mt-2">
      <button className="font-mono text-[9px] text-primary px-2 py-1 rounded border border-primary/30">VIEW ON MAP</button>
      <button className="font-mono text-[9px] text-muted-foreground px-2 py-1 rounded border border-border">DISMISS</button>
      <button className="font-mono text-[9px] text-destructive px-2 py-1 rounded border border-destructive/30">ESCALATE</button>
    </div>
  </motion.div>
);

/* ─── SUBMISSION REVIEW ─── */
const SubmissionReviewBlock = ({ payload }: { payload: { report_id: string; confidence: number; description?: string } }) => (
  <motion.div variants={blockVariants} className="rounded border-l-2 border-[hsl(var(--hip-warn))] bg-[hsl(var(--hip-warn))]/5 p-2.5">
    <div className="flex items-center gap-2 mb-1.5">
      <span>👤</span>
      <span className="font-mono text-[10px] text-[hsl(var(--hip-warn))] tracking-wider">SUBMISSION REVIEW NEEDED</span>
    </div>
    <p className="font-mono text-[10px] text-primary">{payload.report_id}</p>
    {payload.description && <p className="text-[10px] text-foreground/80 mt-1">{payload.description}</p>}
    <div className="flex gap-2 mt-2">
      <button className="font-mono text-[9px] text-[hsl(var(--hip-green))] px-2 py-1 rounded border border-[hsl(var(--hip-green))]/30">VERIFY</button>
      <button className="font-mono text-[9px] text-muted-foreground px-2 py-1 rounded border border-border">DECLINE</button>
    </div>
  </motion.div>
);

/* ─── BLOCK RENDERER ─── */
export const ResponseBlockRenderer = ({ block }: { block: AgentResponseBlock }) => {
  switch (block.type) {
    case 'text_block':
      return <TextBlock payload={block.payload as any} />;
    case 'incident_card':
      return <IncidentCard payload={block.payload as any} />;
    case 'event_card':
      return <EventCard payload={block.payload as any} />;
    case 'risk_summary':
      return <RiskSummary payload={block.payload as any} />;
    case 'map_command':
      return <MapCommand payload={block.payload as any} />;
    case 'source_citations':
      return <SourceCitations payload={block.payload as any} />;
    case 'dispatch_confirm':
      return <DispatchConfirm payload={block.payload as any} />;
    case 'chart_block':
      return <ChartBlock payload={block.payload as any} />;
    case 'drone_status':
      return <DroneStatusBlock payload={block.payload as any} />;
    case 'proactive_alert':
      return <ProactiveAlertBlock payload={block.payload as any} />;
    case 'submission_review':
      return <SubmissionReviewBlock payload={block.payload as any} />;
    default:
      return null;
  }
};
