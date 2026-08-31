import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Starfield } from "@/components/Starfield";
import { Button } from "@/components/ui/button";
import { PartnerPortrait } from "@/components/PartnerPortrait";
import { seedClass, CLASS_CODE } from "@/lib/content/classroom";
import { LEVELS } from "@/lib/content/levels";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Classmate } from "@/lib/types";
import { MonitorUp, Lock, Unlock } from "lucide-react";

export const Route = createFileRoute("/teacher")({ component: TeacherPage });

function TeacherPage() {
  const name = useApp((s) => s.studentName) || "实习驯养员";
  const partnerId = useApp((s) => s.partnerId);
  const teacherName = useApp((s) => s.teacherName);
  const onboardTeacher = useApp((s) => s.onboardTeacher);
  const lesson = useApp((s) => s.currentLesson);
  const setLesson = useApp((s) => s.setLesson);
  const locked = useApp((s) => s.classLocked);
  const setLocked = useApp((s) => s.setLocked);
  const praise = useApp((s) => s.lightningPraise);
  const reset = useApp((s) => s.resetDemo);
  const enablePreviewAll = useApp((s) => s.enablePreviewAll);
  const [tname, setTname] = useState(teacherName);
  const [rows, setRows] = useState<Classmate[]>(() => seedClass(name, partnerId));
  const [selected, setSelected] = useState<string>("you");

  useEffect(() => {
    onboardTeacher(tname || "王老师");
  }, [onboardTeacher, tname]);

  useEffect(() => {
    const t = setInterval(() => {
      setRows((rs) =>
        rs.map((r) => {
          if (r.isYou) return { ...r, name, partnerId: partnerId ?? r.partnerId };
          if (Math.random() > 0.72) return r;
          const cycle: Classmate["status"][] = ["active", "idle", "active", "done", "stuck"];
          return {
            ...r,
            status: r.status === "error" ? "error" : cycle[Math.floor(Math.random() * cycle.length)],
            blocks: Math.min(12, r.blocks + (Math.random() > 0.5 ? 1 : 0)),
          };
        }),
      );
    }, 3200);
    return () => clearInterval(t);
  }, [name, partnerId]);

  const done = rows.filter((r) => r.status === "done").length;
  const stuck = rows.filter((r) => r.status === "stuck" || r.status === "error");
  const selectedRow = rows.find((r) => r.id === selected) ?? rows[0];

  const pools = useMemo(
    () => [
      { name: "A 组 · 主 Key 池", used: 2, cap: 3, fail: 0 },
      { name: "B 组 · 备用 Key", used: 1, cap: 3, fail: 1 },
      { name: "C 组 · 削峰队列", used: 3, cap: 3, fail: 0 },
      { name: "D 组 · 离线演示", used: 0, cap: 3, fail: 0 },
    ],
    [],
  );

  return (
    <div className="min-h-dvh bg-navy text-cream">
      <Starfield />
      <div className="relative mx-auto max-w-6xl px-4 py-6">
        <header className="flex flex-wrap items-center gap-3">
          <div className="flex-1">
            <p className="text-xs tracking-[0.2em] text-star">老师控制台</p>
            <h1 className="text-2xl font-semibold">一键上课 · {tname}</h1>
          </div>
          <input
            value={tname}
            onChange={(e) => setTname(e.target.value)}
            className="h-11 w-32 rounded-full bg-white/10 px-4 text-sm outline-none"
          />
          <Link to="/" className="text-sm text-cream/60">
            回首页
          </Link>
        </header>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] bg-white/8 p-5 ring-1 ring-white/10">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <p className="text-xs text-cream/50">课堂码</p>
                <p className="text-4xl font-semibold tracking-[0.2em]">{CLASS_CODE}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-cream/50">全班进度</p>
                <p className="text-lg font-semibold">
                  {done}/{rows.length} 已提交
                </p>
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-mint" style={{ width: `${(done / rows.length) * 100}%` }} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLesson(l.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold",
                    lesson === l.id ? "bg-coral text-navy" : "bg-white/10",
                  )}
                >
                  {l.id} {l.name}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button tone={locked ? "mint" : "star"} size="sm" onClick={() => setLocked(!locked)}>
                {locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {locked ? "解锁抬头" : "暂停锁屏"}
              </Button>
              <Button
                tone="coral"
                size="sm"
                onClick={() => praise(selectedRow.name)}
              >
                <MonitorUp className="h-4 w-4" />
                闪电点赞上大屏
              </Button>
              <Button tone="ghost" size="sm" onClick={enablePreviewAll}>
                为学生解锁全关
              </Button>
            </div>
          </div>

          <div className="rounded-[28px] bg-white/8 p-5 ring-1 ring-white/10">
            <p className="text-sm font-semibold">API 分组池水位</p>
            <ul className="mt-3 space-y-3">
              {pools.map((p) => (
                <li key={p.name}>
                  <div className="flex justify-between text-xs">
                    <span>{p.name}</span>
                    <span className="tabular-nums">
                      {p.used}/{p.cap}
                      {p.fail ? ` · 失败 ${p.fail}` : ""}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={cn("h-full", p.used >= p.cap ? "bg-coral" : "bg-mint")}
                      style={{ width: `${(p.used / p.cap) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-cream/50">失败自动切备用 Key。全班故障可一键离线演示。</p>
          </div>
        </section>

        {stuck.length > 0 && (
          <div className="mt-4 rounded-2xl bg-coral/15 px-4 py-3 text-sm">
            智能呼叫 · {stuck.length} 人待协助：{stuck.map((s) => s.name).join("、")}
          </div>
        )}

        <section className="mt-6">
          <p className="mb-3 text-sm font-semibold">座位网格 · 心跳</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {rows.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelected(r.id)}
                className={cn(
                  "rounded-2xl bg-white/6 p-2 text-left ring-2",
                  selected === r.id ? "ring-coral" : "ring-transparent",
                  r.status === "stuck" && "ring-star",
                  r.status === "error" && "ring-display",
                )}
              >
                <div className="flex items-center gap-2">
                  <PartnerPortrait id={r.partnerId} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">
                      {r.name}
                      {r.isYou ? " ·你" : ""}
                    </p>
                    <p className="text-[10px] text-cream/50">
                      {label(r.status)} · {r.blocks} 块
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[28px] bg-white/8 p-5 ring-1 ring-white/10">
          <p className="text-sm font-semibold">正在看 · {selectedRow.name}</p>
          <p className="mt-1 text-sm text-cream/60">
            积木 {selectedRow.blocks} · 星 {selectedRow.stars} · {label(selectedRow.status)}
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={() => praise(selectedRow.name)}>
              上大屏表扬
            </Button>
            <Button size="sm" tone="ghost">
              {selectedRow.status === "stuck" ? "去协助" : "实时预览"}
            </Button>
          </div>
        </section>

        <div className="mt-8 flex gap-3 pb-10">
          <Button tone="ghost" size="sm" onClick={reset}>
            重置演示数据
          </Button>
          <span className="text-xs text-cream/40">不收集手机号。学生用姓名 + 课堂码进场。</span>
        </div>
      </div>
    </div>
  );
}

function label(s: Classmate["status"]) {
  return { idle: "闲置", active: "创作中", stuck: "卡住", error: "AI 打瞌睡", done: "已提交" }[s];
}
