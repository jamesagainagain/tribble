import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Radio, ChevronDown, ChevronUp, X } from 'lucide-react';
import { CONFLICT_ZONES, CONFLICT_NEWS_FEED, type ConflictZone, type ConflictNewsItem } from '@/lib/conflict-zones';

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-[hsl(var(--hip-critical))]',
  high: 'bg-[hsl(var(--hip-high))]',
  medium: 'bg-[hsl(var(--hip-medium))]',
  low: 'bg-[hsl(var(--hip-low))]',
};

const SEVERITY_TEXT: Record<string, string> = {
  critical: 'text-[hsl(var(--hip-critical))]',
  high: 'text-[hsl(var(--hip-high))]',
  medium: 'text-[hsl(var(--hip-medium))]',
  low: 'text-[hsl(var(--hip-low))]',
};

interface Props {
  activeZoneId: string | null;
  onSelectZone: (zone: ConflictZone) => void;
  onClearZone: () => void;
}

export const ConflictTicker = ({ activeZoneId, onSelectZone, onClearZone }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const filteredNews = activeZoneId
    ? CONFLICT_NEWS_FEED.filter(n => n.zoneId === activeZoneId)
    : CONFLICT_NEWS_FEED;

  const activeZone = CONFLICT_ZONES.find(z => z.id === activeZoneId);

  const timeSince = (ts: string) => {
    const mins = Math.round((Date.now() - new Date(ts).getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h`;
    return `${Math.floor(mins / 1440)}d`;
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-auto">
      {/* Breaking news ticker bar */}
      <div className="bg-card/95 backdrop-blur-md border-b border-border">
        {/* Top ticker strip */}
        <div className="flex items-center h-7 overflow-hidden">
          <div className="flex-shrink-0 flex items-center gap-1.5 px-3 border-r border-border h-full bg-[hsl(var(--hip-critical))]/10">
            <Radio className="w-3 h-3 text-[hsl(var(--hip-critical))] animate-pulse" />
            <span className="font-mono text-[9px] font-bold tracking-widest text-[hsl(var(--hip-critical))]">LIVE</span>
          </div>
          
          <div className="flex-1 overflow-hidden relative">
            <div
              className="flex items-center gap-6 whitespace-nowrap animate-marquee"
            >
              {[...CONFLICT_NEWS_FEED, ...CONFLICT_NEWS_FEED].map((item, i) => (
                <button
                  key={`${item.id}-${i}`}
                  className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
                  onClick={() => {
                    const zone = CONFLICT_ZONES.find(z => z.id === item.zoneId);
                    if (zone) onSelectZone(zone);
                  }}
                >
                  {item.breaking && (
                    <span className="font-mono text-[8px] font-bold tracking-widest text-[hsl(var(--hip-critical))] bg-[hsl(var(--hip-critical))]/10 px-1 rounded-sm">
                      BREAKING
                    </span>
                  )}
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${SEVERITY_DOT[item.severity]}`} />
                  <span className="font-mono text-[9px] text-muted-foreground">{item.source}</span>
                  <span className="text-[10px] text-foreground/80">{item.headline}</span>
                  <span className="font-mono text-[8px] text-muted-foreground">{timeSince(item.timestamp)}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 px-2 h-full border-l border-border hover:bg-popover/50 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
          </button>
        </div>

        {/* Conflict zone chips */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-t border-border/50">
          <span className="font-mono text-[8px] text-muted-foreground tracking-wider mr-1">ZONES</span>
          {CONFLICT_ZONES.map(zone => {
            const isActive = zone.id === activeZoneId;
            return (
              <button
                key={zone.id}
                onClick={() => isActive ? onClearZone() : onSelectZone(zone)}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-sm border font-mono text-[9px] transition-all ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY_DOT[zone.severity]} ${zone.severity === 'critical' ? 'animate-pulse' : ''}`} />
                <span className="tracking-wider">{zone.name}</span>
                <span className="text-[8px] opacity-60">{zone.activeIncidents}</span>
              </button>
            );
          })}
          {activeZoneId && (
            <button
              onClick={onClearZone}
              className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded-sm border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-2.5 h-2.5" />
              <span className="font-mono text-[8px] tracking-wider">CLEAR</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded news feed panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card/95 backdrop-blur-md border-b border-border overflow-hidden"
          >
            {/* Active zone summary */}
            {activeZone && (
              <div className="px-3 py-2 border-b border-border/50 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-3.5 h-3.5 ${SEVERITY_TEXT[activeZone.severity]}`} />
                    <span className="font-heading font-bold text-xs tracking-wider text-foreground">{activeZone.name}</span>
                    <span className="font-mono text-[9px] text-muted-foreground">{activeZone.region}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="font-mono text-[10px] font-bold text-[hsl(var(--hip-critical))]">{activeZone.activeIncidents}</p>
                      <p className="font-mono text-[7px] text-muted-foreground">INCIDENTS</p>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-[10px] font-bold text-[hsl(var(--hip-high))]">{activeZone.displaced}</p>
                      <p className="font-mono text-[7px] text-muted-foreground">DISPLACED</p>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-[10px] font-bold text-foreground">{activeZone.routes.filter(r => r.status === 'blocked' || r.status === 'destroyed').length}/{activeZone.routes.length}</p>
                      <p className="font-mono text-[7px] text-muted-foreground">BLOCKED</p>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{activeZone.description}</p>
              </div>
            )}

            {/* News items */}
            <div className="max-h-[240px] overflow-y-auto">
              {filteredNews.map(item => (
                <button
                  key={item.id}
                  className="w-full flex items-start gap-2 px-3 py-2 border-b border-border/30 hover:bg-popover/30 transition-colors text-left"
                  onClick={() => {
                    const zone = CONFLICT_ZONES.find(z => z.id === item.zoneId);
                    if (zone) onSelectZone(zone);
                  }}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${SEVERITY_DOT[item.severity]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {item.breaking && (
                        <span className="font-mono text-[7px] font-bold tracking-widest text-[hsl(var(--hip-critical))] bg-[hsl(var(--hip-critical))]/10 px-1 rounded-sm">BREAKING</span>
                      )}
                      <span className="font-mono text-[8px] text-primary">{item.source}</span>
                      <span className="font-mono text-[8px] text-muted-foreground">{timeSince(item.timestamp)}</span>
                      <span className="font-mono text-[8px] text-muted-foreground ml-auto">
                        {CONFLICT_ZONES.find(z => z.id === item.zoneId)?.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-foreground/80 mt-0.5 line-clamp-1">{item.headline}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
