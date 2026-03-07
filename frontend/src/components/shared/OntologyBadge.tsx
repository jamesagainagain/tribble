import { ONTOLOGY_ICONS } from '@/lib/icon-registry';
import type { OntologyClass } from '@/types';

export const OntologyBadge = ({ ontologyClass }: { ontologyClass: OntologyClass }) => {
  const meta = ONTOLOGY_ICONS[ontologyClass];
  if (!meta) return null;

  return (
    <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-wider px-1.5 py-0.5 rounded-sm border border-border bg-card/60">
      <span>{meta.symbol}</span>
      <span className="text-foreground/80">{meta.label.toUpperCase()}</span>
    </span>
  );
};
