const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="bg-popover/90 backdrop-blur-sm border border-border rounded-sm px-8 py-6 text-center pointer-events-auto">
      <p className="font-heading font-bold text-sm tracking-wider text-foreground mb-2">{title}</p>
      <p className="font-mono text-[10px] text-muted-foreground">Coming in a later phase</p>
    </div>
  </div>
);

export const IncidentsPage = () => <PlaceholderPage title="INCIDENT BROWSER" />;
export const AnalyticsPage = () => <PlaceholderPage title="ANALYTICS DASHBOARD" />;
export const DronesPage = () => <PlaceholderPage title="DRONE FLEET" />;
export const ReportsPage = () => <PlaceholderPage title="INTELLIGENCE REPORTS" />;
export const SettingsPage = () => <PlaceholderPage title="SETTINGS" />;
