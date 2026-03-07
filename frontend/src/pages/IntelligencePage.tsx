import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, BarChart, Bar, FunnelChart, Funnel, LabelList } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Inbox, Activity } from 'lucide-react';
import { PLACEHOLDER_EVENTS, PLACEHOLDER_REGIONS, PLACEHOLDER_NGOS, PLACEHOLDER_SUBMISSIONS } from '@/lib/placeholder-data';
import { SOURCE_ICONS } from '@/lib/icon-registry';

// 90-day trend data
const TREND_DATA = Array.from({ length: 90 }, (_, i) => ({
  day: i + 1,
  critical: Math.floor(Math.random() * 3) + (i > 70 ? 2 : 0),
  high: Math.floor(Math.random() * 4) + 1,
  medium: Math.floor(Math.random() * 3) + 1,
}));

const SOURCE_PIE = [
  { name: 'News Agent', value: 847, color: 'hsl(190 100% 50%)' },
  { name: 'User Submission', value: 14, color: 'hsl(20 100% 60%)' },
  { name: 'Satellite', value: 23, color: '#9B59B6' },
  { name: 'Weather', value: 96, color: '#3498DB' },
  { name: 'Drone', value: 342, color: 'hsl(150 100% 50%)' },
  { name: 'Analyst', value: 18, color: '#E74C3C' },
];

const REGION_BARS = PLACEHOLDER_REGIONS
  .sort((a, b) => b.risk_score - a.risk_score)
  .map(r => ({
    name: r.name,
    score: r.risk_score,
    fill: r.risk_score >= 80 ? 'hsl(348 100% 59%)' : r.risk_score >= 60 ? 'hsl(20 100% 60%)' : r.risk_score >= 40 ? 'hsl(48 100% 50%)' : 'hsl(222 20% 59%)',
  }));

const FUNNEL_DATA = [
  { name: 'Submitted', value: PLACEHOLDER_SUBMISSIONS.length, fill: 'hsl(190 100% 50%)' },
  { name: 'Reviewed', value: PLACEHOLDER_SUBMISSIONS.filter(s => s.status !== 'pending').length, fill: 'hsl(48 100% 50%)' },
  { name: 'Verified', value: PLACEHOLDER_SUBMISSIONS.filter(s => s.status === 'verified').length, fill: 'hsl(150 100% 50%)' },
  { name: 'Escalated', value: 0, fill: 'hsl(348 100% 59%)' },
];

const SANKEY_FLOWS = [
  { from: 'News Agent', to: 'Verified', value: 18, color: 'hsl(190 100% 50%)' },
  { from: 'News Agent', to: 'Pending', value: 7, color: 'hsl(48 100% 50%)' },
  { from: 'Satellite', to: 'Verified', value: 12, color: 'hsl(190 100% 50%)' },
  { from: 'User Reports', to: 'Pending', value: 4, color: 'hsl(48 100% 50%)' },
  { from: 'Drone', to: 'Verified', value: 22, color: 'hsl(190 100% 50%)' },
  { from: 'Analyst', to: 'Verified', value: 8, color: 'hsl(190 100% 50%)' },
];

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

const StatCard = ({ icon: Icon, label, value, delta, deltaType, tint }: {
  icon: typeof Activity; label: string; value: number; delta: string; deltaType: 'up' | 'down' | 'neutral'; tint: string;
}) => {
  const displayVal = useCountUp(value);
  const DeltaIcon = deltaType === 'up' ? TrendingUp : deltaType === 'down' ? TrendingDown : Activity;
  const deltaColor = deltaType === 'up' ? 'text-destructive' : deltaType === 'down' ? 'text-[hsl(var(--hip-green))]' : 'text-muted-foreground';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-sm border border-border bg-card/80 backdrop-blur-sm p-4 pointer-events-auto">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${tint}`} />
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
  const sources = ['News Agent', 'Satellite', 'User Reports', 'Drone', 'Analyst'];
  const targets = ['Verified', 'Pending'];
  const sY = (i: number) => 25 + i * 40;
  const tY = (i: number) => 60 + i * 80;
  return (
    <svg viewBox="0 0 300 220" className="w-full h-full">
      {SANKEY_FLOWS.map((f, i) => {
        const si = sources.indexOf(f.from); const ti = targets.indexOf(f.to);
        return <path key={i} d={`M 90 ${sY(si)} C 150 ${sY(si)}, 150 ${tY(ti)}, 210 ${tY(ti)}`} fill="none" stroke={f.color} strokeWidth={Math.max(f.value / 3, 1.5)} opacity={0.5} />;
      })}
      {sources.map((s, i) => (
        <g key={s}><rect x={2} y={sY(i) - 8} width={82} height={16} rx={2} fill="hsl(224 30% 9%)" stroke="hsl(217 44% 20%)" strokeWidth={0.5} /><text x={43} y={sY(i) + 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 7, fontFamily: 'monospace' }}>{s}</text></g>
      ))}
      {targets.map((t, i) => (
        <g key={t}><rect x={216} y={tY(i) - 8} width={70} height={16} rx={2} fill="hsl(224 30% 9%)" stroke="hsl(217 44% 20%)" strokeWidth={0.5} /><text x={251} y={tY(i) + 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 7, fontFamily: 'monospace' }}>{t}</text></g>
      ))}
    </svg>
  );
};

const tooltipStyle = { background: 'hsl(224 30% 9%)', border: '1px solid hsl(217 44% 20%)', borderRadius: 4, fontSize: 10 };

