interface BatteryBarProps {
  percentage: number;
  className?: string;
}

export const BatteryBar = ({ percentage, className = '' }: BatteryBarProps) => {
  const color = percentage > 50 ? 'bg-hip-green' : percentage > 20 ? 'bg-hip-warn' : 'bg-hip-critical';
  const segments = 5;
  const filled = Math.round((percentage / 100) * segments);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex gap-[2px]">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`w-[6px] h-3 rounded-[1px] ${i < filled ? color : 'bg-border'}`}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] text-muted-foreground ml-1">{percentage}%</span>
    </div>
  );
};
