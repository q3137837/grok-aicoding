import type { ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LEVELS } from "@/lib/content/levels";
import { useApp } from "@/lib/store";
import { StudentChrome, StudentDock } from "@/components/StudentChrome";
import { Starfield } from "@/components/Starfield";
import { PartnerPortrait } from "@/components/PartnerPortrait";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/map")({ component: MapPage });

function MapPage() {
  const nav = useNavigate();
  const onboarded = useApp((s) => s.onboarded);
  const partnerId = useApp((s) => s.partnerId) ?? "cat";
  const unlocked = useApp((s) => s.unlocked);
  const previewAll = useApp((s) => s.previewAll);
  const stars = useApp((s) => s.stars);
  const current = useApp((s) => s.currentLesson);

  if (!onboarded) {
    return (
      <main className="grid min-h-dvh place-items-center bg-navy">
        <Link to="/onboard" className="text-coral">
          先选一只伙伴
        </Link>
      </main>
    );
  }

  const ch1 = LEVELS.filter((l) => l.chapter === 1);
  const ch2 = LEVELS.filter((l) => l.chapter === 2);
  const ch1done = ch1.every((l) => (stars[l.id] ?? 0) >= 1);

  return (
    <div className="flex min-h-dvh flex-col bg-navy">
      <StudentChrome title="星空闯关地图" />
      <div className="relative flex-1">
        <Starfield />
        <div className="relative mx-auto max-w-4xl space-y-8 px-4 py-6 pb-24">
          <Island
            title="第 1 章 · 回声岛"
            subtitle="找回声音与记忆"
            img="/scenes/echo.jpg"
            done={ch1done}
          >
            {ch1.map((l) => {
              const open = previewAll || unlocked.includes(l.id);
              const st = stars[l.id] ?? 0;
              const pulse = current === l.id && open && st === 0;
              return (
                <Node
                  key={l.id}
                  open={open}
                  stars={st}
                  pulse={pulse}
                  name={`${l.id} ${l.name}`}
                  onClick={() => open && nav({ to: "/level/$levelId", params: { levelId: l.id } })}
                />
              );
            })}
          </Island>

          <Island
            title="第 2 章 · 彩虹环带"
            subtitle="找回本领"
            img="/scenes/rainbow.jpg"
            done={ch2.every((l) => (stars[l.id] ?? 0) >= 1)}
          >
            {ch2.map((l) => {
              const open = previewAll || unlocked.includes(l.id);
              const st = stars[l.id] ?? 0;
              const pulse = current === l.id && open && st === 0;
              return (
                <Node
                  key={l.id}
                  open={open}
                  stars={st}
                  pulse={pulse}
                  name={`${l.id} ${l.name}`}
                  onClick={() => open && nav({ to: "/level/$levelId", params: { levelId: l.id } })}
                />
              );
            })}
          </Island>

          <div className="flex items-center justify-center gap-3 pt-2">
            <PartnerPortrait id={partnerId} size="sm" />
            <p className="text-sm text-cream/70">驾小艇登岛。通关一章，全岛点亮一次环岛烟花。</p>
          </div>
        </div>
      </div>
      <StudentDock active="map" />
    </div>
  );
}

function Island({
  title,
  subtitle,
  img,
  done,
  children,
}: {
  title: string;
  subtitle: string;
  img: string;
  done: boolean;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] ring-1 ring-white/10">
      <div className="relative h-36 md:h-44">
        <img src={img} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-xs text-cream/70">{subtitle}</p>
        </div>
        {done && (
          <span className="absolute right-3 top-3 rounded-full bg-star px-3 py-1 text-xs font-bold text-navy">
            环岛烟花
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 bg-navy-2 p-4 md:grid-cols-4">{children}</div>
    </section>
  );
}

function Node({
  open,
  stars,
  pulse,
  name,
  onClick,
}: {
  open: boolean;
  stars: number;
  pulse: boolean;
  name: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!open}
      className={cn(
        "rounded-2xl p-3 text-left ring-1 ring-white/10",
        open ? "bg-white/8" : "bg-white/4 text-cream/40",
        pulse && "breathe",
      )}
    >
      <div className="flex items-center justify-between">
        {open ? (
          <span className="text-xs text-star">{stars}/3 星</span>
        ) : (
          <Lock className="h-4 w-4 text-fog" />
        )}
        {stars >= 3 && <span className="text-[10px] text-mint">彩旗</span>}
      </div>
      <p className="mt-2 text-sm font-semibold leading-snug">{name}</p>
    </button>
  );
}
