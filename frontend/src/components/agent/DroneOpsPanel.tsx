import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MapPin, Crosshair } from 'lucide-react';
import { PLACEHOLDER_DRONES, PLACEHOLDER_INCIDENTS } from '@/lib/placeholder-data';
import { BatteryBar } from '@/components/shared/BatteryBar';
import { DroneStatusBadge } from '@/components/shared/DroneStatusBadge';
import type { Drone } from '@/types';

const DispatchModal = ({ drone, onClose }: { drone: Drone; onClose: () => void }) => {
  const [targetIncident, setTargetIncident] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-[320px] rounded border border-border bg-card p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-primary" />
            <span className="font-mono text-[12px] text-foreground tracking-wider">DISPATCH {drone.id}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Drone info */}
          <div className="grid grid-cols-2 gap-2 text-[10px] p-2 rounded bg-background/50 border border-border">
            <span className="text-muted-foreground">Status</span>
            <DroneStatusBadge status={drone.status} />
            <span className="text-muted-foreground">Battery</span>
            <BatteryBar percentage={drone.battery_pct} />
            <span className="text-muted-foreground">Signal</span>
            <span className="font-mono text-foreground capitalize">{drone.signal}</span>
          </div>

          {/* Target */}
          <div>
            <label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">TARGET INCIDENT</label>
            <select
              value={targetIncident}
              onChange={e => setTargetIncident(e.target.value)}
              className="w-full bg-background border border-border rounded px-2 py-1.5 font-mono text-[11px] text-foreground outline-none focus:border-primary/40"
            >
              <option value="">Select incident…</option>
              {PLACEHOLDER_INCIDENTS.map(inc => (
                <option key={inc.id} value={inc.id}>
                  {inc.id} — {inc.location_name}
                </option>
              ))}
            </select>
          </div>

          {/* Mission type */}
          <div>
            <label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">MISSION TYPE</label>
            <div className="flex gap-2">
              {['reconnaissance', 'aid_delivery', 'perimeter_survey'].map(t => (
                <button
                  key={t}
                  className="flex-1 font-mono text-[9px] tracking-wider py-1.5 rounded border border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors capitalize"
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              disabled={!targetIncident}
              className="flex-1 font-mono text-[10px] tracking-wider py-2 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors border border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              DISPATCH
            </button>
            <button
              onClick={onClose}
              className="flex-1 font-mono text-[10px] tracking-wider py-2 rounded bg-card text-muted-foreground hover:text-foreground transition-colors border border-border"
            >
              CANCEL
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const DroneOpsPanel = () => {
  const [dispatchDrone, setDispatchDrone] = useState<Drone | null>(null);

  return (
    <div className="flex flex-col h-full relative">
      {/* Fleet header */}
      <div className="px-3 py-2 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider">FLEET STATUS</span>
          <span className="font-mono text-[10px] text-primary">
            {PLACEHOLDER_DRONES.filter(d => d.status === 'active').length}/{PLACEHOLDER_DRONES.length} ACTIVE
          </span>
        </div>
      </div>

      {/* Fleet table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="font-mono text-[9px] text-muted-foreground tracking-wider text-left px-3 py-2">ID</th>
              <th className="font-mono text-[9px] text-muted-foreground tracking-wider text-left px-2 py-2">STATUS</th>
              <th className="font-mono text-[9px] text-muted-foreground tracking-wider text-left px-2 py-2">BAT</th>
              <th className="font-mono text-[9px] text-muted-foreground tracking-wider text-right px-3 py-2">ACT</th>
            </tr>
          </thead>
          <tbody>
            {PLACEHOLDER_DRONES.map(drone => (
              <tr
                key={drone.id}
                className="border-b border-border/50 hover:bg-card/60 transition-colors"
              >
                <td className="px-3 py-2">
                  <span className="font-mono text-[11px] text-foreground">{drone.id}</span>
                </td>
                <td className="px-2 py-2">
                  <DroneStatusBadge status={drone.status} />
                </td>
                <td className="px-2 py-2">
                  <BatteryBar percentage={drone.battery_pct} />
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => setDispatchDrone(drone)}
                    disabled={drone.status === 'lost_signal'}
                    className="font-mono text-[9px] tracking-wider text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
                  >
                    DISPATCH
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Drone detail cards */}
        <div className="p-3 space-y-2">
          {PLACEHOLDER_DRONES.map(drone => (
            <div key={drone.id} className="rounded border border-border bg-card/40 p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[11px] text-primary">{drone.id}</span>
                <DroneStatusBadge status={drone.status} />
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>{drone.position.lat.toFixed(2)}°N, {drone.position.lng.toFixed(2)}°E</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Crosshair className="w-2.5 h-2.5" />
                  <span>ALT {drone.position.altitude_m}m · {drone.position.speed_kmh} km/h</span>
                </div>
              </div>
              {drone.current_mission && (
                <div className="mt-1.5 px-2 py-1 rounded bg-primary/5 border border-primary/20">
                  <span className="font-mono text-[9px] text-primary tracking-wider">
                    MSN: {drone.current_mission.id} — {drone.current_mission.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch modal */}
      <AnimatePresence>
        {dispatchDrone && <DispatchModal drone={dispatchDrone} onClose={() => setDispatchDrone(null)} />}
      </AnimatePresence>
    </div>
  );
};
