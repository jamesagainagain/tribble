import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Camera, Mic, Check } from 'lucide-react';

const EVENT_TYPES = [
  { icon: '💥', label: 'Armed Conflict', value: 'armed_conflict' },
  { icon: '🏃', label: 'Displacement', value: 'displacement_mass' },
  { icon: '🏗', label: 'Infrastructure', value: 'bridge_damaged' },
  { icon: '🚧', label: 'Aid Obstruction', value: 'aid_obstruction' },
  { icon: '⛈', label: 'Natural Disaster', value: 'flood' },
  { icon: '🦠', label: 'Disease Outbreak', value: 'disease_outbreak' },
  { icon: '👁', label: 'Suspicious Activity', value: 'suspicious_activity' },
  { icon: '🛣', label: 'Route Blocked', value: 'road_blocked' },
  { icon: '📦', label: 'Aid Needed', value: 'food_distribution' },
  { icon: '🔥', label: 'Fire / Explosion', value: 'fire' },
  { icon: '💧', label: 'Water / Food', value: 'water_contamination' },
  { icon: '···', label: 'Other', value: 'casualty_report' },
];

const STEPS = ['What happened?', 'Where?', 'When?', 'Evidence', 'Review & Submit'];

export const PortalSubmitPage = () => {
  const [step, setStep] = useState(0);
  const [eventType, setEventType] = useState('');
  const [description, setDescription] = useState('');
  const [useLocation, setUseLocation] = useState(false);
  const [coords, setCoords] = useState({ lat: '', lng: '' });
  const [timeNow, setTimeNow] = useState(true);
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleUseLocation = () => {
    setUseLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude.toFixed(4), lng: pos.coords.longitude.toFixed(4) }),
        () => setCoords({ lat: '14.88', lng: '17.65' })
      );
    } else {
      setCoords({ lat: '14.88', lng: '17.65' });
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-full bg-[hsl(var(--hip-green))]/20 border border-[hsl(var(--hip-green))]/40 flex items-center justify-center mb-4"
        >
          <Check className="w-8 h-8 text-[hsl(var(--hip-green))]" />
        </motion.div>
        <h2 className="font-heading text-lg tracking-wider text-foreground mb-2">REPORT SUBMITTED</h2>
        <p className="font-mono text-[11px] text-primary mb-4">REF: RPT-{new Date().toISOString().slice(0,10).replace(/-/g,'')}-{String(Math.floor(Math.random()*9999)).padStart(4,'0')}</p>
        <p className="text-[12px] text-muted-foreground max-w-xs mb-6">
          Your report has been received and will be reviewed by our verification team.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => { setSubmitted(false); setStep(0); setEventType(''); setDescription(''); }}
            className="font-mono text-[10px] tracking-wider px-4 py-2 rounded-sm bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
          >
            SUBMIT ANOTHER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Progress */}
      <div className="flex items-center gap-1 mb-6">
        {STEPS.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className={`h-1 w-full rounded-full ${i <= step ? 'bg-primary' : 'bg-border'}`} />
            <span className={`font-mono text-[8px] ${i === step ? 'text-primary' : 'text-muted-foreground'}`}>{i + 1}</span>
          </div>
        ))}
      </div>

      <h2 className="font-heading text-sm tracking-wider text-foreground mb-4">{STEPS[step]}</h2>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-3 gap-2">
            {EVENT_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => { setEventType(t.value); setStep(1); }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-sm border transition-all ${
                  eventType === t.value ? 'border-primary bg-primary/10 shadow-[0_0_12px_rgba(0,212,255,0.15)]' : 'border-border bg-card hover:border-primary/30'
                }`}
              >
                <span className="text-2xl">{t.icon}</span>
                <span className="font-heading text-[9px] tracking-wider text-foreground text-center">{t.label}</span>
              </button>
            ))}
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <button
              onClick={handleUseLocation}
              className="w-full flex items-center gap-2 p-3 rounded-sm border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-mono text-[11px] text-primary">USE MY LOCATION</span>
            </button>
            {useLocation && coords.lat && (
              <p className="font-mono text-[10px] text-muted-foreground text-center">{coords.lat}°N, {coords.lng}°E</p>
            )}
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what you saw in as much detail as possible."
              maxLength={500}
              rows={4}
              className="w-full bg-card border border-border rounded-sm px-3 py-2 font-mono text-[11px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 resize-none"
            />
            <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
              <span>{description.length}/500</span>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!description}
              className="w-full font-mono text-[10px] tracking-wider py-2 rounded-sm bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors disabled:opacity-40"
            >
              NEXT
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <button
              onClick={() => { setTimeNow(true); setStep(3); }}
              className={`w-full flex items-center gap-2 p-3 rounded-sm border transition-colors ${
                timeNow ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'
              }`}
            >
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-mono text-[11px] text-primary">RIGHT NOW</span>
            </button>
            <button
              onClick={() => setTimeNow(false)}
              className={`w-full flex items-center gap-2 p-3 rounded-sm border transition-colors ${
                !timeNow ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'
              }`}
            >
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-[11px] text-foreground">EARLIER TODAY / PAST EVENT</span>
            </button>
            {!timeNow && (
              <input type="datetime-local" className="w-full bg-card border border-border rounded-sm px-3 py-2 font-mono text-[11px] text-foreground outline-none" />
            )}
            <button
              onClick={() => setStep(3)}
              className="w-full font-mono text-[10px] tracking-wider py-2 rounded-sm bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
            >
              NEXT
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <p className="text-[11px] text-muted-foreground">Evidence is optional but helps verification.</p>
            <div className="flex gap-3">
              <button className="flex-1 flex flex-col items-center gap-2 p-4 rounded-sm border border-border hover:border-primary/30 transition-colors">
                <Camera className="w-6 h-6 text-muted-foreground" />
                <span className="font-mono text-[9px] text-muted-foreground">PHOTO</span>
              </button>
              <button className="flex-1 flex flex-col items-center gap-2 p-4 rounded-sm border border-border hover:border-primary/30 transition-colors">
                <Mic className="w-6 h-6 text-muted-foreground" />
                <span className="font-mono text-[9px] text-muted-foreground">AUDIO</span>
              </button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={e => setAnonymous(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-[11px] text-foreground">Anonymous submission</span>
            </label>
            <button
              onClick={() => setStep(4)}
              className="w-full font-mono text-[10px] tracking-wider py-2 rounded-sm bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
            >
              NEXT
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="bg-card border border-border rounded-sm p-4 space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Type</span>
                <span className="font-mono text-foreground">{EVENT_TYPES.find(t => t.value === eventType)?.label || 'Unknown'}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Location</span>
                <span className="font-mono text-foreground">{coords.lat ? `${coords.lat}°N, ${coords.lng}°E` : 'Not set'}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Time</span>
                <span className="font-mono text-foreground">{timeNow ? 'Now' : 'Custom'}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Anonymous</span>
                <span className="font-mono text-foreground">{anonymous ? 'Yes' : 'No'}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <span className="text-[9px] text-muted-foreground">DESCRIPTION</span>
                <p className="text-[11px] text-foreground/80 mt-1">{description}</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full font-mono text-[11px] tracking-wider py-3 rounded-sm bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              SUBMIT REPORT
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      {step > 0 && !submitted && (
        <button
          onClick={() => setStep(step - 1)}
          className="mt-4 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          ← BACK
        </button>
      )}
    </div>
  );
};
