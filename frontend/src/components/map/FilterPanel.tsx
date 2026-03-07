import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, RotateCcw } from 'lucide-react';
import { useUIStore } from '@/store/uiSlice';
import { useFilterStore } from '@/store/filterSlice';
import { Checkbox } from '@/components/ui/checkbox';
import { PLACEHOLDER_NGOS } from '@/lib/placeholder-data';
import type { Severity, EventVerificationStatus, SourceType } from '@/types';
import { SOURCE_ICONS } from '@/lib/icon-registry';

const SEVERITY_OPTIONS: { value: Severity; label: string; color: string }[] = [
  { value: 'critical', label: 'Critical', color: 'hsl(var(--hip-critical))' },
  { value: 'high', label: 'High', color: 'hsl(var(--hip-high))' },
  { value: 'medium', label: 'Medium', color: 'hsl(var(--hip-medium))' },
  { value: 'low', label: 'Low', color: 'hsl(var(--hip-low))' },
];

const ONTOLOGY_GROUP_OPTIONS = [
  { value: 'armed_conflict', label: 'Armed Conflict' },
  { value: 'displacement', label: 'Displacement' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'aid_humanitarian', label: 'Aid & Humanitarian' },
  { value: 'natural', label: 'Natural & Environmental' },
] as const;

const VERIFICATION_OPTIONS: { value: 'all' | EventVerificationStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'verified', label: 'Verified' },
  { value: 'unverified', label: 'Unverified' },
  { value: 'pending', label: 'Pending' },
  { value: 'disputed', label: 'Disputed' },
];

const ALL_SOURCES: SourceType[] = ['news_agent', 'user_submission', 'satellite', 'weather_api', 'drone', 'analyst_input'];

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-heading text-[10px] tracking-widest text-muted-foreground mb-2 uppercase">{children}</h3>
);

export const FilterPanel = () => {
  const { filterPanelOpen, setFilterPanelOpen } = useUIStore();
  const { timeRange, severities, sourcesVisible, ngoZoneIds, verificationStatus, setFilter, resetFilters } = useFilterStore();

  const toggleSeverity = (s: Severity) => {
    const next = severities.includes(s) ? severities.filter(x => x !== s) : [...severities, s];
    setFilter('severities', next);
  };

  const toggleSource = (s: SourceType) => {
    const next = sourcesVisible.includes(s) ? sourcesVisible.filter(x => x !== s) : [...sourcesVisible, s];
    setFilter('sourcesVisible', next);
  };

  const toggleNgo = (id: string) => {
    const next = ngoZoneIds.includes(id) ? ngoZoneIds.filter(x => x !== id) : [...ngoZoneIds, id];
    setFilter('ngoZoneIds', next);
  };

  return (
    <AnimatePresence>
      {filterPanelOpen && (
        <motion.div
          className="absolute top-0 left-0 bottom-0 z-30 w-[280px] pointer-events-auto flex flex-col border-r"
          style={{ background: 'rgba(26,32,53,0.96)', backdropFilter: 'blur(8px)', borderColor: 'hsl(var(--border))' }}
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div className="flex items-center justify-between h-10 px-3 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-primary" />
              <span className="font-heading text-[11px] tracking-wider text-foreground">FILTERS</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={resetFilters} className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="Reset">
                <RotateCcw className="w-3 h-3" />
              </button>
              <button onClick={() => setFilterPanelOpen(false)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
            {/* Time Range */}
            <section>
              <SectionHeader>Time Range</SectionHeader>
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] text-muted-foreground">FROM</label>
                <input
                  type="datetime-local"
                  value={timeRange.start.slice(0, 16)}
                  onChange={e => setFilter('timeRange', { ...timeRange, start: e.target.value + ':00Z' })}
                  className="w-full bg-card border border-border rounded-sm px-2 py-1 font-mono text-[10px] text-foreground outline-none focus:border-primary/50"
                />
                <label className="font-mono text-[9px] text-muted-foreground">TO</label>
                <input
                  type="datetime-local"
                  value={timeRange.end.slice(0, 16)}
                  onChange={e => setFilter('timeRange', { ...timeRange, end: e.target.value + ':00Z' })}
                  className="w-full bg-card border border-border rounded-sm px-2 py-1 font-mono text-[10px] text-foreground outline-none focus:border-primary/50"
                />
              </div>
            </section>

            {/* Severity */}
            <section>
              <SectionHeader>Severity</SectionHeader>
              <div className="space-y-1.5">
                {SEVERITY_OPTIONS.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      checked={severities.includes(opt.value)}
                      onCheckedChange={() => toggleSeverity(opt.value)}
                      className="h-3.5 w-3.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div className="w-2 h-2 rounded-full" style={{ background: opt.color }} />
                    <span className="font-mono text-[10px] text-foreground group-hover:text-primary transition-colors">{opt.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Source Types */}
            <section>
              <SectionHeader>Sources</SectionHeader>
              <div className="flex flex-wrap gap-1.5">
                {ALL_SOURCES.map(s => {
                  const meta = SOURCE_ICONS[s];
                  const active = sourcesVisible.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSource(s)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-sm font-mono text-[9px] border transition-colors ${
                        active
                          ? 'bg-primary/15 border-primary/40 text-primary'
                          : 'bg-card border-border text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      <span>{meta.icon}</span>
                      <span>{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* NGO Zones */}
            <section>
              <SectionHeader>NGO Zones</SectionHeader>
              <div className="space-y-1.5">
                {PLACEHOLDER_NGOS.map(ngo => (
                  <label key={ngo.id} className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      checked={ngoZoneIds.includes(ngo.id)}
                      onCheckedChange={() => toggleNgo(ngo.id)}
                      className="h-3.5 w-3.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ngo.colour }} />
                    <span className="font-mono text-[10px] text-foreground group-hover:text-primary transition-colors">{ngo.abbreviation}</span>
                    <span className="font-mono text-[8px] text-muted-foreground ml-auto">{ngo.zone_name}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Verification */}
            <section>
              <SectionHeader>Verification</SectionHeader>
              <div className="flex flex-wrap gap-1">
                {VERIFICATION_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFilter('verificationStatus', opt.value)}
                    className={`px-2 py-1 rounded-sm font-mono text-[9px] tracking-wide border transition-colors ${
                      verificationStatus === opt.value
                        ? 'bg-primary/20 border-primary/50 text-primary'
                        : 'bg-card border-border text-muted-foreground hover:border-primary/30'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="px-3 py-2 border-t border-border flex-shrink-0">
            <span className="font-mono text-[9px] text-muted-foreground">
              {severities.length}/4 severities · {sourcesVisible.length}/6 sources
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
