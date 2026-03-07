import { Users, Shield, Activity } from 'lucide-react';

/** Placeholder admin pages */
export const UserManagementPage = () => (
  <div className="absolute inset-0 pointer-events-auto overflow-y-auto">
    <div className="max-w-4xl mx-auto p-6 pt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-sm bg-secondary/10 border border-secondary/30 flex items-center justify-center">
          <Users className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h2 className="font-heading text-lg tracking-wider text-foreground">USER MANAGEMENT</h2>
          <p className="font-body text-xs text-muted-foreground">Manage platform users and their roles</p>
        </div>
      </div>
      <div className="rounded-sm border border-border bg-card p-8 text-center">
        <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="font-mono text-xs text-muted-foreground">User management will be available when authentication is enabled</p>
      </div>
    </div>
  </div>
);

export const SystemConfigPage = () => (
  <div className="absolute inset-0 pointer-events-auto overflow-y-auto">
    <div className="max-w-4xl mx-auto p-6 pt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-sm bg-destructive/10 border border-destructive/30 flex items-center justify-center">
          <Shield className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h2 className="font-heading text-lg tracking-wider text-foreground">SYSTEM CONFIG</h2>
          <p className="font-body text-xs text-muted-foreground">Platform configuration and pipeline settings</p>
        </div>
      </div>
      <div className="rounded-sm border border-border bg-card p-8 text-center">
        <Shield className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="font-mono text-xs text-muted-foreground">System configuration — coming soon</p>
      </div>
    </div>
  </div>
);

export const AuditLogPage = () => (
  <div className="absolute inset-0 pointer-events-auto overflow-y-auto">
    <div className="max-w-4xl mx-auto p-6 pt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-lg tracking-wider text-foreground">AUDIT LOG</h2>
          <p className="font-body text-xs text-muted-foreground">Platform activity and change history</p>
        </div>
      </div>
      <div className="rounded-sm border border-border bg-card p-8 text-center">
        <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="font-mono text-xs text-muted-foreground">Audit log — coming soon</p>
      </div>
    </div>
  </div>
);
