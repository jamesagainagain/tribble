import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, X, Download, Clock, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'sitrep' | 'threat_assessment' | 'ngo_brief' | 'flash_report';
  created: string;
  status: 'complete' | 'generating' | 'draft';
  summary: string;
  sections: { title: string; content: string }[];
}

const REPORTS: Report[] = [
  {
    id: 'RPT-001', title: 'Northern Corridor Situation Report', type: 'sitrep', created: '2024-11-15T07:00:00Z', status: 'complete',
    summary: 'Critical situation developing in the Northern Corridor with active armed confrontation and displacement affecting 2,400+ persons.',
    sections: [
      { title: 'Situation Overview', content: 'Armed confrontation reported at 06:32 UTC near the primary aid convoy route. Three vehicles disabled. Route currently impassable. HELIOS assessment indicates escalation risk at 94/100.' },
      { title: 'Displacement Impact', content: 'Estimated 2,400 persons displaced from three settlements in the Eastern Settlement Cluster, moving towards Mao district. Movement patterns suggest organized evacuation.' },
      { title: 'Recommendations', content: '1. Reroute aid convoys via southern bypass\n2. Deploy DRN-002 for aerial survey\n3. Coordinate with RELIEF.IO for shelter response\n4. Escalate to regional command' },
    ],
  },
  {
    id: 'RPT-002', title: 'Lake Chad Basin Threat Assessment', type: 'threat_assessment', created: '2024-11-14T18:00:00Z', status: 'complete',
    summary: 'Infrastructure damage to primary bridge crossing cuts off three downstream settlements from aid routes.',
    sections: [
      { title: 'Threat Analysis', content: 'Bridge destruction confirmed via satellite imagery. No hostile activity detected in immediate vicinity but access denial pattern suggests deliberate targeting of infrastructure.' },
      { title: 'Impact Assessment', content: 'Three settlements (pop. ~12,000) now cut off from primary supply route. Alternative routes add 4-6 hours transit time.' },
    ],
  },
  {
    id: 'RPT-003', title: 'Weekly NGO Operations Brief', type: 'ngo_brief', created: '2024-11-14T12:00:00Z', status: 'complete',
    summary: 'Weekly operational summary for all active NGOs in the Sahel operational zone.',
    sections: [
      { title: 'RELIEF.IO Operations', content: 'Active in Northern Corridor. 3 convoys dispatched this week. 1 delayed due to security incident.' },
      { title: 'AID NEXUS Operations', content: 'Lake Chad Basin coverage maintained. Bridge destruction impacting supply chain.' },
    ],
  },
  {
    id: 'RPT-004', title: 'Tibesti Health Flash Report', type: 'flash_report', created: '2024-11-13T10:00:00Z', status: 'complete',
    summary: 'Suspected cholera outbreak in Tibesti Region. 40+ cases reported. Immediate medical response required.',
    sections: [
      { title: 'Outbreak Details', content: '40+ suspected cholera cases reported in Faya-Largeau area. Local health facilities overwhelmed. Water contamination suspected as source.' },
    ],
  },
];

const TYPE_COLORS: Record<string, string> = {
  sitrep: 'text-primary',
  threat_assessment: 'text-hip-critical',
  ngo_brief: 'text-hip-green',
  flash_report: 'text-hip-warn',
};

