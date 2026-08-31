import type { ReactNode } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookOpen, GraduationCap, Heart, Sparkles } from "lucide-react";
import { Starfield } from "@/components/Starfield";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { PartnerPortrait } from "@/components/PartnerPortrait";
import type { PartnerId } from "@/lib/types";

export const Route = createFileRoute("/")({ component: Home });

const SIX: PartnerId[] = ["cat", "dog", "rabbit", "parrot", "turtle", "owl"];

function Home() {
  const nav = useNavigate();
  const hydrated = useApp((s) => s.hydrated);
  const onboarded = useApp((s) => s.onboarded);
  const role = useApp((s) => s.role);
  const enablePreviewAll = useApp((s) => s.enablePreviewAll);

  if (!hydrated) {
    return (
      <main className="relative grid min-h-dvh place-items-center">
        <Starfield />
        <p className="relative text-cream/80">星语号正在靠岸…</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <Starfield />
      <div className="relative mx-auto flex min-h-dvh max-w-5xl flex-col px-5 py-8">
        <p className="text-xs tracking-[0.28em] text-star">STAR WHISPER · AGENT 课堂</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-cream md:text-6xl">星语号</h1>
        <p className="mt-2 max-w-md text-lg text-cream/75">
          灰雾偷走了声音、记忆和本领。你是星光驯养员。搭一个会说话的伙伴，把它唤醒。
        </p>

        <div className="mt-6 overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <img src="/scenes/hero.jpg" alt="星语号驶过灰雾" className="h-48 w-full object-cover md:h-72" />
        </div>

        <div className="mt-5 flex justify-center gap-3">
          {SIX.map((id) => (
            <PartnerPortrait key={id} id={id} size="sm" />
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <RoleCard
            icon={<Sparkles className="h-5 w-5" />}
            title="我是驯养员"
            desc="选一只星灵，从第一课唤醒它。"
            onClick={() => nav({ to: onboarded && role === "student" ? "/map" : "/onboard" })}
          />
          <RoleCard
            icon={<GraduationCap className="h-5 w-5" />}
            title="我是老师"
            desc="一键上课、心跳网格、闪电点赞。"
            onClick={() => nav({ to: "/teacher" })}
          />
          <RoleCard
            icon={<Heart className="h-5 w-5" />}
            title="我是家长"
            desc="家庭码绑定，看作品和图鉴点亮。"
            onClick={() => nav({ to: "/parent" })}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            tone="star"
            onClick={() => {
              enablePreviewAll();
              nav({ to: "/map" });
            }}
          >
            校长预览 · 打开全部关卡
          </Button>
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm text-cream/70"
            onClick={() => nav({ to: "/codex" })}
          >
            <BookOpen className="h-4 w-4" />
            先看图鉴
          </button>
        </div>

        <p className="mt-auto pt-10 text-xs text-cream/45">
          给 6–12 岁的 Agent 原生课堂 · 角色卡 / 百宝箱 / 技能 · 不是带 AI 积木的 Scratch
        </p>
      </div>
    </main>
  );
}

function RoleCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[24px] bg-white/8 p-5 text-left ring-1 ring-white/10 transition hover:bg-white/12"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-coral/20 text-coral">
        {icon}
      </span>
      <p className="mt-3 text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm text-cream/65">{desc}</p>
    </button>
  );
}
