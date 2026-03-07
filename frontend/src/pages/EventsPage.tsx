import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, X, MapPin, Clock, ExternalLink, CheckSquare, Square, Plus, Eye } from 'lucide-react';
import { PLACEHOLDER_EVENTS, PLACEHOLDER_NGOS } from '@/lib/placeholder-data';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { OntologyBadge } from '@/components/shared/OntologyBadge';
import { SourceBadge } from '@/components/shared/SourceBadge';
import { ConfidenceBar } from '@/components/shared/ConfidenceBar';
import { SOURCE_ICONS, ONTOLOGY_ICONS } from '@/lib/icon-registry';
import type { HipEvent, Severity, OntologyClass, SourceType } from '@/types';

const SEVERITY_ORDER: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const ALL_SOURCES: SourceType[] = ['news_agent', 'user_submission', 'satellite', 'weather_api', 'drone', 'analyst_input'];

type SortKey = 'id' | 'severity' | 'timestamp' | 'confidence_score' | 'location_name';
type SortDir = 'asc' | 'desc';

const VERIFICATION_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  verified: { bg: 'bg-[hsl(var(--hip-green))]/10', text: 'text-[hsl(var(--hip-green))]', label: 'VERIFIED ✓' },
  pending: { bg: 'bg-[hsl(var(--hip-warn))]/10', text: 'text-[hsl(var(--hip-warn))]', label: 'PENDING' },
  unverified: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'UNVERIFIED' },
  disputed: { bg: 'bg-secondary/10', text: 'text-secondary', label: 'DISPUTED' },
  escalated: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'ESCALATED' },
};

