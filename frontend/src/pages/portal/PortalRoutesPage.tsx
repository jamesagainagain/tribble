import { MapPin } from 'lucide-react';

const SAFE_ROUTES = [
  { id: 1, label: 'Mao → N\'Djamena', status: 'safe' as const },
  { id: 2, label: 'Bol → Mao', status: 'caution' as const },
  { id: 3, label: 'Eastern Settlement → Biltine', status: 'blocked' as const },
];

const NGO_POINTS = [
  { id: 1, label: 'Food Distribution — Mao Centre', type: 'food' },
  { id: 2, label: 'Medical Post — Bol Clinic', type: 'medical' },
  { id: 3, label: 'Shelter — Am Timan Camp', type: 'shelter' },
  { id: 4, label: 'Water Station — Northern Corridor', type: 'water' },
];

const STATUS_STYLES = {
  safe: { color: 'text-[hsl(var(--hip-green))]', bg: 'bg-[hsl(var(--hip-green))]/10', label: 'SAFE' },
  caution: { color: 'text-[hsl(var(--hip-warn))]', bg: 'bg-[hsl(var(--hip-warn))]/10', label: 'CAUTION' },
  blocked: { color: 'text-destructive', bg: 'bg-destructive/10', label: 'BLOCKED' },
};

export const PortalRoutesPage = () => (
  <div className="max-w-lg mx-auto p-4">
    <h2 className="font-heading text-sm tracking-wider text-foreground mb-4">SAFE ROUTES</h2>

    {/* Simplified map placeholder */}
    <div className="aspect-video bg-card border border-border rounded-sm flex items-center justify-center mb-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--hip-green))]/5 via-transparent to-destructive/5" />
      <div className="relative text-center">
        <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
        <p className="font-mono text-[10px] text-muted-foreground">CIVILIAN SAFETY MAP</p>
        <p className="font-mono text-[8px] text-muted-foreground mt-1">Map integration pending — showing routes below</p>
      </div>
    </div>

    {/* Routes */}
    <div className="space-y-2 mb-6">
      <h3 className="font-mono text-[10px] text-muted-foreground tracking-wider">ROUTES</h3>
      {SAFE_ROUTES.map(route => {
        const style = STATUS_STYLES[route.status];
        return (
          <div key={route.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-sm">
            <span className="text-[11px] text-foreground">{route.label}</span>
            <span className={`font-mono text-[8px] tracking-wider px-1.5 py-0.5 rounded-sm ${style.bg} ${style.color}`}>
              {style.label}
            </span>
          </div>
        );
      })}
    </div>

    {/* NGO Points */}
    <div className="space-y-2">
      <h3 className="font-mono text-[10px] text-muted-foreground tracking-wider">ASSISTANCE POINTS</h3>
      {NGO_POINTS.map(point => (
        <div key={point.id} className="flex items-center gap-2 p-3 bg-card border border-border rounded-sm">
          <span className="text-lg">
            {point.type === 'food' ? '🍲' : point.type === 'medical' ? '✚' : point.type === 'shelter' ? '🏠' : '💧'}
          </span>
          <span className="text-[11px] text-foreground">{point.label}</span>
        </div>
      ))}
    </div>
  </div>
);
