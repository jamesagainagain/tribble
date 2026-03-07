import { AlertTriangle, Info } from 'lucide-react';

const ALERTS = [
  {
    id: 1, severity: 'critical' as const, region: 'Northern Corridor',
    message: 'Active armed conflict reported near main road. Avoid the area.',
    timestamp: '2024-11-15T06:32:00Z',
  },
  {
    id: 2, severity: 'high' as const, region: 'Eastern Settlement Zone',
    message: 'Displacement movement in progress. Aid convoys may be delayed.',
    timestamp: '2024-11-14T14:10:00Z',
  },
  {
    id: 3, severity: 'info' as const, region: 'Mao District',
    message: 'Food distribution centre open at Mao Centre. Hours: 08:00–16:00.',
    timestamp: '2024-11-15T08:00:00Z',
  },
  {
    id: 4, severity: 'high' as const, region: 'Lake Chad Basin',
    message: 'Bridge destroyed near Bol. Alternative routes via southern road.',
    timestamp: '2024-11-15T09:15:00Z',
  },
];

const SEVERITY_STYLES = {
  critical: { bg: 'bg-destructive/10 border-destructive/30', text: 'text-destructive', icon: AlertTriangle },
  high: { bg: 'bg-[hsl(var(--hip-warn))]/10 border-[hsl(var(--hip-warn))]/30', text: 'text-[hsl(var(--hip-warn))]', icon: AlertTriangle },
  info: { bg: 'bg-card border-border', text: 'text-muted-foreground', icon: Info },
};

export const PortalAlertsPage = () => (
  <div className="max-w-lg mx-auto p-4">
    <h2 className="font-heading text-sm tracking-wider text-foreground mb-4">SAFETY ALERTS</h2>

    <div className="space-y-2">
      {ALERTS.map(alert => {
        const style = SEVERITY_STYLES[alert.severity];
        const Icon = style.icon;
        return (
          <div key={alert.id} className={`border rounded-sm p-3 ${style.bg}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className={`w-4 h-4 ${style.text}`} />
              <span className={`font-mono text-[10px] tracking-wider font-semibold ${style.text}`}>
                {alert.severity.toUpperCase()}
              </span>
              <span className="text-[10px] text-muted-foreground ml-auto">{alert.region}</span>
            </div>
            <p className="text-[11px] text-foreground/80 leading-relaxed">{alert.message}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-mono text-[9px] text-muted-foreground">
                {new Date(alert.timestamp).toLocaleString()}
              </span>
              <button className="font-mono text-[9px] text-primary hover:text-primary/80 transition-colors">
                SEE ON MAP
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
