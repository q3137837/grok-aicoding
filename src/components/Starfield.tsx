const STARS = Array.from({ length: 56 }, (_, i) => ({
  id: i,
  left: (i * 17 + 9) % 100,
  top: (i * 29 + 6) % 100,
  size: 1.5 + (i % 4),
  delay: (i % 7) * 0.35,
}));

export function Starfield({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1e3168_0%,_#0e1a3a_55%,_#0a1228_100%)]" />
      {STARS.map((s) => (
        <span
          key={s.id}
          className="star-dot absolute rounded-full bg-cream"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            opacity: 0.7,
          }}
        />
      ))}
      <div className="absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-coral/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-mint/10 blur-3xl" />
    </div>
  );
}
