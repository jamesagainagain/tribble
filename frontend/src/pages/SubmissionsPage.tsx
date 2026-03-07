import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Eye, Check, X, AlertTriangle, Link2 } from 'lucide-react';
import { PLACEHOLDER_SUBMISSIONS, PLACEHOLDER_EVENTS, PLACEHOLDER_REGIONS } from '@/lib/placeholder-data';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { OntologyBadge } from '@/components/shared/OntologyBadge';
import { ConfidenceBar } from '@/components/shared/ConfidenceBar';
import type { UserSubmission } from '@/types';

const STATUS_STYLES = {
  pending: { bg: 'bg-[hsl(var(--hip-warn))]/10', text: 'text-[hsl(var(--hip-warn))]', label: 'PENDING' },
  in_review: { bg: 'bg-[hsl(var(--hip-warn))]/10', text: 'text-[hsl(var(--hip-warn))]', label: 'IN REVIEW' },
  verified: { bg: 'bg-[hsl(var(--hip-green))]/10', text: 'text-[hsl(var(--hip-green))]', label: 'VERIFIED' },
  declined: { bg: 'bg-muted/10', text: 'text-muted-foreground', label: 'DECLINED' },
  escalated: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'ESCALATED' },
} as const;

export const SubmissionsPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [autoSort, setAutoSort] = useState(true);
  const selected = PLACEHOLDER_SUBMISSIONS.find(s => s.id === selectedId);

  const sorted = [...PLACEHOLDER_SUBMISSIONS].sort((a, b) => {
    if (autoSort) return b.helios_confidence - a.helios_confidence;
    return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
  });

  const pendingCount = sorted.filter(s => s.status === 'pending' || s.status === 'in_review').length;
  const similarEvent = selected?.helios_similar_event_id
    ? PLACEHOLDER_EVENTS.find(e => e.id === selected.helios_similar_event_id)
    : null;

  return (
    <div className="absolute inset-0 flex pointer-events-auto" style={{ background: 'rgba(10,14,26,0.94)', backdropFilter: 'blur(4px)' }}>
      {/* Left column — Queue list */}
      <div className="w-[280px] flex flex-col border-r border-border flex-shrink-0">
        <div className="px-3 py-3 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-heading text-sm tracking-wider text-foreground">SUBMISSION QUEUE</h1>
            <span className="font-mono text-[9px] text-[hsl(var(--hip-warn))] bg-[hsl(var(--hip-warn))]/10 px-1.5 py-0.5 rounded-sm">
              {pendingCount} PENDING
            </span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={autoSort} onChange={e => setAutoSort(e.target.checked)} className="w-3 h-3 accent-primary" />
            <span className="font-mono text-[9px] text-muted-foreground">AUTO-SORT BY HELIOS</span>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sorted.map(sub => {
            const style = STATUS_STYLES[sub.status];
            const isActive = selectedId === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedId(sub.id)}
                className={`w-full text-left p-3 border-b border-border/50 hover:bg-card/60 transition-colors ${
                  isActive ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span>👤</span>
                    <span className="font-mono text-[10px] text-primary">{sub.id}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <SeverityBadge severity={sub.severity_suggested} />
                    <span className={`font-mono text-[7px] tracking-wider px-1 py-0.5 rounded-sm ${style.bg} ${style.text}`}>{style.label}</span>
                  </div>
                </div>
                <p className="text-[10px] text-foreground/70 line-clamp-1">
                  {sub.ontology_class_suggested.replace('_', ' ')} · {Math.round((Date.now() - new Date(sub.submitted_at).getTime()) / 60000)} min ago
                </p>
                <p className="font-mono text-[9px] text-muted-foreground mt-0.5">
                  {sub.lat.toFixed(2)}°N, {sub.lng.toFixed(2)}°E
                </p>
                {sub.helios_similar_event_id && (
                  <p className="font-mono text-[8px] text-primary mt-0.5">
                    HELIOS: "Matches {sub.helios_similar_event_id}"
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Centre column — Detail */}
      <div className="flex-1 overflow-y-auto p-4">
        {selected ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[13px] text-primary">{selected.id}</span>
                <SeverityBadge severity={selected.severity_suggested} />
                <OntologyBadge ontologyClass={selected.ontology_class_suggested} />
              </div>
              <span className={`font-mono text-[9px] px-2 py-0.5 rounded-sm ${STATUS_STYLES[selected.status].bg} ${STATUS_STYLES[selected.status].text}`}>
                {STATUS_STYLES[selected.status].label}
              </span>
            </div>

            {/* Submitter */}
            <div className="bg-card border border-border rounded-sm p-3">
              <span className="font-mono text-[9px] text-muted-foreground tracking-wider">SUBMITTER</span>
              <p className="text-[11px] text-foreground mt-1">{selected.is_anonymous ? 'Anonymous Submission' : `User ${selected.submitter_id}`}</p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-mono text-[10px] text-foreground">{selected.lat.toFixed(4)}°N, {selected.lng.toFixed(4)}°E</span>
              {selected.region_id && (
                <span className="text-[10px] text-muted-foreground">
                  · {PLACEHOLDER_REGIONS.find(r => r.id === selected.region_id)?.name}
                </span>
              )}
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-mono text-[10px] text-foreground">{new Date(selected.submitted_at).toLocaleString()}</span>
            </div>

            {/* Description */}
            <div>
              <span className="font-heading text-[10px] tracking-wider text-muted-foreground">DESCRIPTION</span>
              <p className="text-[11px] text-foreground/80 leading-relaxed mt-1">{selected.description}</p>
            </div>

            {/* HELIOS Analysis */}
            <div className="bg-primary/5 border border-primary/20 rounded-sm p-3">
              <span className="font-mono text-[9px] text-primary tracking-wider">HELIOS ANALYSIS</span>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-mono text-foreground">{(selected.helios_confidence * 100).toFixed(0)}%</span>
                </div>
                <ConfidenceBar score={selected.helios_confidence} />
                {selected.helios_similar_event_id && (
                  <p className="text-[10px] text-primary">
                    Similar to {selected.helios_similar_event_id} — recommend verification
                  </p>
                )}
              </div>
            </div>

            {/* Similar events */}
            {similarEvent && (
              <div>
                <span className="font-heading text-[10px] tracking-wider text-muted-foreground">SIMILAR EVENTS</span>
                <div className="mt-1.5 bg-card border border-border rounded-sm p-2.5">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-3 h-3 text-primary" />
                    <span className="font-mono text-[10px] text-primary">{similarEvent.id}</span>
                    <SeverityBadge severity={similarEvent.severity} />
                  </div>
                  <p className="text-[10px] text-foreground/70 mt-1">{similarEvent.description}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <button className="flex items-center gap-1 flex-1 justify-center font-mono text-[10px] tracking-wider py-2 rounded-sm bg-[hsl(var(--hip-green))]/20 text-[hsl(var(--hip-green))] border border-[hsl(var(--hip-green))]/30 hover:bg-[hsl(var(--hip-green))]/30 transition-colors">
                <Check className="w-3 h-3" /> VERIFY
              </button>
              <button className="flex items-center gap-1 flex-1 justify-center font-mono text-[10px] tracking-wider py-2 rounded-sm bg-card text-muted-foreground border border-border hover:text-foreground transition-colors">
                <X className="w-3 h-3" /> DECLINE
              </button>
              <button className="flex items-center gap-1 flex-1 justify-center font-mono text-[10px] tracking-wider py-2 rounded-sm bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 transition-colors">
                <AlertTriangle className="w-3 h-3" /> ESCALATE
              </button>
            </div>
            {selected.helios_similar_event_id && (
              <button className="w-full font-mono text-[9px] tracking-wider py-1.5 rounded-sm bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors">
                LINK TO {selected.helios_similar_event_id}
              </button>
            )}
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-[11px]">
            Select a submission to review
          </div>
        )}
      </div>

      {/* Right column — Map context */}
      <div className="w-[320px] border-l border-border flex-shrink-0 flex flex-col">
        <div className="px-3 py-2 border-b border-border">
          <span className="font-mono text-[9px] text-muted-foreground tracking-wider">MAP CONTEXT</span>
        </div>
        <div className="flex-1 flex items-center justify-center bg-card/40">
          {selected ? (
            <div className="text-center p-4">
              <div className="w-24 h-24 rounded-full border border-primary/30 mx-auto mb-3 flex items-center justify-center relative">
                <MapPin className="w-6 h-6 text-primary" />
                <span className="absolute inset-0 rounded-full border-2 border-primary/10 animate-ping" />
              </div>
              <p className="font-mono text-[10px] text-foreground">{selected.lat.toFixed(4)}°N</p>
              <p className="font-mono text-[10px] text-foreground">{selected.lng.toFixed(4)}°E</p>
              <p className="font-mono text-[9px] text-muted-foreground mt-2">5km radius context</p>
              {similarEvent && (
                <div className="mt-3 bg-card border border-border rounded-sm p-2 text-left">
                  <span className="font-mono text-[8px] text-muted-foreground">NEARBY VERIFIED:</span>
                  <p className="font-mono text-[10px] text-primary mt-0.5">{similarEvent.id} — {similarEvent.location_name}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="font-mono text-[10px] text-muted-foreground">No submission selected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionsPage;
