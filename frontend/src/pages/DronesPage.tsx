import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Battery, Signal, Activity, Wifi, WifiOff, Play, Eye } from 'lucide-react';
import { PLACEHOLDER_DRONES } from '@/lib/placeholder-data';
import { BatteryBar } from '@/components/shared/BatteryBar';
import { DroneStatusBadge } from '@/components/shared/DroneStatusBadge';
import type { Drone } from '@/types';

const useCountUp = (target: number, duration = 1000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return count;
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: typeof Activity; label: string; value: number; color: string }) => {
  const v = useCountUp(value);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded border border-border bg-card/80 backdrop-blur-sm p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{label}</span>
      </div>
      <span className="font-mono text-2xl text-foreground">{v}</span>
    </motion.div>
  );
};

const MISSION_LOG = [
  { id: 'MSN-019', drone: 'DRN-001', type: 'Reconnaissance', status: 'active', time: '05:50 UTC', target: 'Northern Corridor' },
  { id: 'MSN-018', drone: 'DRN-002', type: 'Aid Delivery', status: 'completed', time: '03:20 UTC', target: 'Bol District' },
  { id: 'MSN-017', drone: 'DRN-003', type: 'Perimeter Survey', status: 'active', time: '04:00 UTC', target: 'Eastern Zone' },
  { id: 'MSN-016', drone: 'DRN-001', type: 'Reconnaissance', status: 'completed', time: '01:15 UTC', target: 'Lake Chad Basin' },
  { id: 'MSN-015', drone: 'DRN-004', type: 'Reconnaissance', status: 'aborted', time: '23:40 UTC', target: 'Tibesti Region' },
];

const FEED_FRAMES = [
  { drone: 'DRN-001', label: 'Northern Corridor — Live', status: 'live' as const },
  { drone: 'DRN-003', label: 'Eastern Zone — Live', status: 'live' as const },
  { drone: 'DRN-002', label: 'Standby — N\'Djamena', status: 'standby' as const },
  { drone: 'DRN-004', label: 'Signal Lost — Tibesti', status: 'offline' as const },
];

export const DronesPage = () => {
  const active = PLACEHOLDER_DRONES.filter(d => d.status === 'active').length;
  const standby = PLACEHOLDER_DRONES.filter(d => d.status === 'standby').length;
  const lowBat = PLACEHOLDER_DRONES.filter(d => d.status === 'low_battery').length;
  const lost = PLACEHOLDER_DRONES.filter(d => d.status === 'lost_signal').length;

  return (
    <div className="absolute inset-0 overflow-y-auto p-4 space-y-4 pointer-events-auto" style={{ background: 'rgba(10,14,26,0.9)' }}>
      <h1 className="font-heading text-sm tracking-wider text-foreground">DRONE FLEET</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard icon={Navigation} label="ACTIVE" value={active} color="text-primary" />
        <StatCard icon={Activity} label="STANDBY" value={standby} color="text-hip-low" />
        <StatCard icon={Battery} label="LOW BATTERY" value={lowBat} color="text-hip-warn" />
        <StatCard icon={WifiOff} label="LOST SIGNAL" value={lost} color="text-hip-critical" />
      </div>

      {/* Fleet table + Mission log */}
      <div className="grid grid-cols-2 gap-3">
        {/* Fleet table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
          <div className="px-4 py-2 border-b border-border">
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider">FLEET TABLE</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="font-mono text-[9px] text-muted-foreground tracking-wider text-left px-4 py-2">DRONE</th>
                <th className="font-mono text-[9px] text-muted-foreground tracking-wider text-left px-3 py-2">STATUS</th>
                <th className="font-mono text-[9px] text-muted-foreground tracking-wider text-left px-3 py-2">BATTERY</th>
                <th className="font-mono text-[9px] text-muted-foreground tracking-wider text-left px-3 py-2">SIGNAL</th>
                <th className="font-mono text-[9px] text-muted-foreground tracking-wider text-left px-3 py-2">POSITION</th>
                <th className="font-mono text-[9px] text-muted-foreground tracking-wider text-left px-3 py-2">MISSION</th>
              </tr>
            </thead>
            <tbody>
              {PLACEHOLDER_DRONES.map(drone => (
                <tr key={drone.id} className="border-b border-border/50 hover:bg-card/60 transition-colors">
                  <td className="px-4 py-2 font-mono text-[11px] text-primary">{drone.id}</td>
                  <td className="px-3 py-2"><DroneStatusBadge status={drone.status} /></td>
                  <td className="px-3 py-2"><BatteryBar percentage={drone.battery_pct} /></td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      {drone.signal === 'lost' ? <WifiOff className="w-3 h-3 text-hip-critical" /> : <Wifi className="w-3 h-3 text-hip-green" />}
                      <span className="font-mono text-[9px] text-muted-foreground capitalize">{drone.signal}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{drone.position.lat.toFixed(2)}°N {drone.position.lng.toFixed(2)}°E</td>
                  <td className="px-3 py-2 font-mono text-[10px] text-foreground/80">{drone.current_mission?.id || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Mission log */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
          <div className="px-4 py-2 border-b border-border">
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider">MISSION LOG</span>
          </div>
          <div className="divide-y divide-border/50">
            {MISSION_LOG.map(m => (
              <div key={m.id} className="px-4 py-2.5 hover:bg-card/60 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-primary">{m.id}</span>
                    <span className="font-mono text-[10px] text-foreground">{m.drone}</span>
                  </div>
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                    m.status === 'active' ? 'bg-primary/10 text-primary' :
                    m.status === 'completed' ? 'bg-hip-green/10 text-hip-green' :
                    'bg-hip-critical/10 text-hip-critical'
                  }`}>{m.status.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>{m.type}</span>
                  <span>·</span>
                  <span>{m.target}</span>
                  <span>·</span>
                  <span>{m.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Live feed grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <span className="font-mono text-[10px] text-muted-foreground tracking-wider">LIVE FEED</span>
        <div className="grid grid-cols-4 gap-3 mt-2">
          {FEED_FRAMES.map((feed, i) => (
            <div key={i} className="rounded border border-border bg-background/60 aspect-video relative overflow-hidden group">
              {/* Simulated feed */}
              <div className="absolute inset-0 bg-gradient-to-br from-card to-background flex items-center justify-center">
                {feed.status === 'live' ? (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-full opacity-10">
                      {Array.from({ length: 20 }).map((_, j) => (
                        <div key={j} className="w-full h-px bg-primary/20" style={{ marginTop: `${j * 5 + 2}%` }} />
                      ))}
                    </div>
                    <Eye className="w-6 h-6 text-primary/30" />
                  </>
                ) : feed.status === 'standby' ? (
                  <Play className="w-6 h-6 text-muted-foreground/30" />
                ) : (
                  <WifiOff className="w-6 h-6 text-hip-critical/30" />
                )}
              </div>
              {/* Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-foreground">{feed.drone}</span>
                  {feed.status === 'live' && (
                    <span className="flex items-center gap-1">
                      <motion.span className="w-1.5 h-1.5 rounded-full bg-hip-critical" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                      <span className="font-mono text-[8px] text-hip-critical">LIVE</span>
                    </span>
                  )}
                </div>
                <p className="font-mono text-[8px] text-muted-foreground truncate mt-0.5">{feed.label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DronesPage;
