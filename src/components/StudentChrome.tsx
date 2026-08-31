import { Link } from "@tanstack/react-router";
import { BookOpen, Map as MapIcon, Sparkles, Wand2, Volume2, VolumeX } from "lucide-react";
import { useApp } from "@/lib/store";
import { PartnerPortrait } from "@/components/PartnerPortrait";
import { cn } from "@/lib/utils";

export function StudentChrome({
  title,
  backTo,
}: {
  title: string;
  backTo?: string;
}) {
  const name = useApp((s) => s.studentName) || "实习驯养员";
  const partnerId = useApp((s) => s.partnerId) ?? "cat";
  const energy = useApp((s) => s.energy);
  const silent = useApp((s) => s.silentMode);
  const setSilent = useApp((s) => s.setSilent);
  const lit = useApp((s) => s.lit.length);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-navy/90 px-3 py-2.5 backdrop-blur-md md:px-5">
      {backTo ? (
        <Link
          to={backTo}
          className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-white/10 px-3 text-sm font-semibold text-cream"
        >
          返回
        </Link>
      ) : (
        <PartnerPortrait id={partnerId} size="sm" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-cream/60">{name} · 星光驯养员</p>
      </div>
      <span className="hidden items-center gap-1 rounded-full bg-star/15 px-3 py-1.5 text-sm font-semibold text-star sm:inline-flex">
        点亮 {lit}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-coral/15 px-3 py-1.5 text-sm font-semibold text-coral">
        能量 {energy}
      </span>
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10"
        onClick={() => setSilent(!silent)}
        aria-label={silent ? "打开声音" : "关闭声音"}
      >
        {silent ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
    </header>
  );
}

export function StudentDock({ active }: { active: "map" | "codex" | "free" | "chest" }) {
  const item = (
    to: string,
    key: typeof active,
    label: string,
    Icon: typeof MapIcon,
  ) => (
    <Link
      to={to}
      className={cn(
        "flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-xs font-semibold",
        active === key ? "bg-white/12 text-star" : "text-cream/70",
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
  return (
    <nav className="sticky bottom-0 z-30 flex gap-1 border-t border-white/10 bg-navy/95 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {item("/map", "map", "星图", MapIcon)}
      {item("/codex", "codex", "图鉴", BookOpen)}
      {item("/free", "free", "自由星", Wand2)}
      {item("/chest", "chest", "盲盒", Sparkles)}
    </nav>
  );
}
