import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, X, MapPin, Clock, ExternalLink, CheckSquare, Square } from 'lucide-react';
import { PLACEHOLDER_INCIDENTS } from '@/lib/placeholder-data';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import type { Incident, Severity } from '@/types';

const SEVERITY_ORDER: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };

type SortKey = 'id' | 'severity' | 'timestamp' | 'risk_score' | 'location_name';
type SortDir = 'asc' | 'desc';

const DetailPanel = ({ incident, onClose }: { incident: Incident; onClose: () => void }) => (
  <motion.div
    initial={{ x: 400, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 400, opacity: 0 }}
    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    className="absolute right-0 top-0 bottom-0 w-[360px] bg-card border-l border-border z-20 overflow-y-auto"
  >
    <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between z-10">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[12px] text-primary">{incident.id}</span>
        <SeverityBadge severity={incident.severity} />
      </div>
      <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
        <X className="w-4 h-4" />
      </button>
    </div>
    <div className="p-4 space-y-4">
      <div>
        <span className="font-mono text-[9px] text-muted-foreground tracking-wider">DESCRIPTION</span>
        <p className="text-[12px] text-foreground/90 mt-1 leading-relaxed">{incident.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="font-mono text-[9px] text-muted-foreground tracking-wider">LOCATION</span>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-primary" />
            <span className="text-[11px] text-foreground">{incident.location_name}</span>
          </div>
        </div>
        <div>
          <span className="font-mono text-[9px] text-muted-foreground tracking-wider">COORDINATES</span>
          <p className="font-mono text-[11px] text-foreground mt-1">{incident.lat.toFixed(4)}°N, {incident.lng.toFixed(4)}°E</p>
        </div>
        <div>
          <span className="font-mono text-[9px] text-muted-foreground tracking-wider">RISK SCORE</span>
          <p className="font-mono text-[18px] text-foreground mt-1">{incident.risk_score}<span className="text-[10px] text-muted-foreground">/100</span></p>
        </div>
        <div>
          <span className="font-mono text-[9px] text-muted-foreground tracking-wider">TIMESTAMP</span>
          <div className="flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px] text-foreground">{new Date(incident.timestamp).toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div>
        <span className="font-mono text-[9px] text-muted-foreground tracking-wider">VERIFICATION</span>
        <div className="flex items-center gap-2 mt-1">
          <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${
            incident.verification_status === 'verified' ? 'bg-hip-green/10 text-hip-green' :
            incident.verification_status === 'pending' ? 'bg-hip-medium/10 text-hip-medium' :
            'bg-hip-critical/10 text-hip-critical'
          }`}>{incident.verification_status.toUpperCase()}</span>
          {incident.verified_by && <span className="font-mono text-[10px] text-muted-foreground">{incident.verified_by}</span>}
        </div>
      </div>
      <div>
        <span className="font-mono text-[9px] text-muted-foreground tracking-wider">TYPE</span>
        <p className="font-mono text-[11px] text-primary mt-1 uppercase">{incident.type.replace('_', ' ')}</p>
      </div>
    </div>
  </motion.div>
);

export const IncidentsPage = () => {
  const [search, setSearch] = useState('');
  const [severityFilters, setSeverityFilters] = useState<Severity[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSeverity = (s: Severity) => {
    setSeverityFilters(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    let data = [...PLACEHOLDER_INCIDENTS];
    if (search) data = data.filter(i => i.id.toLowerCase().includes(search.toLowerCase()) || i.location_name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()));
    if (severityFilters.length) data = data.filter(i => severityFilters.includes(i.severity));
    data.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'severity') cmp = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
      else if (sortKey === 'timestamp') cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      else if (sortKey === 'risk_score') cmp = a.risk_score - b.risk_score;
      else if (sortKey === 'id') cmp = a.id.localeCompare(b.id);
      else cmp = a.location_name.localeCompare(b.location_name);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [search, severityFilters, sortKey, sortDir]);

  const selectedIncident = PLACEHOLDER_INCIDENTS.find(i => i.id === selectedId);
  const SortIcon = sortDir === 'asc' ? ChevronUp : ChevronDown;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSelected = filtered.length > 0 && filtered.every(i => selectedIds.has(i.id));

  return (
    <div className="absolute inset-0 flex pointer-events-auto" style={{ background: 'rgba(10,14,26,0.9)' }}>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
          <h1 className="font-heading text-sm tracking-wider text-foreground">INCIDENT BROWSER</h1>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-primary">{selectedIds.size} SELECTED</span>
              <button className="font-mono text-[10px] text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border">EXPORT</button>
              <button className="font-mono text-[10px] text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border">ASSIGN</button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2 bg-card border border-border rounded px-2 py-1 flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search incidents..."
              className="bg-transparent font-mono text-[11px] text-foreground placeholder:text-muted-foreground outline-none flex-1"
            />
          </div>
          <div className="flex gap-1.5">
            {(['critical', 'high', 'medium', 'low'] as Severity[]).map(s => (
              <button
                key={s}
                onClick={() => toggleSeverity(s)}
                className={`font-mono text-[9px] tracking-wider px-2 py-1 rounded border transition-colors ${
                  severityFilters.includes(s) ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b border-border">
                <th className="w-8 px-3 py-2">
                  <button onClick={() => allSelected ? setSelectedIds(new Set()) : setSelectedIds(new Set(filtered.map(i => i.id)))}>
                    {allSelected ? <CheckSquare className="w-3.5 h-3.5 text-primary" /> : <Square className="w-3.5 h-3.5 text-muted-foreground" />}
                  </button>
                </th>
                {[
                  { key: 'id' as SortKey, label: 'ID' },
                  { key: 'severity' as SortKey, label: 'SEVERITY' },
                  { key: 'location_name' as SortKey, label: 'LOCATION' },
                  { key: 'timestamp' as SortKey, label: 'TIME' },
                  { key: 'risk_score' as SortKey, label: 'RISK' },
                ].map(col => (
                  <th key={col.key} className="text-left px-3 py-2 cursor-pointer select-none" onClick={() => toggleSort(col.key)}>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[9px] text-muted-foreground tracking-wider">{col.label}</span>
                      {sortKey === col.key && <SortIcon className="w-3 h-3 text-primary" />}
                    </div>
                  </th>
                ))}
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(inc => (
                <tr
                  key={inc.id}
                  onClick={() => setSelectedId(inc.id)}
                  className={`border-b border-border/50 cursor-pointer transition-colors hover:bg-card/60 ${
                    selectedId === inc.id ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="px-3 py-2" onClick={e => { e.stopPropagation(); toggleSelect(inc.id); }}>
                    {selectedIds.has(inc.id)
                      ? <CheckSquare className="w-3.5 h-3.5 text-primary" />
                      : <Square className="w-3.5 h-3.5 text-muted-foreground" />
                    }
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-primary">{inc.id}</td>
                  <td className="px-3 py-2"><SeverityBadge severity={inc.severity} /></td>
                  <td className="px-3 py-2 text-[11px] text-foreground/80 max-w-[200px] truncate">{inc.location_name}</td>
                  <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{new Date(inc.timestamp).toLocaleString()}</td>
                  <td className="px-3 py-2 font-mono text-[12px] text-foreground">{inc.risk_score}</td>
                  <td className="px-3 py-2">
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedIncident && <DetailPanel incident={selectedIncident} onClose={() => setSelectedId(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default IncidentsPage;
