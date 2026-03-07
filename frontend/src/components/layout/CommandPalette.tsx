import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map, AlertTriangle, BarChart2, Navigation, FileText, Settings, Layers, Brain, Inbox } from 'lucide-react';
import { easeSharp } from '@/lib/animation-tokens';
import { useUIStore } from '@/store/uiSlice';
import type { LayerId } from '@/types';

const NAV_RESULTS = [
  { icon: Map, label: 'Intelligence Map', path: '/app/map' },
  { icon: AlertTriangle, label: 'Events', path: '/app/events' },
  { icon: Brain, label: 'Intelligence', path: '/app/intelligence' },
  { icon: Navigation, label: 'Drone Fleet', path: '/app/drones' },
  { icon: FileText, label: 'Reports', path: '/app/reports' },
  { icon: Inbox, label: 'Submissions', path: '/app/submissions' },
  { icon: Settings, label: 'Settings', path: '/app/settings' },
];

const EVENT_RESULTS = [
  { id: 'EVT-0042', label: 'EVT-0042 — Armed Conflict — Northern Corridor' },
  { id: 'EVT-0038', label: 'EVT-0038 — Displacement — Eastern Settlement' },
];

const LAYER_RESULTS: { id: LayerId; label: string }[] = [
  { id: 'C1_armed_conflict', label: 'Toggle Armed Conflict' },
  { id: 'E1_drones', label: 'Toggle Drones' },
  { id: 'D1_risk_heatmap', label: 'Toggle Risk Heatmap' },
  { id: 'B1_humanitarian_ops', label: 'Toggle Humanitarian Ops' },
  { id: 'D5_conflict_arcs', label: 'Toggle Conflict Arcs' },
  { id: 'D4_satellite', label: 'Toggle Satellite Imagery' },
  { id: 'A4_frontlines', label: 'Toggle Frontlines' },
  { id: 'B4_no_go_zones', label: 'Toggle No-Go Zones' },
];

export const CommandPalette = () => {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape') setCommandPaletteOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  const q = query.toLowerCase();
  const filteredNav = NAV_RESULTS.filter((r) => r.label.toLowerCase().includes(q));
  const filteredEvents = EVENT_RESULTS.filter((r) => r.label.toLowerCase().includes(q));
  const filteredLayers = LAYER_RESULTS.filter((r) => r.label.toLowerCase().includes(q));

  const allResults = [
    ...filteredEvents.map((r) => ({ type: 'event' as const, ...r })),
    ...filteredLayers.map((r) => ({ type: 'layer' as const, ...r })),
    ...filteredNav.map((r) => ({ type: 'nav' as const, ...r })),
  ];

  const handleSelect = (index: number) => {
    const item = allResults[index];
    if (!item) return;
    if (item.type === 'nav' && 'path' in item) navigate(item.path);
    setCommandPaletteOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, allResults.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); handleSelect(selectedIndex); }
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
          style={{ background: 'rgba(10,14,26,0.75)', backdropFilter: 'blur(16px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCommandPaletteOpen(false)}
        >
          <motion.div
            className="w-full max-w-[640px] bg-popover border border-primary/40 rounded-sm overflow-hidden mx-4"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={easeSharp}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 h-12 border-b border-border">
              <Search className="w-4 h-4 text-primary" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground outline-none caret-primary"
                placeholder="Search commands, events, layers..."
              />
              <kbd className="font-mono text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">ESC</kbd>
            </div>

            <div className="max-h-[320px] overflow-y-auto py-2">
              {filteredEvents.length > 0 && (
                <div className="px-3 mb-1">
                  <p className="font-heading text-[9px] tracking-wider text-muted-foreground uppercase px-2 py-1">Events</p>
                  {filteredEvents.map((r, idx) => (
                    <button
                      key={r.id}
                      className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-sm text-left transition-colors ${
                        selectedIndex === idx ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-card'
                      }`}
                      onClick={() => handleSelect(idx)}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="font-mono text-xs">{r.label}</span>
                    </button>
                  ))}
                </div>
              )}
              {filteredLayers.length > 0 && (
                <div className="px-3 mb-1">
                  <p className="font-heading text-[9px] tracking-wider text-muted-foreground uppercase px-2 py-1">Layers</p>
                  {filteredLayers.map((r, idx) => {
                    const globalIdx = filteredEvents.length + idx;
                    return (
                      <button
                        key={r.id}
                        className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-sm text-left transition-colors ${
                          selectedIndex === globalIdx ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-card'
                        }`}
                        onClick={() => handleSelect(globalIdx)}
                      >
                        <Layers className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="font-mono text-xs">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {filteredNav.length > 0 && (
                <div className="px-3">
                  <p className="font-heading text-[9px] tracking-wider text-muted-foreground uppercase px-2 py-1">Navigation</p>
                  {filteredNav.map((r, idx) => {
                    const globalIdx = filteredEvents.length + filteredLayers.length + idx;
                    return (
                      <button
                        key={r.path}
                        className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-sm text-left transition-colors ${
                          selectedIndex === globalIdx ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-card'
                        }`}
                        onClick={() => handleSelect(globalIdx)}
                      >
                        <r.icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="font-mono text-xs">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {allResults.length === 0 && (
                <p className="text-center font-mono text-xs text-muted-foreground py-8">No results found</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
