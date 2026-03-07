import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ChevronDown, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useLayerStore } from '@/store/layerSlice';
import { Slider } from '@/components/ui/slider';
import type { LayerId, LayerGroupId } from '@/types';
import { LAYER_DEFS, LAYER_GROUP_LABELS } from '@/types/map';
import { useFilterStore } from '@/store/filterSlice';
import { SOURCE_ICONS } from '@/lib/icon-registry';
import type { SourceType } from '@/types';

const GROUPS: LayerGroupId[] = ['A', 'B', 'C', 'D', 'E'];
const ALL_SOURCES: SourceType[] = ['news_agent', 'user_submission', 'satellite', 'weather_api', 'drone', 'analyst_input'];

export const LayerControlPanel = () => {
  const [open, setOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ A: true, C: true });
  const { visibility, opacity, toggleLayer, setOpacity, toggleGroup, resetAll } = useLayerStore();
  const { sourcesVisible, setFilter } = useFilterStore();

  const toggleGroupExpanded = (g: string) => {
    setExpandedGroups(prev => ({ ...prev, [g]: !prev[g] }));
  };

  const toggleSource = (s: SourceType) => {
    const next = sourcesVisible.includes(s) ? sourcesVisible.filter(x => x !== s) : [...sourcesVisible, s];
    setFilter('sourcesVisible', next);
  };

  return (
    <div className="absolute bottom-4 left-4 z-20 pointer-events-auto w-[280px]">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-popover/90 backdrop-blur-sm border border-border rounded-sm px-3 py-2 hover:border-primary/50 transition-colors mb-1"
      >
        <Layers className="w-3.5 h-3.5 text-primary" />
        <span className="font-heading text-[11px] tracking-wider text-foreground">LAYERS</span>
        <span className="font-mono text-[9px] text-muted-foreground ml-1">L</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="bg-popover/95 backdrop-blur-sm border border-primary/30 rounded-sm overflow-hidden max-h-[70vh] flex flex-col"
            style={{ borderTopWidth: 2, borderTopColor: 'hsl(var(--hip-accent))' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="font-heading text-[11px] tracking-wider text-foreground">LAYER CONTROL</span>
              <button onClick={resetAll} className="font-mono text-[9px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                RESET ALL
              </button>
            </div>

            {/* Layer groups */}
            <div className="flex-1 overflow-y-auto">
              {GROUPS.map(group => {
                const groupLayers = LAYER_DEFS.filter(l => l.group === group);
                const allVisible = groupLayers.every(l => visibility[l.id]);
                const expanded = expandedGroups[group] ?? false;

                return (
                  <div key={group} className="border-b border-border last:border-b-0">
                    {/* Group header */}
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-card/50 transition-colors"
                      onClick={() => toggleGroupExpanded(group)}
                    >
                      <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${expanded ? '' : '-rotate-90'}`} />
                      <span className="font-heading text-[10px] tracking-wider text-primary font-semibold flex-1 text-left">
                        {group} &nbsp;{LAYER_GROUP_LABELS[group]}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleGroup(group); }}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {allVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </button>

                    {/* Sub-layers */}
                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          {groupLayers.map(layer => (
                            <div key={layer.id} className="flex items-center gap-2 px-3 py-1.5 pl-8">
                              <button
                                onClick={() => toggleLayer(layer.id)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {visibility[layer.id] ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 opacity-40" />}
                              </button>
                              <span className={`font-body text-[10px] flex-1 ${visibility[layer.id] ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {layer.label}
                              </span>
                              {visibility[layer.id] && (
                                <div className="w-16 flex items-center gap-1">
                                  <Slider
                                    value={[opacity[layer.id] * 100]}
                                    onValueChange={([v]) => setOpacity(layer.id, v / 100)}
                                    min={10}
                                    max={100}
                                    step={5}
                                    className="h-3 [&_[role=slider]]:h-2.5 [&_[role=slider]]:w-2.5"
                                  />
                                  <span className="font-mono text-[8px] text-muted-foreground w-6 text-right">
                                    {Math.round(opacity[layer.id] * 100)}%
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Source filter row */}
            <div className="px-3 py-2 border-t border-border">
              <p className="font-heading text-[9px] tracking-wider text-muted-foreground mb-1.5">SHOW SOURCES</p>
              <div className="flex flex-wrap gap-1">
                {ALL_SOURCES.map(s => {
                  const meta = SOURCE_ICONS[s];
                  const active = sourcesVisible.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSource(s)}
                      className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm text-[9px] border transition-colors ${
                        active
                          ? 'border-primary/40 text-primary'
                          : 'border-border text-muted-foreground/40'
                      }`}
                    >
                      <span className="text-[10px]">{meta.icon}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
