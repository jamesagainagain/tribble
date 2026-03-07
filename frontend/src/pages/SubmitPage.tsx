import { useState } from 'react';
import { Send, MapPin, Camera, AlertTriangle } from 'lucide-react';

const CATEGORIES = [
  { id: 'armed_conflict', label: 'Armed Conflict', icon: '⚔️' },
  { id: 'displacement', label: 'Displacement', icon: '🏃' },
  { id: 'infrastructure', label: 'Infrastructure Damage', icon: '🏗️' },
  { id: 'aid_needed', label: 'Aid Needed', icon: '🆘' },
  { id: 'natural_hazard', label: 'Natural Hazard', icon: '🌊' },
  { id: 'safety_concern', label: 'Safety Concern', icon: '⚠️' },
];

export const SubmitPage = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setCategory('');
    setDescription('');
    setLocation('');
  };

  return (
    <div className="absolute inset-0 pointer-events-auto overflow-y-auto">
      <div className="max-w-lg mx-auto p-6 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Send className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-lg tracking-wider text-foreground">SUBMIT REPORT</h2>
            <p className="font-body text-xs text-muted-foreground">Share ground-truth observations to help others</p>
          </div>
        </div>

        {submitted && (
          <div className="mb-4 p-3 rounded-sm bg-[hsl(var(--hip-green))]/10 border border-[hsl(var(--hip-green))]/30">
            <p className="font-mono text-xs text-[hsl(var(--hip-green))]">✓ Report submitted successfully. Under review.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category */}
          <div>
            <label className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2 block">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-sm border text-left transition-colors ${
                    category === cat.id
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span className="font-body text-xs">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2 block">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Enter location or tap map to pin"
                className="w-full h-10 pl-10 pr-3 rounded-sm border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2 block">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What did you observe? Include details about timing, severity, and any relevant context."
              rows={4}
              className="w-full p-3 rounded-sm border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2 block">Attachments</label>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-3 rounded-sm border border-dashed border-border bg-card hover:border-primary/30 transition-colors w-full"
            >
              <Camera className="w-4 h-4 text-muted-foreground" />
              <span className="font-body text-xs text-muted-foreground">Add photo or document</span>
            </button>
          </div>

          {/* Urgency */}
          <div>
            <label className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2 block">Urgency</label>
            <div className="flex gap-2">
              {['Low', 'Medium', 'High', 'Critical'].map(u => (
                <button
                  key={u}
                  type="button"
                  className="flex-1 px-2 py-2 rounded-sm border border-border bg-card text-xs font-mono text-muted-foreground hover:border-primary/30 transition-colors"
                >
                  {u.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!category || !description}
            className="w-full h-10 rounded-sm bg-primary text-primary-foreground font-mono text-xs tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            SUBMIT REPORT
          </button>

          <p className="text-center font-body text-[10px] text-muted-foreground">
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            Reports are reviewed by analysts before publication
          </p>
        </form>
      </div>
    </div>
  );
};

export default SubmitPage;
