import { createFileRoute } from "@tanstack/react-router";
import { CODEX } from "@/lib/content/blocks";
import { useApp } from "@/lib/store";
import { StudentChrome, StudentDock } from "@/components/StudentChrome";
import { PedIcon } from "@/components/PedIcons";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/codex")({ component: CodexPage });

function CodexPage() {
  const collected = useApp((s) => s.collected);
  const lit = useApp((s) => s.lit);

  return (
    <div className="flex min-h-dvh flex-col bg-navy">
      <StudentChrome title="冒险图鉴" />
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 pb-24">
        <p className="text-sm text-cream/70">
          抽到卡 = 收藏。点亮卡 = 学会。图鉴按点亮数计算，集齐就是学会。
        </p>
        <p className="mt-2 text-star">
          点亮 {lit.length} / {CODEX.length}
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {CODEX.map((c) => {
            const got = collected.includes(c.id);
            const on = lit.includes(c.id);
            return (
              <article
                key={c.id}
                className={cn(
                  "rounded-[24px] p-4 ring-1 ring-white/10",
                  on ? "bg-white/12" : got ? "bg-white/6" : "bg-white/3 opacity-70",
                )}
              >
                <div className="flex items-start gap-3">
                  <PedIcon name={iconOf(c.id)} className={cn(!on && "grayscale")} />
                  <div>
                    <p className="text-xs text-cream/50">{c.lesson}</p>
                    <h2 className="font-semibold">{got ? c.name : "????"}</h2>
                    <p className="mt-1 text-sm text-star">{on ? c.motto : got ? "灰面 · 待点亮" : "未抽到"}</p>
                    {on && <p className="mt-2 text-sm text-cream/70">{c.desc}</p>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <StudentDock active="codex" />
    </div>
  );
}

function iconOf(id: string): "persona" | "rag" | "firework" | "trigger" | "skill" | "memory" | "voice" | "combo" {
  if (id === "persona" || id === "catchphrase") return "persona";
  if (id === "trigger") return "trigger";
  if (id === "rag") return "rag";
  if (id === "memory") return "memory";
  if (id === "skill") return "skill";
  if (id === "voice") return "voice";
  if (id === "firework") return "firework";
  if (id === "combo") return "combo";
  return "persona";
}
