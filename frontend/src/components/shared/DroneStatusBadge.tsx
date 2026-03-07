import type { DroneStatus as DroneStatusType } from '@/types';

const STATUS_CONFIG: Record<DroneStatusType, { color: string; label: string; symbol: string }> = {
  active: { color: 'text-primary', label: 'ACTIVE', symbol: '●' },
  standby: { color: 'text-hip-low', label: 'STANDBY', symbol: '●' },
  low_battery: { color: 'text-hip-warn', label: 'LOW BATTERY', symbol: '●' },
  lost_signal: { color: 'text-hip-critical', label: 'LOST SIGNAL', symbol: '✕' },
};

export const DroneStatusBadge = ({ status }: { status: DroneStatusType }) => {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider ${config.color}`}>
      <span>{config.symbol}</span>
      {config.label}
    </span>
  );
};