const GenerateModal = ({ onClose }: { onClose: () => void }) => {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    setGenerating(true);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setTimeout(onClose, 500); return 100; }
        return p + Math.random() * 15;
      });
    }, 300);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-[420px] rounded border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[12px] text-foreground tracking-wider">GENERATE REPORT</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>

        {!generating ? (
          <div className="space-y-4">
            <div>
              <label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">REPORT TYPE</label>
              <select className="w-full bg-background border border-border rounded px-3 py-2 font-mono text-[11px] text-foreground outline-none focus:border-primary/40">
                <option>Situation Report (SITREP)</option>
                <option>Threat Assessment</option>
                <option>NGO Operations Brief</option>
                <option>Flash Report</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">REGION</label>
              <select className="w-full bg-background border border-border rounded px-3 py-2 font-mono text-[11px] text-foreground outline-none focus:border-primary/40">
                <option>All Zones</option>
                <option>Northern Corridor</option>
                <option>Lake Chad Basin</option>
                <option>Tibesti Region</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">TIME RANGE</label>
              <select className="w-full bg-background border border-border rounded px-3 py-2 font-mono text-[11px] text-foreground outline-none focus:border-primary/40">
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <button onClick={handleGenerate} className="w-full font-mono text-[10px] tracking-wider py-2.5 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors border border-primary/30">
              GENERATE REPORT
            </button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="font-mono text-[11px] text-foreground">Generating report...</span>
            </div>
            <div className="space-y-2">
              {['Aggregating incidents', 'Analyzing threat patterns', 'Compiling NGO coverage', 'Generating summary'].map((step, i) => {
                const stepProgress = Math.min(Math.max((progress - i * 25) / 25, 0), 1);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 flex items-center justify-center">
                      {stepProgress >= 1 ? <span className="text-hip-green text-[10px]">✓</span> : stepProgress > 0 ? <Loader2 className="w-3 h-3 text-primary animate-spin" /> : <span className="w-1.5 h-1.5 rounded-full bg-border" />}
                    </div>
                    <span className={`font-mono text-[10px] ${stepProgress > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</span>
                  </div>
                );
              })}
            </div>
            <div className="h-1 rounded-full bg-border overflow-hidden">
              <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const ReportDetail = ({ report, onClose }: { report: Report; onClose: () => void }) => {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));
  const toggleSection = (i: number) => setOpenSections(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute right-0 top-0 bottom-0 w-[400px] bg-card border-l border-border z-20 overflow-y-auto"
    >
      <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="font-mono text-[11px] text-primary">{report.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground hover:text-foreground"><Download className="w-4 h-4" /></button>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-[13px] text-foreground font-medium">{report.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`font-mono text-[9px] tracking-wider ${TYPE_COLORS[report.type]}`}>{report.type.replace('_', ' ').toUpperCase()}</span>
            <span className="text-muted-foreground">·</span>
            <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(report.created).toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-background/50 border border-border rounded p-3">
          <span className="font-mono text-[9px] text-muted-foreground tracking-wider">SUMMARY</span>
          <p className="text-[11px] text-foreground/80 mt-1 leading-relaxed">{report.summary}</p>
        </div>
        <div className="space-y-1">
          {report.sections.map((section, i) => (
            <div key={i} className="border border-border rounded overflow-hidden">
              <button onClick={() => toggleSection(i)} className="w-full flex items-center justify-between px-3 py-2 hover:bg-card/60 transition-colors">
                <span className="font-mono text-[11px] text-foreground">{section.title}</span>
                {openSections.has(i) ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              </button>
              <AnimatePresence>
                {openSections.has(i) && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-3 pb-3">
                      <p className="text-[11px] text-foreground/80 leading-relaxed whitespace-pre-line">{section.content}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const ReportsPage = () => {
  const [showGenerate, setShowGenerate] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  return (
    <div className="absolute inset-0 flex pointer-events-auto" style={{ background: 'rgba(10,14,26,0.9)' }}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
          <h1 className="font-heading text-sm tracking-wider text-foreground">INTELLIGENCE REPORTS</h1>
          <button onClick={() => setShowGenerate(true)} className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-primary hover:text-primary/80 px-3 py-1.5 rounded border border-primary/30 bg-primary/5 transition-colors">
            <Plus className="w-3.5 h-3.5" /> GENERATE
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {REPORTS.map(report => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedReport(report)}
                className={`rounded border bg-card/80 backdrop-blur-sm p-4 cursor-pointer hover:border-primary/30 transition-colors ${selectedReport?.id === report.id ? 'border-primary/40' : 'border-border'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] text-primary">{report.id}</span>
                  <span className={`font-mono text-[9px] tracking-wider ${TYPE_COLORS[report.type]}`}>{report.type.replace('_', ' ').toUpperCase()}</span>
                </div>
                <h3 className="text-[12px] text-foreground font-medium mb-1">{report.title}</h3>
                <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{report.summary}</p>
                <div className="flex items-center gap-1 mt-2 text-[9px] text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span className="font-mono">{new Date(report.created).toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedReport && <ReportDetail report={selectedReport} onClose={() => setSelectedReport(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showGenerate && <GenerateModal onClose={() => setShowGenerate(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default ReportsPage;
