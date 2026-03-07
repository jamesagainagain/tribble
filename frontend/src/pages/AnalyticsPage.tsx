import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Users, Activity } from 'lucide-react';
import { PLACEHOLDER_INCIDENTS, PLACEHOLDER_NGOS } from '@/lib/placeholder-data';

// --- Data generators ---
const TREND_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `Nov ${i + 1}`,
  incidents: Math.floor(Math.random() * 6) + 2 + (i > 20 ? Math.floor(Math.random() * 6) : 0),
  verified: Math.floor(Math.random() * 4) + 1,
}));

const SEVERITY_PIE = [
  { name: 'Critical', value: PLACEHOLDER_INCIDENTS.filter(i => i.severity === 'critical').length, color: 'hsl(348 100% 59%)' },
  { name: 'High', value: PLACEHOLDER_INCIDENTS.filter(i => i.severity === 'high').length, color: 'hsl(33 100% 50%)' },
  { name: 'Medium', value: PLACEHOLDER_INCIDENTS.filter(i => i.severity === 'medium').length, color: 'hsl(48 100% 50%)' },
  { name: 'Low', value: PLACEHOLDER_INCIDENTS.filter(i => i.severity === 'low').length, color: 'hsl(240 2% 39%)' },
];

const TYPE_DATA = [
  { type: 'Armed', count: 12 },
  { type: 'Displace.', count: 8 },
  { type: 'Infra', count: 6 },
  { type: 'Aid Obs.', count: 4 },
  { type: 'Disease', count: 3 },
  { type: 'Natural', count: 2 },
];

const ALERT_TIMELINE = [
  { time: '06:32', severity: 'critical' as const, text: 'Armed confrontation — Northern Corridor', id: 'INC-0042' },
  { time: '09:15', severity: 'high' as const, text: 'Bridge destroyed — Bol District', id: 'INC-0051' },
  { time: '11:40', severity: 'medium' as const, text: 'Convoy held at checkpoint — N\'Djamena', id: 'INC-0055' },
  { time: '14:10', severity: 'high' as const, text: '2,400 persons displaced — Eastern Settlement', id: 'INC-0038' },
  { time: '08:00', severity: 'medium' as const, text: 'Cholera outbreak suspected — Tibesti', id: 'INC-0060' },
  { time: '17:30', severity: 'low' as const, text: 'Flash flooding — Salamat Prefecture', id: 'INC-0063' },
];

const SEV_COLORS: Record<string, string> = {
  critical: 'bg-hip-critical',
  high: 'bg-hip-high',
  medium: 'bg-hip-medium',
  low: 'bg-hip-low',
};

// Sankey-like flow (simplified SVG)
const SANKEY_FLOWS = [
  { from: 'Ground Reports', to: 'Verified', value: 18, color: 'hsl(190 100% 50%)' },
  { from: 'Ground Reports', to: 'Pending', value: 7, color: 'hsl(48 100% 50%)' },
  { from: 'Satellite', to: 'Verified', value: 12, color: 'hsl(190 100% 50%)' },
  { from: 'Satellite', to: 'Unverified', value: 4, color: 'hsl(348 100% 59%)' },
  { from: 'Field Analysts', to: 'Verified', value: 22, color: 'hsl(190 100% 50%)' },
  { from: 'Drone Recon', to: 'Verified', value: 8, color: 'hsl(190 100% 50%)' },
  { from: 'Drone Recon', to: 'Pending', value: 3, color: 'hsl(48 100% 50%)' },
];

// Count-up hook
const useCountUp = (target: number, duration = 1200) => {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return count;
};

const StatCard = ({ icon: Icon, label, value, delta, deltaType }: {
  icon: typeof Activity; label: string; value: number; delta: string; deltaType: 'up' | 'down' | 'neutral';
}) => {
  const displayVal = useCountUp(value);
  const DeltaIcon = deltaType === 'up' ? TrendingUp : deltaType === 'down' ? TrendingDown : Activity;
  const deltaColor = deltaType === 'up' ? 'text-hip-critical' : deltaType === 'down' ? 'text-hip-green' : 'text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded border border-border bg-card/80 backdrop-blur-sm p-4 pointer-events-auto"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="font-mono text-2xl text-foreground">{displayVal}</span>
        <div className={`flex items-center gap-1 ${deltaColor}`}>
          <DeltaIcon className="w-3 h-3" />
          <span className="font-mono text-[10px]">{delta}</span>
        </div>
      </div>
    </motion.div>
  );
};

