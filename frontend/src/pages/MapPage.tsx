import { useCallback } from 'react';
import { useUIStore } from '@/store/uiSlice';
import { MessageSquare, Filter } from 'lucide-react';
import { LayerControlPanel } from '@/components/map/LayerControlPanel';
import { FilterPanel } from '@/components/map/FilterPanel';
import { MapLegend } from '@/components/map/MapLegend';
import { ConflictTicker } from '@/components/map/ConflictTicker';
import type { ConflictZone } from '@/lib/conflict-zones';

const MapPage = () => {
  const { setRightPanelOpen, rightPanelOpen, filterPanelOpen, setFilterPanelOpen, activeConflictZoneId, setActiveConflictZoneId } = useUIStore();

  const handleSelectZone = useCallback((zone: ConflictZone) => {
    setActiveConflictZoneId(zone.id);
    // Dispatch a custom event that the SimulatedMap listens to for flyTo
    window.dispatchEvent(new CustomEvent('hip:flyTo', {
      detail: { lng: zone.center[0], lat: zone.center[1], zoom: zone.zoom }
    }));
  }, [setActiveConflictZoneId]);

  const handleClearZone = useCallback(() => {
    setActiveConflictZoneId(null);
    // Reset to global view
    window.dispatchEvent(new CustomEvent('hip:flyTo', {
      detail: { lng: 19, lat: 15, zoom: 1 }
    }));
  }, [setActiveConflictZoneId]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Bloomberg-style conflict ticker at top */}
      <ConflictTicker
        activeZoneId={activeConflictZoneId}
        onSelectZone={handleSelectZone}
        onClearZone={handleClearZone}
      />

      {/* Layer controls — shifted down to account for ticker */}
      <div className={`transition-transform duration-300 ${filterPanelOpen ? 'translate-x-[280px]' : ''}`} style={{ marginTop: '66px' }}>
        <LayerControlPanel />
      </div>

      {/* Filter panel */}
      <FilterPanel />

      {/* Filter toggle */}
      {!filterPanelOpen && (
        <button
          className="absolute top-[76px] left-[240px] z-20 pointer-events-auto flex items-center gap-1.5 bg-popover/90 backdrop-blur-sm border border-border rounded-sm px-2.5 py-1.5 hover:border-primary/50 transition-colors"
          onClick={() => setFilterPanelOpen(true)}
        >
          <Filter className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-[10px] text-foreground tracking-wider">FILTERS</span>
          <span className="font-mono text-[9px] text-muted-foreground ml-1">F</span>
        </button>
      )}

      {/* Legend */}
      <MapLegend />

      {/* HELIOS toggle */}
      {!rightPanelOpen && (
        <button
          className="absolute top-[76px] right-4 z-20 pointer-events-auto flex items-center gap-2 bg-popover/90 backdrop-blur-sm border border-primary/30 rounded-sm px-3 py-2 hover:border-primary transition-colors"
          onClick={() => setRightPanelOpen(true)}
        >
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="font-mono text-[11px] text-primary tracking-wider">HELIOS</span>
        </button>
      )}
    </div>
  );
};

export default MapPage;
