import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Keyboard, Palette, Globe, Database, Activity } from 'lucide-react';
import { useAuthStore } from '@/store/authSlice';
import { PLACEHOLDER_PIPELINE_HEALTH } from '@/lib/placeholder-data';
import { PipelineStatusDot } from '@/components/shared/PipelineStatusDot';
import { SOURCE_ICONS } from '@/lib/icon-registry';
import { ONTOLOGY_ICONS } from '@/lib/icon-registry';

const SECTIONS = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'data', icon: Database, label: 'Data & Privacy' },
  { id: 'region', icon: Globe, label: 'Region' },
  { id: 'keyboard', icon: Keyboard, label: 'Keyboard Shortcuts' },
  { id: 'pipeline', icon: Activity, label: 'Data Pipeline', adminOnly: true },
  { id: 'ontology', icon: Database, label: 'Ontology Manager', adminOnly: true },
];

const SHORTCUTS = [
  { keys: ['F'], description: 'Open filter panel' },
  { keys: ['T'], description: 'Toggle timeline strip' },
  { keys: ['⌘', 'K'], description: 'Open command palette' },
  { keys: ['H'], description: 'Toggle HELIOS panel' },
  { keys: ['Esc'], description: 'Close panels / modals' },
];

const Toggle = ({ defaultOn = false }: { defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(!on)} className={`w-8 h-[18px] rounded-full transition-colors relative ${on ? 'bg-primary' : 'bg-border'}`}>
      <motion.div className="w-3.5 h-3.5 rounded-full bg-foreground absolute top-[2px]" animate={{ left: on ? 16 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
    </button>
  );
};

export const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const visibleSections = SECTIONS.filter(s => !s.adminOnly || isAdmin);

  return (
    <div className="absolute inset-0 flex pointer-events-auto" style={{ background: 'rgba(10,14,26,0.92)' }}>
      <div className="w-[200px] border-r border-border p-3 space-y-0.5 flex-shrink-0">
        <h1 className="font-heading text-sm tracking-wider text-foreground mb-4 px-2">SETTINGS</h1>
        {visibleSections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${activeSection === s.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <s.icon className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-2xl">
        {activeSection === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="font-heading text-sm tracking-wider text-foreground">PROFILE</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">NAME</label><input defaultValue={user?.name || 'Sarah Chen'} className="w-full bg-card border border-border rounded px-3 py-2 font-mono text-[11px] text-foreground outline-none focus:border-primary/40" /></div>
              <div><label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">EMAIL</label><input defaultValue={user?.email || 'sarah.chen@relief.io'} className="w-full bg-card border border-border rounded px-3 py-2 font-mono text-[11px] text-foreground outline-none focus:border-primary/40" /></div>
              <div><label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">ORGANISATION</label><input defaultValue={user?.organisation || 'RELIEF.IO'} className="w-full bg-card border border-border rounded px-3 py-2 font-mono text-[11px] text-foreground outline-none focus:border-primary/40" /></div>
              <div><label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">ROLE</label><input value={(user?.role || 'analyst').toUpperCase()} disabled className="w-full bg-background border border-border rounded px-3 py-2 font-mono text-[11px] text-muted-foreground" /></div>
            </div>
            <button className="font-mono text-[10px] tracking-wider px-4 py-2 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors border border-primary/30">SAVE CHANGES</button>
          </motion.div>
        )}

        {activeSection === 'notifications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="font-heading text-sm tracking-wider text-foreground">NOTIFICATIONS</h2>
            <div className="space-y-3">
              {[
                { label: 'Critical incident alerts', desc: 'Immediate alerts for severity: CRITICAL', default: true },
                { label: 'High severity alerts', desc: 'Alerts for severity: HIGH and above', default: true },
                { label: 'Drone status changes', desc: 'When a drone goes offline or low battery', default: true },
                { label: 'HELIOS recommendations', desc: 'AI-generated action recommendations', default: false },
              ].map(n => (
                <div key={n.label} className="flex items-center justify-between py-2 border-b border-border/50">
                  <div><p className="text-[12px] text-foreground">{n.label}</p><p className="text-[10px] text-muted-foreground">{n.desc}</p></div>
                  <Toggle defaultOn={n.default} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="font-heading text-sm tracking-wider text-foreground">SECURITY</h2>
            <div className="space-y-4">
              <div><label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">CURRENT PASSWORD</label><input type="password" className="w-full bg-card border border-border rounded px-3 py-2 font-mono text-[11px] text-foreground outline-none focus:border-primary/40" /></div>
              <div><label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">NEW PASSWORD</label><input type="password" className="w-full bg-card border border-border rounded px-3 py-2 font-mono text-[11px] text-foreground outline-none focus:border-primary/40" /></div>
              <button className="font-mono text-[10px] tracking-wider px-4 py-2 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors border border-primary/30">UPDATE PASSWORD</button>
            </div>
          </motion.div>
        )}

        {activeSection === 'appearance' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="font-heading text-sm tracking-wider text-foreground">APPEARANCE</h2>
            <div className="space-y-3">
              {[{ label: 'Reduced motion', desc: 'Minimize animations' }, { label: 'High contrast markers', desc: 'Increase marker visibility on map' }].map(n => (
                <div key={n.label} className="flex items-center justify-between py-2 border-b border-border/50">
                  <div><p className="text-[12px] text-foreground">{n.label}</p><p className="text-[10px] text-muted-foreground">{n.desc}</p></div>
                  <Toggle />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'data' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="font-heading text-sm tracking-wider text-foreground">DATA & PRIVACY</h2>
            <div className="space-y-3">
              {[{ label: 'Share usage analytics', desc: 'Help improve HIP', default: true }, { label: 'Cache map tiles locally', desc: 'Store tiles for faster loading', default: true }].map(n => (
                <div key={n.label} className="flex items-center justify-between py-2 border-b border-border/50">
                  <div><p className="text-[12px] text-foreground">{n.label}</p><p className="text-[10px] text-muted-foreground">{n.desc}</p></div>
                  <Toggle defaultOn={n.default} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'region' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="font-heading text-sm tracking-wider text-foreground">REGION</h2>
            <div className="space-y-4">
              <div><label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">DEFAULT MAP REGION</label><select className="w-full bg-card border border-border rounded px-3 py-2 font-mono text-[11px] text-foreground outline-none"><option>Sahel — Chad Region</option><option>Lake Chad Basin</option><option>Global View</option></select></div>
              <div><label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">TIMEZONE</label><select className="w-full bg-card border border-border rounded px-3 py-2 font-mono text-[11px] text-foreground outline-none"><option>UTC</option><option>UTC+1 (WAT)</option></select></div>
            </div>
          </motion.div>
        )}

        {activeSection === 'keyboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="font-heading text-sm tracking-wider text-foreground">KEYBOARD SHORTCUTS</h2>
            <div className="space-y-1">
              {SHORTCUTS.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-[12px] text-foreground">{s.description}</span>
                  <div className="flex gap-1">{s.keys.map(k => <span key={k} className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded border border-border bg-card font-mono text-[10px] text-muted-foreground">{k}</span>)}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'pipeline' && isAdmin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="font-heading text-sm tracking-wider text-foreground">DATA PIPELINE</h2>
            <div className="space-y-2">
              {PLACEHOLDER_PIPELINE_HEALTH.map(p => {
                const sourceMeta = SOURCE_ICONS[p.source_type];
                const timeDiff = Math.round((Date.now() - new Date(p.last_event_at).getTime()) / 60000);
                return (
                  <div key={p.source_type} className="flex items-center gap-3 bg-card border border-border rounded-sm p-3">
                    <span className="text-lg">{sourceMeta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-foreground">{sourceMeta.label}</span>
                        <PipelineStatusDot status={p.status} />
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-[9px] text-muted-foreground font-mono">
                        <span>Last event: {timeDiff}m ago</span>
                        <span>Events today: {p.events_today}</span>
                        {p.notes && <span className="text-[hsl(var(--hip-warn))]">⚠ {p.notes}</span>}
                      </div>
                    </div>
                    <button className="font-mono text-[8px] text-muted-foreground hover:text-foreground px-2 py-1 rounded-sm border border-border">
                      VIEW LOGS
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeSection === 'ontology' && isAdmin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="font-heading text-sm tracking-wider text-foreground">ONTOLOGY MANAGER</h2>
            <p className="text-[11px] text-muted-foreground">Manage ontology class display names, icons, and colours. Changes reflect on the map immediately.</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left font-mono text-[9px] text-muted-foreground tracking-wider px-2 py-2">ICON</th>
                    <th className="text-left font-mono text-[9px] text-muted-foreground tracking-wider px-2 py-2">CLASS</th>
                    <th className="text-left font-mono text-[9px] text-muted-foreground tracking-wider px-2 py-2">LABEL</th>
                    <th className="text-left font-mono text-[9px] text-muted-foreground tracking-wider px-2 py-2">EDIT</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(ONTOLOGY_ICONS).slice(0, 10).map(([key, val]) => (
                    <tr key={key} className="border-b border-border/50">
                      <td className="px-2 py-2 text-lg">{val.symbol}</td>
                      <td className="px-2 py-2 font-mono text-[10px] text-foreground">{key}</td>
                      <td className="px-2 py-2 text-[10px] text-foreground/80">{val.label}</td>
                      <td className="px-2 py-2">
                        <button className="font-mono text-[8px] text-primary hover:text-primary/80">EDIT</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