const SankeyDiagram = () => {
  const sources = ['Ground Reports', 'Satellite', 'Field Analysts', 'Drone Recon'];
  const targets = ['Verified', 'Pending', 'Unverified'];
  const sY = (i: number) => 30 + i * 50;
  const tY = (i: number) => 50 + i * 60;

  return (
    <svg viewBox="0 0 300 220" className="w-full h-full">
      {SANKEY_FLOWS.map((f, i) => {
        const si = sources.indexOf(f.from);
        const ti = targets.indexOf(f.to);
        const x1 = 90, x2 = 210;
        const y1 = sY(si), y2 = tY(ti);
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} C ${150} ${y1}, ${150} ${y2}, ${x2} ${y2}`}
            fill="none"
            stroke={f.color}
            strokeWidth={Math.max(f.value / 3, 1.5)}
            opacity={0.5}
          />
        );
      })}
      {sources.map((s, i) => (
        <g key={s}>
          <rect x={4} y={sY(i) - 8} width={80} height={16} rx={2} fill="hsl(224 30% 9%)" stroke="hsl(217 44% 20%)" strokeWidth={0.5} />
          <text x={44} y={sY(i) + 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 8, fontFamily: 'monospace' }}>{s}</text>
        </g>
      ))}
      {targets.map((t, i) => (
        <g key={t}>
          <rect x={216} y={tY(i) - 8} width={70} height={16} rx={2} fill="hsl(224 30% 9%)" stroke="hsl(217 44% 20%)" strokeWidth={0.5} />
          <text x={251} y={tY(i) + 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 8, fontFamily: 'monospace' }}>{t}</text>
        </g>
      ))}
    </svg>
  );
};

export const AnalyticsPage = () => (
  <div className="absolute inset-0 overflow-y-auto p-4 space-y-4 pointer-events-auto" style={{ background: 'rgba(10,14,26,0.85)' }}>
    {/* Header */}
    <div className="flex items-center justify-between">
      <h1 className="font-heading text-sm tracking-wider text-foreground">ANALYTICS DASHBOARD</h1>
      <span className="font-mono text-[10px] text-muted-foreground">Last 30 days — Sahel Region</span>
    </div>

    {/* Stat cards */}
    <div className="grid grid-cols-4 gap-3">
      <StatCard icon={AlertTriangle} label="ACTIVE INCIDENTS" value={6} delta="+2 24h" deltaType="up" />
      <StatCard icon={Shield} label="AVG RISK SCORE" value={61} delta="-3 vs 7d" deltaType="down" />
      <StatCard icon={Users} label="DISPLACED PERSONS" value={2400} delta="+800 48h" deltaType="up" />
      <StatCard icon={Activity} label="VERIFIED REPORTS" value={42} delta="87% rate" deltaType="neutral" />
    </div>

    {/* Row: Trend + Severity Pie */}
    <div className="grid grid-cols-3 gap-3">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-2 rounded border border-border bg-card/80 backdrop-blur-sm p-4">
        <span className="font-mono text-[10px] text-muted-foreground tracking-wider">INCIDENT TREND — 30 DAYS</span>
        <div className="h-[180px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TREND_DATA}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(190 100% 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(190 100% 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(150 100% 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(150 100% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(222 20% 59%)' }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(222 20% 59%)' }} axisLine={false} tickLine={false} width={20} />
              <Tooltip contentStyle={{ background: 'hsl(224 30% 9%)', border: '1px solid hsl(217 44% 20%)', borderRadius: 4, fontSize: 10 }} />
              <Area type="monotone" dataKey="incidents" stroke="hsl(190 100% 50%)" fill="url(#aGrad)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="verified" stroke="hsl(150 100% 50%)" fill="url(#vGrad)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded border border-border bg-card/80 backdrop-blur-sm p-4">
        <span className="font-mono text-[10px] text-muted-foreground tracking-wider">SEVERITY DISTRIBUTION</span>
        <div className="h-[140px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={SEVERITY_PIE} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                {SEVERITY_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(224 30% 9%)', border: '1px solid hsl(217 44% 20%)', borderRadius: 4, fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {SEVERITY_PIE.map(s => (
            <div key={s.name} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-mono text-[9px] text-muted-foreground">{s.name} ({s.value})</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* Row: Sankey + Type Bar + Alert Timeline */}
    <div className="grid grid-cols-3 gap-3">
      {/* Sankey */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded border border-border bg-card/80 backdrop-blur-sm p-4">
        <span className="font-mono text-[10px] text-muted-foreground tracking-wider">INTELLIGENCE FLOW</span>
        <div className="h-[200px] mt-2">
          <SankeyDiagram />
        </div>
      </motion.div>

      {/* Type breakdown */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded border border-border bg-card/80 backdrop-blur-sm p-4">
        <span className="font-mono text-[10px] text-muted-foreground tracking-wider">INCIDENT TYPES</span>
        <div className="h-[200px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TYPE_DATA} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 9, fill: 'hsl(222 20% 59%)' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="type" type="category" tick={{ fontSize: 9, fill: 'hsl(222 20% 59%)' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip contentStyle={{ background: 'hsl(224 30% 9%)', border: '1px solid hsl(217 44% 20%)', borderRadius: 4, fontSize: 10 }} />
              <Bar dataKey="count" fill="hsl(190 100% 50%)" radius={[0, 2, 2, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Alert timeline */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded border border-border bg-card/80 backdrop-blur-sm p-4">
        <span className="font-mono text-[10px] text-muted-foreground tracking-wider">ALERT TIMELINE</span>
        <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto">
          {ALERT_TIMELINE.map((alert, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex flex-col items-center mt-1">
                <span className={`w-2 h-2 rounded-full ${SEV_COLORS[alert.severity]}`} />
                {i < ALERT_TIMELINE.length - 1 && <div className="w-px h-6 bg-border mt-1" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{alert.time}</span>
                  <span className="font-mono text-[9px] text-primary">{alert.id}</span>
                </div>
                <p className="text-[10px] text-foreground/80 leading-tight truncate">{alert.text}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* NGO coverage minimap */}
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded border border-border bg-card/80 backdrop-blur-sm p-4">
      <span className="font-mono text-[10px] text-muted-foreground tracking-wider">NGO ZONE COVERAGE</span>
      <div className="grid grid-cols-5 gap-3 mt-3">
        {PLACEHOLDER_NGOS.map(ngo => (
          <div key={ngo.id} className="rounded border border-border bg-background/50 p-3 text-center">
            <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center border" style={{ borderColor: ngo.colour, backgroundColor: `${ngo.colour}15` }}>
              <span className="font-mono text-[10px]" style={{ color: ngo.colour }}>{ngo.abbreviation}</span>
            </div>
            <p className="font-mono text-[10px] text-foreground">{ngo.name}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{ngo.zone_name}</p>
            <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${60 + Math.random() * 35}%`, backgroundColor: ngo.colour }} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default AnalyticsPage;
