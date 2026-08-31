import { cn } from "@/lib/utils";

const fill: Record<string, string> = {
  persona: "bg-persona",
  rag: "bg-rag",
  firework: "bg-display",
  trigger: "bg-trigger",
  skill: "bg-skill",
  memory: "bg-rag",
  voice: "bg-trigger",
  combo: "bg-display",
};

export function PedIcon({
  name,
  className,
}: {
  name: keyof typeof fill;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-16 w-16 items-center justify-center rounded-2xl text-foam",
        fill[name],
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none">
        {name === "persona" && (
          <>
            <rect x="10" y="8" width="28" height="32" rx="6" fill="currentColor" opacity="0.95" />
            <circle cx="24" cy="20" r="6" fill="#0E1A3A" opacity="0.35" />
            <rect x="16" y="30" width="16" height="4" rx="2" fill="#0E1A3A" opacity="0.35" />
          </>
        )}
        {name === "rag" && (
          <>
            <rect x="8" y="18" width="32" height="20" rx="4" fill="currentColor" />
            <path d="M8 22c4-8 28-8 32 0" stroke="#F7F0E4" strokeWidth="3" fill="none" />
            <rect x="20" y="24" width="8" height="8" rx="1" fill="#F5C15A" />
          </>
        )}
        {name === "memory" && (
          <>
            <rect x="12" y="8" width="24" height="32" rx="3" fill="currentColor" />
            <path d="M18 16h12M18 22h12M18 28h8" stroke="#F7F0E4" strokeWidth="2" />
          </>
        )}
        {name === "trigger" && (
          <>
            <circle cx="24" cy="24" r="14" fill="currentColor" />
            <circle cx="24" cy="24" r="6" fill="#F7F0E4" />
          </>
        )}
        {name === "voice" && (
          <>
            <path d="M10 24h6l8-10v20l-8-10H10z" fill="currentColor" />
            <path d="M30 18c3 3 3 9 0 12M34 14c6 6 6 14 0 20" stroke="currentColor" strokeWidth="3" />
          </>
        )}
        {name === "skill" && (
          <>
            <rect x="10" y="10" width="28" height="28" rx="6" fill="currentColor" />
            <path d="M18 30l6-16 6 16M20 25h8" stroke="#F7F0E4" strokeWidth="2.5" />
          </>
        )}
        {name === "firework" && (
          <>
            <circle cx="24" cy="24" r="3" fill="currentColor" />
            <path d="M24 8v8M24 32v8M8 24h8M32 24h8M13 13l6 6M29 29l6 6M13 35l6-6M29 19l6-6" stroke="currentColor" strokeWidth="3" />
          </>
        )}
        {name === "combo" && (
          <>
            <rect x="7" y="16" width="16" height="16" rx="3" fill="currentColor" />
            <rect x="25" y="16" width="16" height="16" rx="3" fill="currentColor" opacity="0.7" />
            <path d="M20 24h8" stroke="#F7F0E4" strokeWidth="3" />
          </>
        )}
      </svg>
    </span>
  );
}

export function KindChip({
  color,
  children,
}: {
  color: string;
  children: string;
}) {
  const map: Record<string, string> = {
    persona: "bg-persona",
    rag: "bg-rag",
    skill: "bg-skill",
    trigger: "bg-trigger",
    script: "bg-script text-navy",
    display: "bg-display",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-foam", map[color])}>
      {children}
    </span>
  );
}
