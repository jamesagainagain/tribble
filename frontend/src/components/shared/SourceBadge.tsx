import { SOURCE_ICONS } from '@/lib/icon-registry';
import type { SourceType } from '@/types';

export const SourceBadge = ({ sourceType, label }: { sourceType: SourceType; label?: string }) => {
  const meta = SOURCE_ICONS[sourceType];
  if (!meta) return null;

  return (
    <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-wider px-1.5 py-0.5 rounded-sm border border-border bg-card/60">
      <span>{meta.icon}</span>
      <span className="text-foreground/80">{label || meta.label}</span>
    </span>
  );
};
