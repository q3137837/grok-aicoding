import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Starfield } from "@/components/Starfield";
import { Button } from "@/components/ui/button";
import { PartnerPortrait } from "@/components/PartnerPortrait";
import { CODEX } from "@/lib/content/blocks";
import { LEVELS } from "@/lib/content/levels";
import { useApp } from "@/lib/store";
import { PedIcon } from "@/components/PedIcons";

export const Route = createFileRoute("/parent")({ component: ParentPage });

function ParentPage() {
  const bound = useApp((s) => s.parentBound);
  const bind = useApp((s) => s.bindParent);
  const familyCode = useApp((s) => s.familyCode);
  const name = useApp((s) => s.studentName) || "孩子";
  const partnerId = useApp((s) => s.partnerId) ?? "cat";
  const lit = useApp((s) => s.lit);
  const stars = useApp((s) => s.stars);
  const energy = useApp((s) => s.energy);
  const [code, setCode] = useState("");
  const [tab, setTab] = useState<"work" | "week" | "box" | "poster">("week");
  const [err, setErr] = useState("");

  if (!bound) {
    return (
      <main className="relative grid min-h-dvh place-items-center px-5">
        <Starfield />
        <div className="relative w-full max-w-sm rounded-[28px] bg-cream p-6 text-ink">
          <p className="text-xs font-semibold text-coral">家长端 · 零注册</p>
          <h1 className="mt-2 text-2xl font-semibold">输入 4 位家庭码</h1>
          <p className="mt-2 text-sm text-ink-soft">孩子在学生端把码报给你。不收集手机号。</p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric"
            className="mt-5 h-16 w-full rounded-2xl bg-foam text-center text-3xl tracking-[0.4em] outline-none"
            placeholder="8821"
          />
          {err && <p className="mt-2 text-sm text-display">{err}</p>}
          <Button
            className="mt-5 w-full"
            onClick={() => {
              const ok = bind(code || "8821");
              if (!ok) setErr("码不对。问问孩子，或先用 8821 看演示。");
            }}
          >
            绑定
          </Button>
          <p className="mt-3 text-center text-xs text-ink-soft">演示码 8821 · 当前学生码 {familyCode || "尚未开课"}</p>
          <Link to="/" className="mt-4 block text-center text-sm text-coral">
            回首页
          </Link>
        </div>
      </main>
    );
  }

  const starSum = Object.values(stars).reduce((a, b) => a + b, 0);

  return (
    <main className="min-h-dvh bg-cream text-ink">
      <header className="bg-navy px-5 py-6 text-cream">
        <p className="text-xs tracking-[0.2em] text-star">成长周报</p>
        <div className="mt-3 flex items-center gap-3">
          <PartnerPortrait id={partnerId} size="sm" />
          <div>
            <h1 className="text-2xl font-semibold">{name}</h1>
            <p className="text-sm text-cream/60">家庭码 {familyCode || "8821"}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat n={starSum} label="本周星星" />
          <Stat n={lit.length} label="点亮知识卡" />
          <Stat n={energy} label="能量" />
        </div>
      </header>

      <nav className="flex gap-1 bg-foam px-3 py-2">
        {(
          [
            ["week", "周报"],
            ["work", "作品"],
            ["box", "亲子开盒"],
            ["poster", "换卡海报"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold ${tab === id ? "bg-coral text-navy" : "text-ink-soft"}`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="mx-auto max-w-lg px-5 py-6">
        {tab === "week" && (
          <div>
            <p className="text-sm text-ink-soft">图鉴点亮 = 真实掌握。不是抽到就算学会。</p>
            <ul className="mt-4 space-y-2">
              {CODEX.map((c) => (
                <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-foam px-3 py-2">
                  <PedIcon name={c.id === "skill" ? "skill" : c.id === "rag" ? "rag" : "persona"} className="h-10 w-10" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-ink-soft">{lit.includes(c.id) ? "已点亮" : "尚未点亮"}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {tab === "work" && (
          <div>
            <p className="text-sm text-ink-soft">孩子最新关卡进度，可在课堂里运行。</p>
            <ul className="mt-4 space-y-2">
              {LEVELS.map((l) => (
                <li key={l.id} className="rounded-2xl bg-foam px-4 py-3">
                  <p className="font-semibold">
                    {l.id} {l.name}
                  </p>
                  <p className="text-sm text-ink-soft">{stars[l.id] ?? 0} / 3 星</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {tab === "box" && (
          <div className="text-center">
            <img src="/scenes/chest.jpg" alt="" className="mx-auto h-40 w-40 rounded-3xl object-cover" />
            <p className="mt-4 text-sm text-ink-soft">每日 1 次免费同步开盒。奖的是装饰，点亮仍要通关。</p>
            <Button className="mt-4">和孩子一起开</Button>
          </div>
        )}
        {tab === "poster" && (
          <div className="rounded-[24px] bg-navy p-5 text-center text-cream">
            <p className="text-xs text-star">换卡海报</p>
            <p className="mt-2 text-xl font-semibold">{name} 的图鉴</p>
            <p className="mt-1 text-sm text-cream/60">点亮 {lit.length} 张 · 还缺 {CODEX.length - lit.length} 张</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {CODEX.slice(0, 6).map((c) => (
                <div key={c.id} className="rounded-xl bg-white/10 py-4 text-xs">
                  {lit.includes(c.id) ? c.motto.slice(0, 4) : "缺"}
                </div>
              ))}
            </div>
          </div>
        )}
        <Link to="/" className="mt-8 block text-center text-sm text-coral">
          回首页
        </Link>
      </div>
    </main>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-2xl bg-white/8 py-3">
      <p className="text-2xl font-semibold tabular-nums">{n}</p>
      <p className="text-[11px] text-cream/60">{label}</p>
    </div>
  );
}
