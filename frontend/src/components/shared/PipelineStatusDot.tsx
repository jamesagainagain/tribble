import { motion } from 'framer-motion';
import type { PipelineStatus } from '@/types';

const STATUS_STYLES: Record<PipelineStatus, { color: string; pulse: boolean }> = {
  running: { color: 'bg-[hsl(var(--hip-green))]', pulse: true },
  degraded: { color: 'bg-[hsl(var(--hip-warn))]', pulse: true },
  down: { color: 'bg-destructive', pulse: false },
};

export const PipelineStatusDot = ({ status }: { status: PipelineStatus }) => {
  const style = STATUS_STYLES[status];
  return (
    <span className="relative inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${style.color}`} />
      {style.pulse && (
        <motion.span
          className={`absolute w-2 h-2 rounded-full ${style.color}`}
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <span className="font-mono text-[9px] text-foreground tracking-wider uppercase">{status}</span>
    </span>
  );
};