export const IntelligencePage = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [region, setRegion] = useState('all');

  const criticalEvents = PLACEHOLDER_EVENTS.filter(e => e.severity === 'critical').length;
  const highRiskRegions = PLACEHOLDER_REGIONS.filter(r => r.risk_score >= 70).length;
  const pendingSubmissions = PLACEHOLDER_SUBMISSIONS.filter(s => s.status === 'pending').length;

  return (
    <div className="absolute inset-0 overflow-y-auto p-4 space-y-4 pointer-events-auto" style={{ background: 'rgba(10,14,26,0.94)', backdropFilter: 'blur(4px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="font-heading text-sm tracking-wider text-foreground">INTELLIGENCE DASHBOARD</h1>
        <div className="flex items-center gap-2">
          <select value={timeRange} onChange={e => setTimeRange(e.target.value)} className="bg-card border border-border rounded-sm px-2 py-1 font-mono text-[10px] text-foreground outline-none">
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <select value={region} onChange={e => setRegion(e.target.value)} className="bg-card border border-border rounded-sm px-2 py-1 font-mono text-[10px] text-foreground outline-none">
            <option value="all">ALL REGIONS</option>
            {PLACEHOLDER_REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard icon={AlertTriangle} label="CRITICAL EVENTS" value={criticalEvents * 20 + 7} delta="+12 today" deltaType="up" tint="text-destructive" />
        <StatCard icon={Shield} label="HIGH RISK REGIONS" value={highRiskRegions * 10 + 3} delta="-2 this week" deltaType="down" tint="text-[hsl(var(--hip-warn))]" />
        <StatCard icon={Inbox} label="PENDING SUBMISSIONS" value={pendingSubmissions} delta="new today" deltaType="neutral" tint="text-[hsl(var(--hip-warn))]" />
        <StatCard icon={Activity} label="ACTIVE DRONES" value={4} delta="1 low battery" deltaType="neutral" tint="text-primary" />
      </div>

      {/* Row 2: Trend + Source pie */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-2 rounded-sm border border-border bg-card/80 backdrop-blur-sm p-4">
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider">EVENT TREND — 90 DAYS</span>
          <div className="h-[180px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(348 100% 59%)" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(348 100% 59%)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(33 100% 50%)" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(33 100% 50%)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="medGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(48 100% 50%)" stopOpacity={0.2} /><stop offset="100%" stopColor="hsl(48 100% 50%)" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 8, fill: 'hsl(222 20% 59%)' }} axisLine={false} tickLine={false} interval={14} />
                <YAxis tick={{ fontSize: 8, fill: 'hsl(222 20% 59%)' }} axisLine={false} tickLine={false} width={20} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="critical" stackId="1" stroke="hsl(348 100% 59%)" fill="url(#critGrad)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="high" stackId="1" stroke="hsl(33 100% 50%)" fill="url(#highGrad)" strokeWidth={1} />
                <Area type="monotone" dataKey="medium" stackId="1" stroke="hsl(48 100% 50%)" fill="url(#medGrad)" strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-sm border border-border bg-card/80 backdrop-blur-sm p-4">
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider">SOURCE BREAKDOWN</span>
          <div className="h-[140px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={SOURCE_PIE} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                  {SOURCE_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {SOURCE_PIE.map(s => (
              <span key={s.name} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="font-mono text-[8px] text-muted-foreground">{s.name}</span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 3: Sankey + Risk by Region */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-sm border border-border bg-card/80 backdrop-blur-sm p-4">
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider">DISPLACEMENT FLOW</span>
          <div className="h-[200px] mt-2"><SankeyDiagram /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-sm border border-border bg-card/80 backdrop-blur-sm p-4">
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider">RISK SCORE BY REGION</span>
          <div className="h-[200px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REGION_BARS} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 8, fill: 'hsl(222 20% 59%)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 8, fill: 'hsl(222 20% 59%)' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="score" radius={[0, 2, 2, 0]} barSize={14}>
                  {REGION_BARS.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Row 4: Verification funnel */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-sm border border-border bg-card/80 backdrop-blur-sm p-4">
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider">VERIFICATION FUNNEL</span>
          <div className="mt-3 space-y-2">
            {FUNNEL_DATA.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-muted-foreground w-16">{d.name}</span>
                <div className="flex-1 h-4 bg-border/30 rounded-sm overflow-hidden">
                  <motion.div
                    className="h-full rounded-sm"
                    style={{ backgroundColor: d.fill }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.value / Math.max(FUNNEL_DATA[0].value, 1)) * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                </div>
                <span className="font-mono text-[10px] text-foreground w-6 text-right">{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* NGO Coverage */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-2 rounded-sm border border-border bg-card/80 backdrop-blur-sm p-4">
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider">NGO ZONE COVERAGE</span>
          <div className="grid grid-cols-5 gap-2 mt-3">
            {PLACEHOLDER_NGOS.map(ngo => (
              <div key={ngo.id} className="rounded-sm border border-border bg-background/50 p-2 text-center">
                <div className="w-7 h-7 rounded-full mx-auto mb-1 flex items-center justify-center border" style={{ borderColor: ngo.colour, backgroundColor: `${ngo.colour}15` }}>
                  <span className="font-mono text-[8px]" style={{ color: ngo.colour }}>{ngo.abbreviation}</span>
                </div>
                <p className="font-mono text-[8px] text-foreground truncate">{ngo.name}</p>
                <div className="mt-1 h-1 rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${60 + Math.random() * 35}%`, backgroundColor: ngo.colour }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IntelligencePage;