const EventDetailPanel = ({ event, onClose }: { event: HipEvent; onClose: () => void }) => {
  const vStyle = VERIFICATION_STYLES[event.verification_status] || VERIFICATION_STYLES.pending;
  const assignedNgos = PLACEHOLDER_NGOS.filter(n => event.assigned_ngo_ids.includes(n.id));

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute right-0 top-0 bottom-0 w-[380px] bg-card border-l border-border z-20 overflow-y-auto"
    >
      <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] text-primary">{event.id}</span>
          <SeverityBadge severity={event.severity} />
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 space-y-4">
        {/* Source attribution */}
        <div className="flex items-center gap-2 flex-wrap">
          <SourceBadge sourceType={event.source_type} label={event.source_label} />
          <span className="font-mono text-[9px] text-muted-foreground">
            Confidence {event.confidence_score.toFixed(2)}
          </span>
        </div>

        {/* Ontology */}
        <OntologyBadge ontologyClass={event.ontology_class} />

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className={`font-mono text-[9px] tracking-wider px-2 py-0.5 rounded-sm ${vStyle.bg} ${vStyle.text}`}>
            {vStyle.label}
          </span>
          {event.verified_by && <span className="font-mono text-[9px] text-muted-foreground">by {event.verified_by}</span>}
        </div>

        {/* Location & Time */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <div>
              <p className="font-mono text-[10px] text-foreground">{event.location_name}</p>
              <p className="font-mono text-[9px] text-muted-foreground">{event.lat.toFixed(3)}°N, {event.lng.toFixed(3)}°E</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="font-mono text-[10px] text-foreground">{new Date(event.timestamp).toLocaleString()}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <span className="font-heading text-[10px] tracking-wider text-muted-foreground">DESCRIPTION</span>
          <p className="text-[11px] text-foreground/80 leading-relaxed mt-1">{event.description}</p>
        </div>

        {/* Confidence */}
        <div>
          <span className="font-heading text-[10px] tracking-wider text-muted-foreground">CONFIDENCE</span>
          <div className="mt-1">
            <ConfidenceBar score={event.confidence_score} />
          </div>
        </div>

        {/* NGOs */}
        {assignedNgos.length > 0 && (
          <div>
            <span className="font-heading text-[10px] tracking-wider text-muted-foreground">ASSIGNED NGOs</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {assignedNgos.map(ngo => (
                <span key={ngo.id} className="flex items-center gap-1.5 bg-card border border-border rounded-sm px-2 py-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: ngo.colour }} />
                  <span className="font-mono text-[9px] text-foreground">{ngo.abbreviation}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Events */}
        {event.related_event_ids.length > 0 && (
          <div>
            <span className="font-heading text-[10px] tracking-wider text-muted-foreground">RELATED EVENTS</span>
            <div className="space-y-1 mt-1.5">
              {event.related_event_ids.map(id => (
                <span key={id} className="block font-mono text-[10px] text-primary">{id}</span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <button className="flex-1 font-mono text-[9px] tracking-wider py-1.5 rounded-sm bg-[hsl(var(--hip-green))]/20 text-[hsl(var(--hip-green))] border border-[hsl(var(--hip-green))]/30 hover:bg-[hsl(var(--hip-green))]/30 transition-colors">
            MARK VERIFIED
          </button>
          <button className="flex-1 font-mono text-[9px] tracking-wider py-1.5 rounded-sm bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 transition-colors">
            ESCALATE
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const EventsPage = () => {
  const [search, setSearch] = useState('');
  const [severityFilters, setSeverityFilters] = useState<Severity[]>([]);
  const [sourceFilters, setSourceFilters] = useState<SourceType[]>(ALL_SOURCES);
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSeverity = (s: Severity) => {
    setSeverityFilters(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };
  const toggleSource = (s: SourceType) => {
    setSourceFilters(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };
  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    let data = [...PLACEHOLDER_EVENTS];
    if (search) data = data.filter(e => e.id.toLowerCase().includes(search.toLowerCase()) || e.location_name.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase()));
    if (severityFilters.length) data = data.filter(e => severityFilters.includes(e.severity));
    data = data.filter(e => sourceFilters.includes(e.source_type));
    if (verificationFilter !== 'all') data = data.filter(e => e.verification_status === verificationFilter);
    data.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'severity') cmp = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
      else if (sortKey === 'timestamp') cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      else if (sortKey === 'confidence_score') cmp = a.confidence_score - b.confidence_score;
      else if (sortKey === 'id') cmp = a.id.localeCompare(b.id);
      else cmp = a.location_name.localeCompare(b.location_name);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [search, severityFilters, sourceFilters, verificationFilter, sortKey, sortDir]);

  const selectedEvent = PLACEHOLDER_EVENTS.find(e => e.id === selectedId);
  const SortIcon = sortDir === 'asc' ? ChevronUp : ChevronDown;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };
  const allSelected = filtered.length > 0 && filtered.every(e => selectedIds.has(e.id));

  return (
    <div className="absolute inset-0 flex pointer-events-auto" style={{ background: 'rgba(10,14,26,0.94)', backdropFilter: 'blur(4px)' }}>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-sm tracking-wider text-foreground">EVENT BROWSER</h1>
            <button className="font-mono text-[9px] text-muted-foreground hover:text-foreground px-2 py-1 rounded-sm border border-border">EXPORT ▾</button>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <>
                <span className="font-mono text-[10px] text-primary">{selectedIds.size} SELECTED</span>
                <button className="font-mono text-[9px] text-[hsl(var(--hip-green))] px-2 py-1 rounded-sm border border-[hsl(var(--hip-green))]/30">VERIFY SELECTED</button>
                <button className="font-mono text-[9px] text-muted-foreground px-2 py-1 rounded-sm border border-border">EXPORT</button>
              </>
            )}
            <button className="flex items-center gap-1 font-mono text-[10px] text-primary px-2 py-1 rounded-sm border border-primary/30 hover:bg-primary/10 transition-colors">
              <Plus className="w-3 h-3" /> NEW EVENT
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border flex-shrink-0 flex-wrap">
          <div className="flex items-center gap-2 bg-card border border-border rounded-sm px-2 py-1 flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." className="bg-transparent font-mono text-[11px] text-foreground placeholder:text-muted-foreground outline-none flex-1" />
          </div>
          {/* Source pills */}
          <div className="flex gap-0.5">
            {ALL_SOURCES.map(s => {
              const meta = SOURCE_ICONS[s];
              return (
                <button key={s} onClick={() => toggleSource(s)} className={`px-1 py-0.5 rounded-sm text-[9px] transition-colors ${sourceFilters.includes(s) ? 'bg-popover text-primary' : 'text-muted-foreground/30'}`} title={meta.label}>
                  {meta.icon}
                </button>
              );
            })}
          </div>
          {/* Severity */}
          <div className="flex gap-1">
            {(['critical', 'high', 'medium', 'low'] as Severity[]).map(s => (
              <button key={s} onClick={() => toggleSeverity(s)} className={`font-mono text-[8px] tracking-wider px-1.5 py-0.5 rounded-sm border transition-colors ${severityFilters.includes(s) ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          {/* Verification */}
          <select value={verificationFilter} onChange={e => setVerificationFilter(e.target.value)} className="bg-card border border-border rounded-sm px-1.5 py-0.5 font-mono text-[9px] text-foreground outline-none">
            <option value="all">ALL STATUS</option>
            <option value="verified">VERIFIED</option>
            <option value="pending">PENDING</option>
            <option value="unverified">UNVERIFIED</option>
            <option value="disputed">DISPUTED</option>
          </select>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b border-border">
                <th className="w-8 px-3 py-2">
                  <button onClick={() => allSelected ? setSelectedIds(new Set()) : setSelectedIds(new Set(filtered.map(e => e.id)))}>
                    {allSelected ? <CheckSquare className="w-3.5 h-3.5 text-primary" /> : <Square className="w-3.5 h-3.5 text-muted-foreground" />}
                  </button>
                </th>
                {[
                  { key: 'id' as SortKey, label: 'ID' },
                  { key: 'severity' as SortKey, label: 'CLASS' },
                  { key: 'severity' as SortKey, label: 'SEVERITY' },
                  { key: 'location_name' as SortKey, label: 'SOURCE' },
                  { key: 'location_name' as SortKey, label: 'LOCATION' },
                  { key: 'timestamp' as SortKey, label: 'DATE' },
                  { key: 'confidence_score' as SortKey, label: 'CONFIDENCE' },
                ].map((col, i) => (
                  <th key={i} className="text-left px-2 py-2 cursor-pointer select-none" onClick={() => toggleSort(col.key)}>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[8px] text-muted-foreground tracking-wider">{col.label}</span>
                      {sortKey === col.key && <SortIcon className="w-3 h-3 text-primary" />}
                    </div>
                  </th>
                ))}
                <th className="text-left px-2 py-2"><span className="font-mono text-[8px] text-muted-foreground tracking-wider">STATUS</span></th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(evt => {
                const vStyle = VERIFICATION_STYLES[evt.verification_status] || VERIFICATION_STYLES.pending;
                return (
                  <tr
                    key={evt.id}
                    onClick={() => setSelectedId(evt.id)}
                    className={`border-b border-border/50 cursor-pointer transition-colors hover:bg-card/60 ${selectedId === evt.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                  >
                    <td className="px-3 py-2" onClick={e => { e.stopPropagation(); toggleSelect(evt.id); }}>
                      {selectedIds.has(evt.id) ? <CheckSquare className="w-3.5 h-3.5 text-primary" /> : <Square className="w-3.5 h-3.5 text-muted-foreground" />}
                    </td>
                    <td className="px-2 py-2 font-mono text-[10px] text-primary">{evt.id}</td>
                    <td className="px-2 py-2">
                      <span className="inline-flex items-center gap-1 text-[9px]">
                        <span>{ONTOLOGY_ICONS[evt.ontology_class]?.symbol}</span>
                        <span className="text-foreground/70">{ONTOLOGY_ICONS[evt.ontology_class]?.label}</span>
                      </span>
                    </td>
                    <td className="px-2 py-2"><SeverityBadge severity={evt.severity} /></td>
                    <td className="px-2 py-2">
                      <span className="text-[9px]">{SOURCE_ICONS[evt.source_type]?.icon} {SOURCE_ICONS[evt.source_type]?.label}</span>
                    </td>
                    <td className="px-2 py-2 text-[10px] text-foreground/70 max-w-[140px] truncate">{evt.location_name}</td>
                    <td className="px-2 py-2 font-mono text-[9px] text-muted-foreground">{new Date(evt.timestamp).toLocaleDateString()}</td>
                    <td className="px-2 py-2 w-24"><ConfidenceBar score={evt.confidence_score} showLabel={false} /></td>
                    <td className="px-2 py-2">
                      <span className={`font-mono text-[8px] tracking-wider px-1.5 py-0.5 rounded-sm ${vStyle.bg} ${vStyle.text}`}>{vStyle.label}</span>
                    </td>
                    <td className="px-2 py-2">
                      <Eye className="w-3 h-3 text-muted-foreground" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedEvent && <EventDetailPanel event={selectedEvent} onClose={() => setSelectedId(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default EventsPage;
