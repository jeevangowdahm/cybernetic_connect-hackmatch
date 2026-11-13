type Props = { value: number; size?: number };

export function MatchRing({ value, size = 64 }: Props) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const color =
    value >= 85 ? "hsl(var(--matrix))" :
    value >= 70 ? "hsl(var(--cyan))" :
    value >= 40 ? "hsl(var(--gold))" :
    "hsl(var(--muted-foreground))";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={4}
          fill="none"
          opacity={0.3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={4}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${color})`,
            transition: "stroke-dashoffset 0.8s ease",
          }}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ color }}
      >
        <span className="font-display text-lg font-extrabold leading-none">{value}</span>
        <span className="text-[8px] font-mono uppercase tracking-widest opacity-70">match</span>
      </div>
    </div>
  );
}
