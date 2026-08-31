import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Starfield } from "@/components/Starfield";
import { Button } from "@/components/ui/button";
import { PartnerPortrait } from "@/components/PartnerPortrait";
import { PARTNERS } from "@/lib/content/partners";
import { useApp } from "@/lib/store";
import type { PartnerId } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboard")({ component: Onboard });

function Onboard() {
  const nav = useNavigate();
  const onboardStudent = useApp((s) => s.onboardStudent);
  const [name, setName] = useState(useApp.getState().studentName || "");
  const [pid, setPid] = useState<PartnerId | null>(useApp.getState().partnerId);
  const [code, setCode] = useState("8821");

  return (
    <main className="relative min-h-dvh">
      <Starfield />
      <div className="relative mx-auto max-w-3xl px-5 py-10">
        <p className="text-xs tracking-[0.2em] text-star">开课六选一</p>
        <h1 className="mt-2 text-3xl font-semibold">选一只伙伴，贯穿八课</h1>
        <p className="mt-2 text-cream/70">伙伴是被营救的同学，不是工具。它会说话，有脾气，有本领。</p>

        <label className="mt-8 block text-sm font-semibold text-cream/80">你的名字</label>
        <input
          value={name}
          maxLength={6}
          onChange={(e) => setName(e.target.value)}
          placeholder="两个字就好"
          className="mt-2 h-14 w-full rounded-2xl bg-white/10 px-4 text-lg outline-none ring-1 ring-white/10 placeholder:text-cream/35"
        />

        <label className="mt-6 block text-sm font-semibold text-cream/80">课堂码</label>
        <input
          value={code}
          maxLength={8}
          onChange={(e) => setCode(e.target.value)}
          className="mt-2 h-12 w-40 rounded-2xl bg-white/10 px-4 font-semibold tracking-[0.3em] outline-none ring-1 ring-white/10"
        />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PARTNERS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPid(p.id)}
              className={cn(
                "rounded-[24px] bg-white/8 p-4 text-left ring-2 transition",
                pid === p.id ? "ring-coral bg-white/14" : "ring-transparent",
              )}
            >
              <PartnerPortrait id={p.id} size="md" />
              <p className="mt-3 font-semibold">
                {p.title}·{p.name}
              </p>
              <p className="mt-1 text-xs text-cream/60">{p.catchphrase}</p>
            </button>
          ))}
        </div>

        <Button
          className="mt-8 w-full"
          size="lg"
          disabled={!name.trim() || !pid}
          onClick={() => {
            if (!pid) return;
            onboardStudent(name.trim(), pid);
            nav({ to: "/map" });
          }}
        >
          登岛 · 开始营救
        </Button>
      </div>
    </main>
  );
}
