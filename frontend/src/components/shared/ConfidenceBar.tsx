import { motion } from 'framer-motion';

export const ConfidenceBar = ({ score, showLabel = true }: { score: number; showLabel?: boolean }) => {
  const pct = Math.round(score * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <span className="font-mono text-[9px] text-muted-foreground w-8 text-right">{score.toFixed(2)}</span>
      )}
    </div>
  );
};
