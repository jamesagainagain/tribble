import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { spring } from '@/lib/animation-tokens';
import { useUIStore } from '@/store/uiSlice';
import { useAuthStore } from '@/store/authSlice';
import { IncidentDetailPanel } from '@/components/map/IncidentDetailPanel';
import { HeliosChat } from '@/components/agent/HeliosChat';
import { DroneOpsPanel } from '@/components/agent/DroneOpsPanel';
import { NewsFeedPanel } from '@/components/newsfeed/NewsFeedPanel';

export const RightPanel = () => {
  const { rightPanelOpen, setRightPanelOpen, rightPanelTab, setRightPanelTab, selectedIncidentId } = useUIStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const showIncidentDetail = !!selectedIncidentId;

  return (
    <AnimatePresence>
      {rightPanelOpen && (
        <motion.aside
          className="h-full flex flex-col flex-shrink-0 border-l z-20 overflow-hidden"
          style={{
            background: 'rgba(26,32,53,0.96)',
            backdropFilter: 'blur(8px)',
            borderColor: 'hsl(var(--hip-accent) / 0.3)',
          }}
          initial={{ width: 0 }}
          animate={{ width: 380 }}
          exit={{ width: 0 }}
          transition={spring}
        >
          {/* Header */}
          <div className="flex items-center justify-between h-12 px-4 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] text-primary tracking-wider">
                {showIncidentDetail ? 'EVENT DETAIL' : rightPanelTab === 'agent' ? 'HELIOS' : rightPanelTab === 'news_feed' ? 'NEWS FEED' : 'DRONE OPS'}
              </span>
              {!showIncidentDetail && rightPanelTab === 'agent' && (
                <motion.span
                  className="w-2 h-2 rounded-full bg-[hsl(var(--hip-green))]"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <button
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setRightPanelOpen(false)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tab strip */}
          {!showIncidentDetail && (
            <div className="flex h-9 border-b border-border flex-shrink-0">
              <button
                className={`flex-1 font-heading text-[11px] tracking-wider transition-colors ${
                  rightPanelTab === 'agent' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setRightPanelTab('agent')}
              >
                HELIOS
              </button>
              <button
                className={`flex-1 font-heading text-[11px] tracking-wider transition-colors ${
                  rightPanelTab === 'news_feed' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setRightPanelTab('news_feed')}
              >
                NEWS FEED
              </button>
              {isAdmin && (
                <button
                  className={`flex-1 font-heading text-[11px] tracking-wider transition-colors ${
                    rightPanelTab === 'drone_ops' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setRightPanelTab('drone_ops')}
                >
                  DRONE OPS
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {showIncidentDetail ? (
              <IncidentDetailPanel />
            ) : rightPanelTab === 'agent' ? (
              <HeliosChat />
            ) : rightPanelTab === 'news_feed' ? (
              <NewsFeedPanel />
            ) : (
              <DroneOpsPanel />
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
