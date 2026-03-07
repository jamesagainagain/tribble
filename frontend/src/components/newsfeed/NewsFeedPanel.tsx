import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { PLACEHOLDER_NEWS_EVENTS, PLACEHOLDER_REGIONS } from '@/lib/placeholder-data';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { OntologyBadge } from '@/components/shared/OntologyBadge';
import { ConfidenceBar } from '@/components/shared/ConfidenceBar';
import { SOURCE_ICONS } from '@/lib/icon-registry';
import type { NewsEvent } from '@/types';

const TIME_FILTERS = ['1h', '6h', '24h', '7d'] as const;

const NewsFeedItem = ({ item }: { item: NewsEvent }) => {
  const sourceMeta = SOURCE_ICONS[item.ontology_class ? 'news_agent' : 'news_agent'];
  const timeDiff = Math.round((Date.now() - new Date(item.ingested_at).getTime()) / 60000);
  const timeLabel = timeDiff < 60 ? `${timeDiff}m` : `${Math.round(timeDiff / 60)}h`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border rounded-sm bg-card/40 p-3 space-y-2"
    >
      {/* Header */}
      <div className="flex items-center gap-1.5 text-[10px]">
        <span>{sourceMeta.icon}</span>
        <span className="font-mono text-primary">{item.source_name}</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">
          {PLACEHOLDER_REGIONS.find(r => r.id === item.region_id)?.name || 'Unknown'}
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{timeLabel}</span>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <OntologyBadge ontologyClass={item.ontology_class} />
        <SeverityBadge severity={item.severity} />
      </div>

      {/* Summary */}
      <p className="text-[11px] text-foreground/80 leading-relaxed line-clamp-3">{item.agent_summary}</p>

      {/* Confidence */}
      <ConfidenceBar score={item.confidence_score} />

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button className="font-mono text-[9px] tracking-wider text-primary hover:text-primary/80 transition-colors">
          SHOW ON MAP
        </button>
        <button className="font-mono text-[9px] tracking-wider text-muted-foreground hover:text-foreground transition-colors">
          CREATE EVENT
        </button>
        <a
          href={item.article_url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto font-mono text-[9px] tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          READ ↗
        </a>
      </div>
    </motion.div>
  );
};

export const NewsFeedPanel = () => {
  const [regionFilter, setRegionFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState<typeof TIME_FILTERS[number]>('24h');
  const [live, setLive] = useState(true);

  const filtered = PLACEHOLDER_NEWS_EVENTS.filter(n => {
    if (regionFilter !== 'all' && n.region_id !== regionFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border flex-shrink-0 space-y-2">
        <div className="flex items-center gap-1.5">
          <span>📡</span>
          <span className="font-mono text-[11px] text-primary tracking-wider">NEWS INTELLIGENCE FEED</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value)}
            className="bg-card border border-border rounded-sm px-1.5 py-0.5 font-mono text-[9px] text-foreground outline-none"
          >
            <option value="all">ALL REGIONS</option>
            {PLACEHOLDER_REGIONS.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <div className="flex gap-0.5">
            {TIME_FILTERS.map(t => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`font-mono text-[8px] px-1.5 py-0.5 rounded-sm border transition-colors ${
                  timeFilter === t ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={() => setLive(!live)}
            className={`flex items-center gap-1 font-mono text-[8px] px-1.5 py-0.5 rounded-sm border transition-colors ml-auto ${
              live ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'
            }`}
          >
            <RefreshCw className="w-2.5 h-2.5" />
            LIVE
          </button>
        </div>
      </div>

      {/* Feed items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence>
          {filtered.map(item => (
            <NewsFeedItem key={item.id} item={item} />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground text-[11px] mt-8">No news events match filters</p>
        )}
      </div>
    </div>
  );
};
