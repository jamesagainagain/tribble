import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const SEVERITY_ITEMS = [
  { label: 'Critical', shape: 'diamond', color: 'hsl(var(--hip-critical))' },
  { label: 'High', shape: 'triangle', color: 'hsl(var(--hip-high))' },
  { label: 'Medium', shape: 'circle', color: 'hsl(var(--hip-medium))' },
  { label: 'Low', shape: 'square', color: 'hsl(var(--hip-low))' },
];

const LAYER_ITEMS = [
  { label: 'Incident Marker', desc: 'Reported events, colour-coded by severity', color: 'hsl(var(--hip-critical))' },
  { label: 'Drone', desc: 'Active UAV assets with heading', color: 'hsl(var(--hip-accent))' },
  { label: 'Flight Path', desc: 'Solid = completed, dashed = planned', color: 'hsl(var(--hip-accent))' },
  { label: 'NGO Zone', desc: 'Dashed outline of assigned operational area', color: 'hsl(var(--hip-accent2))' },
  { label: 'Risk Heatmap', desc: 'Glow radius scaled by risk score', color: 'hsl(var(--hip-accent))' },
  { label: 'Conflict Arc', desc: 'Links between related incidents', color: 'hsl(var(--hip-accent2))' },
];

const REGION_ITEMS = [
  { label: 'Active region (Chad)', color: 'hsl(var(--hip-accent) / 0.12)', border: 'hsl(var(--hip-accent) / 0.6)' },
  { label: 'Sahel countries', color: 'hsl(var(--hip-mid))', border: 'hsl(var(--hip-rule))' },
  { label: 'Other countries', color: 'hsl(var(--hip-dark))', border: 'hsl(var(--border))' },
];

const DRONE_ITEMS = [
  { label: 'Active', color: 'hsl(var(--hip-accent))' },
  { label: 'Standby', color: 'hsl(var(--hip-low))' },
  { label: 'Low Battery', color: 'hsl(var(--hip-warn))' },
  { label: 'Lost Signal', color: 'hsl(var(--hip-critical))' },
];

const ShapeSvg = ({ shape, color }: { shape: string; color: string }) => (
  <svg width={12} height={12} viewBox="0 0 12 12" className="flex-shrink-0">
    {shape === 'diamond' && <polygon points="6,1 11,6 6,11 1,6" fill={color} />}
    {shape === 'triangle' && <polygon points="6,1 11,11 1,11" fill={color} />}
    {shape === 'circle' && <circle cx={6} cy={6} r={5} fill={color} />}
    {shape === 'square' && <rect x={1} y={1} width={10} height={10} fill={color} />}
  </svg>
);

export const MapLegend = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute bottom-14 left-4 z-20 w-[200px]">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center gap-2 w-full bg-popover/90 backdrop-blur-sm border border-border rounded-sm px-2.5 py-1.5 hover:border-primary/50 transition-colors">
            <span className="font-heading text-[10px] tracking-wider text-foreground flex-1 text-left">LEGEND</span>
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </motion.div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-1 bg-popover/90 backdrop-blur-sm border border-border rounded-sm p-2.5 space-y-3 max-h-[320px] overflow-y-auto">
            {/* Severity markers */}
            <div>
              <p className="font-heading text-[9px] tracking-widest text-muted-foreground mb-1.5">SEVERITY</p>
              <div className="space-y-1">
                {SEVERITY_ITEMS.map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <ShapeSvg shape={item.shape} color={item.color} />
                    <span className="font-mono text-[9px] text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regions */}
            <div>
              <p className="font-heading text-[9px] tracking-widest text-muted-foreground mb-1.5">REGIONS</p>
              <div className="space-y-1">
                {REGION_ITEMS.map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-[2px] flex-shrink-0 border" style={{ background: item.color, borderColor: item.border }} />
                    <span className="font-mono text-[9px] text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Drone status */}
            <div>
              <p className="font-heading text-[9px] tracking-widest text-muted-foreground mb-1.5">DRONE STATUS</p>
              <div className="space-y-1">
                {DRONE_ITEMS.map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="font-mono text-[9px] text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Layers */}
            <div>
              <p className="font-heading text-[9px] tracking-widest text-muted-foreground mb-1.5">LAYERS</p>
              <div className="space-y-1.5">
                {LAYER_ITEMS.map(item => (
                  <div key={item.label} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5" style={{ background: item.color }} />
                    <div>
                      <span className="font-mono text-[9px] text-foreground block">{item.label}</span>
                      <span className="font-mono text-[8px] text-muted-foreground">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
