import { Bell, AlertTriangle, Shield, Info } from 'lucide-react';

const MOCK_ALERTS = [
  { id: 1, type: 'critical', title: 'Armed conflict reported near Highway 4', time: '2m ago', message: 'Multiple sources confirm active fighting. Avoid the area.', read: false },
  { id: 2, type: 'high', title: 'Displacement activity — Eastern Zone', time: '15m ago', message: 'Large population movement detected. Aid corridors may be congested.', read: false },
  { id: 3, type: 'medium', title: 'Weather advisory — Flash flood risk', time: '1h ago', message: 'Heavy rainfall expected. Low-lying routes may be impassable.', read: true },
  { id: 4, type: 'info', title: 'Safe Zone B — Aid distribution scheduled', time: '3h ago', message: 'Water and food distribution at 14:00 local time.', read: true },
  { id: 5, type: 'high', title: 'Route RT-003 risk increased', time: '5h ago', message: 'Risk level elevated from 65% to 82% due to new intel.', read: true },
];

const TYPE_CONFIG = {
  critical: { icon: Shield, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
  high: { icon: AlertTriangle, color: 'text-[hsl(var(--hip-high))]', bg: 'bg-[hsl(var(--hip-high))]/10', border: 'border-[hsl(var(--hip-high))]/30' },
  medium: { icon: AlertTriangle, color: 'text-[hsl(var(--hip-medium))]', bg: 'bg-[hsl(var(--hip-medium))]/10', border: 'border-[hsl(var(--hip-medium))]/30' },
  info: { icon: Info, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' },
};

export const AlertsPage = () => {
  return (
    <div className="absolute inset-0 pointer-events-auto overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-sm bg-destructive/10 border border-destructive/30 flex items-center justify-center">
            <Bell className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h2 className="font-heading text-lg tracking-wider text-foreground">ALERTS</h2>
            <p className="font-body text-xs text-muted-foreground">Real-time safety alerts for your area</p>
          </div>
          <span className="ml-auto font-mono text-[10px] text-destructive bg-destructive/10 border border-destructive/20 rounded-sm px-2 py-0.5">
            2 UNREAD
          </span>
        </div>

        <div className="space-y-3">
          {MOCK_ALERTS.map(alert => {
            const config = TYPE_CONFIG[alert.type as keyof typeof TYPE_CONFIG];
            const Icon = config.icon;
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-sm border bg-card/80 backdrop-blur-sm transition-colors cursor-pointer ${
                  !alert.read ? `${config.border} border-l-2` : 'border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-sm ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-body text-sm ${!alert.read ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {alert.title}
                      </p>
                      {!alert.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                    <p className="font-body text-xs text-muted-foreground mb-1.5">{alert.message}</p>
                    <span className="font-mono text-[9px] text-muted-foreground">{alert.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
