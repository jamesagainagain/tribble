import { Route, Shield, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const MOCK_ROUTES = [
  { id: 'RT-001', name: 'Northern Corridor → Safe Zone A', status: 'safe', risk: 12, updated: '5m ago', distance: '47 km' },
  { id: 'RT-002', name: 'Eastern Bypass → IDP Camp Delta', status: 'caution', risk: 45, updated: '12m ago', distance: '23 km' },
  { id: 'RT-003', name: 'Highway 4 → Border Crossing', status: 'danger', risk: 82, updated: '2m ago', distance: '156 km' },
  { id: 'RT-004', name: 'River Road → Supply Point Echo', status: 'safe', risk: 8, updated: '30m ago', distance: '31 km' },
  { id: 'RT-005', name: 'Market District → Hospital Zone', status: 'caution', risk: 38, updated: '18m ago', distance: '5 km' },
];

export const SafeRoutesPage = () => {
  return (
    <div className="absolute inset-0 pointer-events-auto overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-sm bg-[hsl(var(--hip-green))]/10 border border-[hsl(var(--hip-green))]/30 flex items-center justify-center">
            <Route className="w-5 h-5 text-[hsl(var(--hip-green))]" />
          </div>
          <div>
            <h2 className="font-heading text-lg tracking-wider text-foreground">SAFE ROUTES</h2>
            <p className="font-body text-xs text-muted-foreground">AI-analyzed routes with real-time risk assessment</p>
          </div>
        </div>

        <div className="space-y-3">
          {MOCK_ROUTES.map(route => (
            <div
              key={route.id}
              className="p-4 rounded-sm border border-border bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {route.status === 'safe' && <CheckCircle className="w-4 h-4 text-[hsl(var(--hip-green))]" />}
                  {route.status === 'caution' && <AlertTriangle className="w-4 h-4 text-[hsl(var(--hip-medium))]" />}
                  {route.status === 'danger' && <Shield className="w-4 h-4 text-destructive" />}
                  <span className="font-body text-sm text-foreground">{route.name}</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{route.id}</span>
              </div>
              <div className="flex items-center gap-4 ml-6">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-24 rounded-full bg-popover overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        route.risk < 30 ? 'bg-[hsl(var(--hip-green))]' : route.risk < 60 ? 'bg-[hsl(var(--hip-medium))]' : 'bg-destructive'
                      }`}
                      style={{ width: `${route.risk}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{route.risk}% risk</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{route.distance}</span>
                <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {route.updated}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SafeRoutesPage;
