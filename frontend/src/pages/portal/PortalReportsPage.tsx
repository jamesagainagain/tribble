import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLACEHOLDER_SUBMISSIONS } from '@/lib/placeholder-data';
import type { SubmissionStatus } from '@/types';

const STATUS_STYLES: Record<SubmissionStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-[hsl(var(--hip-warn))]/10', text: 'text-[hsl(var(--hip-warn))]', label: 'PENDING REVIEW' },
  in_review: { bg: 'bg-[hsl(var(--hip-warn))]/10', text: 'text-[hsl(var(--hip-warn))]', label: 'IN REVIEW' },
  verified: { bg: 'bg-[hsl(var(--hip-green))]/10', text: 'text-[hsl(var(--hip-green))]', label: 'VERIFIED' },
  declined: { bg: 'bg-muted/10', text: 'text-muted-foreground', label: 'DECLINED' },
  escalated: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'ESCALATED' },
};

export const PortalReportsPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = PLACEHOLDER_SUBMISSIONS.find(s => s.id === selectedId);

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="font-heading text-sm tracking-wider text-foreground mb-4">MY REPORTS</h2>

      <div className="space-y-2">
        {PLACEHOLDER_SUBMISSIONS.map(sub => {
          const style = STATUS_STYLES[sub.status];
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedId(sub.id === selectedId ? null : sub.id)}
              className="w-full text-left bg-card border border-border rounded-sm p-3 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[11px] text-primary">{sub.id}</span>
                <span className={`font-mono text-[8px] tracking-wider px-1.5 py-0.5 rounded-sm ${style.bg} ${style.text}`}>
                  {style.label}
                </span>
              </div>
              <p className="text-[11px] text-foreground/80 line-clamp-1">{sub.description}</p>
              <p className="text-[9px] text-muted-foreground mt-1">{new Date(sub.submitted_at).toLocaleDateString()}</p>
            </button>
          );
        })}
      </div>

      {/* Detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 bg-card border border-border rounded-sm p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] text-primary">{selected.id}</span>
              <span className={`font-mono text-[9px] px-2 py-0.5 rounded-sm ${STATUS_STYLES[selected.status].bg} ${STATUS_STYLES[selected.status].text}`}>
                {STATUS_STYLES[selected.status].label}
              </span>
            </div>
            <p className="text-[11px] text-foreground/80">{selected.description}</p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <span className="text-muted-foreground">Location</span>
              <span className="font-mono text-foreground">{selected.lat.toFixed(2)}°N, {selected.lng.toFixed(2)}°E</span>
              <span className="text-muted-foreground">Submitted</span>
              <span className="font-mono text-foreground">{new Date(selected.submitted_at).toLocaleString()}</span>
              {selected.linked_event_id && (
                <>
                  <span className="text-muted-foreground">Linked Event</span>
                  <span className="font-mono text-primary">{selected.linked_event_id}</span>
                </>
              )}
            </div>

            {/* Status timeline */}
            <div className="pt-2 border-t border-border">
              <span className="font-mono text-[9px] text-muted-foreground tracking-wider">STATUS TIMELINE</span>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--hip-green))]" />
                  <span className="text-[10px] text-foreground/80">Submitted</span>
                  <span className="ml-auto font-mono text-[9px] text-muted-foreground">{new Date(selected.submitted_at).toLocaleTimeString()}</span>
                </div>
                {selected.status !== 'pending' && (
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--hip-warn))]" />
                    <span className="text-[10px] text-foreground/80">Under Review</span>
                  </div>
                )}
                {selected.status === 'verified' && (
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] text-foreground/80">Verified by {selected.reviewed_by}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
