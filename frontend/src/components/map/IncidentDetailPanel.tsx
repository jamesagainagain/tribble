import { useUIStore } from '@/store/uiSlice';
import { PLACEHOLDER_INCIDENTS, PLACEHOLDER_NGOS } from '@/lib/placeholder-data';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { RiskGauge } from '@/components/shared/RiskGauge';
import { format } from 'date-fns';
import { MapPin, Clock, Shield, Link2, ExternalLink, X } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  armed_conflict: 'Armed Conflict',
  displacement: 'Displacement',
  infrastructure_damage: 'Infrastructure Damage',
  aid_obstruction: 'Aid Obstruction',
  natural_disaster: 'Natural Disaster',
  disease_outbreak: 'Disease Outbreak',
};

const VERIFICATION_STYLES: Record<string, { bg: string; text: string }> = {
  verified: { bg: 'bg-primary/10', text: 'text-primary' },
  unverified: { bg: 'bg-destructive/10', text: 'text-destructive' },
  pending: { bg: 'bg-[hsl(var(--hip-high))]/10', text: 'text-[hsl(var(--hip-high))]' },
};

export const IncidentDetailPanel = () => {
  const { selectedIncidentId, setSelectedIncidentId } = useUIStore();
  const incident = PLACEHOLDER_INCIDENTS.find(i => i.id === selectedIncidentId);

  if (!incident) return null;

  const assignedNgos = PLACEHOLDER_NGOS.filter(n => incident.assigned_ngo_ids.includes(n.id));
  const relatedIncidents = PLACEHOLDER_INCIDENTS.filter(i => incident.related_incident_ids.includes(i.id));
  const vStyle = VERIFICATION_STYLES[incident.verification_status] || VERIFICATION_STYLES.pending;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-border">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-primary tracking-wider">{incident.id}</span>
            <SeverityBadge severity={incident.severity} />
          </div>
          <p className="font-heading text-sm text-foreground">{TYPE_LABELS[incident.type]}</p>
        </div>
        <button onClick={() => setSelectedIncidentId(null)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Location & Time */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-mono text-[10px] text-foreground">{incident.location_name}</p>
              <p className="font-mono text-[9px] text-muted-foreground">{incident.lat.toFixed(3)}°N, {incident.lng.toFixed(3)}°E</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <p className="font-mono text-[10px] text-foreground">{format(new Date(incident.timestamp), 'dd MMM yyyy HH:mm')} UTC</p>
          </div>
        </div>

        {/* Risk Score */}
        <div className="bg-card/50 border border-border rounded-sm p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-heading text-[10px] tracking-wider text-muted-foreground">RISK SCORE</span>
            <span className="font-mono text-lg text-foreground font-bold">{incident.risk_score}</span>
          </div>
          <RiskGauge score={incident.risk_score} />
        </div>

        {/* Description */}
        <div>
          <span className="font-heading text-[10px] tracking-wider text-muted-foreground">DESCRIPTION</span>
          <p className="font-mono text-[10px] text-foreground leading-relaxed mt-1">{incident.description}</p>
        </div>

        {/* Verification */}
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className={`px-2 py-0.5 rounded-sm font-mono text-[9px] tracking-wide ${vStyle.bg} ${vStyle.text}`}>
            {incident.verification_status.toUpperCase()}
          </span>
          {incident.verified_by && (
            <span className="font-mono text-[9px] text-muted-foreground">by {incident.verified_by}</span>
          )}
        </div>

        {/* Assigned NGOs */}
        {assignedNgos.length > 0 && (
          <div>
            <span className="font-heading text-[10px] tracking-wider text-muted-foreground">ASSIGNED NGOs</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {assignedNgos.map(ngo => (
                <div key={ngo.id} className="flex items-center gap-1.5 bg-card border border-border rounded-sm px-2 py-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ngo.colour }} />
                  <span className="font-mono text-[9px] text-foreground">{ngo.abbreviation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Incidents */}
        {relatedIncidents.length > 0 && (
          <div>
            <span className="font-heading text-[10px] tracking-wider text-muted-foreground">RELATED INCIDENTS</span>
            <div className="space-y-1.5 mt-1.5">
              {relatedIncidents.map(rel => (
                <button
                  key={rel.id}
                  onClick={() => setSelectedIncidentId(rel.id)}
                  className="flex items-center gap-2 w-full bg-card border border-border rounded-sm px-2 py-1.5 hover:border-primary/30 transition-colors text-left"
                >
                  <Link2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="font-mono text-[10px] text-primary">{rel.id}</span>
                  <SeverityBadge severity={rel.severity} />
                  <span className="font-mono text-[9px] text-muted-foreground ml-auto">{TYPE_LABELS[rel.type]}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
