interface RiskGaugeProps {
  score: number;
  size?: number;
}

export const RiskGauge = ({ score, size = 80 }: RiskGaugeProps) => {
  const radius = (size - 10) / 2;
  const circumference = Math.PI * radius;
  const filled = (score / 100) * circumference;

  // Color interpolation: low→medium→high→critical
  const getColor = (s: number) => {
    if (s >= 80) return 'hsl(var(--hip-critical))';
    if (s >= 60) return 'hsl(var(--hip-high))';
    if (s >= 40) return 'hsl(var(--hip-medium))';
    return 'hsl(var(--hip-low))';
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
        {/* Background arc */}
        <path
          d={`M 5 ${size / 2 + 5} A ${radius} ${radius} 0 0 1 ${size - 5} ${size / 2 + 5}`}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={`M 5 ${size / 2 + 5} A ${radius} ${radius} 0 0 1 ${size - 5} ${size / 2 + 5}`}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <span className="font-mono text-sm" style={{ color: getColor(score), marginTop: -4 }}>{score}</span>
    </div>
  );
};
