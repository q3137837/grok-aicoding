import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { toast } from "sonner";
import type {
  AgentReply,
  BlockDef,
  ChatLine,
  LevelDef,
  PartnerId,
  PartnerMood,
  PlacedBlock,
  SkillId,
  Work,
} from "@/lib/types";
import { blockById } from "@/lib/content/blocks";
import { partnerById } from "@/lib/content/partners";
import { useApp } from "@/lib/store";
import {
  PRESET_CATCHPHRASES,
  QUICK_ASKS,
  catchphraseOf,
  computeStars,
  equippedSkills,
  knowledgeIn,
  personaId,
  runAgent,
} from "@/lib/agent/engine";
import { askStarSpirit } from "@/lib/agent/ask";
import { PartnerPortrait, Fairy } from "@/components/PartnerPortrait";
import { PedIcon } from "@/components/PedIcons";
import { Button } from "@/components/ui/button";
import { uid, cn } from "@/lib/utils";
import { Sparkles, Trash2, HelpCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

function seedWork(level: LevelDef): Work {
  const blocks: PlacedBlock[] = [];
  for (const slot of level.slots) {
    if (slot.prefill) {
      blocks.push({ uid: uid("b"), defId: slot.prefill, slotId: slot.id, text: blockById(slot.prefill)?.text });
    }
  }
  return { blocks };
}

function packIds(level: LevelDef, partnerId: PartnerId): string[] {
  const ids = [...level.pack];
  const mine = `persona-${partnerId}`;
  if (!ids.includes(mine) && ids.some((x) => x.startsWith("persona-"))) {
    ids.unshift(mine);
  }
  if (level.id === "L4") {
    ids.push(`know-mem-birth-${partnerId}`, `know-mem-name-${partnerId}`, `know-mem-fav-${partnerId}`);
  }
  return Array.from(new Set(ids));
}

const COLOR: Record<BlockDef["color"], string> = {
  persona: "bg-persona shadow-[0_4px_0_var(--color-persona-deep)]",
  rag: "bg-rag shadow-[0_4px_0_var(--color-rag-deep)]",
  skill: "bg-skill shadow-[0_4px_0_var(--color-skill-deep)]",
  trigger: "bg-trigger shadow-[0_4px_0_var(--color-trigger-deep)]",
  script: "bg-script text-navy shadow-[0_4px_0_var(--color-script-deep)]",
  display: "bg-display shadow-[0_4px_0_var(--color-display-deep)]",
};

function BlockTile({
  def,
  text,
  compact,
  gold,
  dim,
  bounce,
  onPointerDown,
  onClick,
}: {
  def: BlockDef;
  text?: string;
  compact?: boolean;
  gold?: boolean;
  dim?: boolean;
  bounce?: boolean;
  onPointerDown?: (e: ReactPointerEvent) => void;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onPointerDown={onPointerDown}
      onClick={onClick}
      className={cn(
        "relative select-none rounded-2xl px-3 py-2 text-left text-foam",
        COLOR[def.color],
        compact ? "min-h-14 min-w-[5.5rem]" : "min-h-16 min-w-[7.5rem]",
        gold && "ring-2 ring-star",
        dim && "opacity-40",
        bounce && "bob",
        def.knowledge?.distractor && "grayscale",
      )}
    >
      <p className="text-[10px] uppercase tracking-wide opacity-80">{kindLabel(def.kind)}</p>
      <p className="text-sm font-semibold leading-tight">{def.label}</p>
      {(text || def.motto) && (
        <p className="mt-0.5 max-w-[9rem] truncate text-[11px] opacity-90">{text || def.motto}</p>
      )}
    </button>
  );
}

function kindLabel(kind: string) {
  if (kind === "trigger-tap" || kind === "trigger-voice") return "触发器";
  if (kind === "persona" || kind === "catchphrase") return "角色卡";
  if (kind === "opening") return "开场白";
  if (kind === "rag" || kind === "memory" || kind === "knowledge") return "百宝箱";
  if (kind === "skill") return "技能";
  if (kind.startsWith("display")) return "展示";
  if (kind === "script-if") return "剧本";
  return "积木";
}

type Drag = { defId: string; fromUid?: string; x: number; y: number };

export function LevelStudio({
  level,
  free,
}: {
  level: LevelDef;
  free?: boolean;
}) {
  const partnerId = useApp((s) => s.partnerId) ?? "cat";
  const lowGrade = useApp((s) => s.lowGrade);
  const stored = useApp((s) => s.works[level.id]);
  const setWorkStore = useApp((s) => s.setWork);
  const bump = useApp((s) => s.bump);
  const events = useApp((s) => s.events[level.id]);
  const hintsUsed = useApp((s) => s.hintsUsed[level.id] ?? 0);
  const useHint = useApp((s) => s.useHint);
  const awardStars = useApp((s) => s.awardStars);
  const stars = useApp((s) => s.stars[level.id] ?? 0);
  const quizPassed = useApp((s) => s.quizPassed[level.id] ?? false);
  const passQuiz = useApp((s) => s.passQuiz);
  const askedBefore = useApp((s) => s.askedBeforeFeed[level.id] ?? false);
  const markAsked = useApp((s) => s.markAsked);
  const voicePhrase = useApp((s) => s.voicePhrase[level.id] ?? "小星星");
  const setVoicePhrase = useApp((s) => s.setVoicePhrase);

  const [work, setWork] = useState<Work>(() => stored ?? seedWork(level));
  const [drag, setDrag] = useState<Drag | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [mood, setMood] = useState<PartnerMood>(level.id === "L1" ? "sleep" : "idle");
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [ask, setAsk] = useState("");
  const [busy, setBusy] = useState(false);
  const [badge, setBadge] = useState(false);
  const [raised, setRaised] = useState<SkillId | null>(null);
  const [fw, setFw] = useState(false);
  const [stickers, setStickers] = useState<{ kind: string; count: number } | null>(null);
  const [hintLv, setHintLv] = useState(0);
  const [hintText, setHintText] = useState<string | null>(null);
  const [quizOn, setQuizOn] = useState(false);
  const [win, setWin] = useState(false);
  const [finale, setFinale] = useState(false);
  const [undo, setUndo] = useState<Work | null>(null);
  const [revealScript, setRevealScript] = useState(false);
  const [jelly, setJelly] = useState<string | null>(null);
  const [awake, setAwake] = useState(level.id !== "L1");

  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const trashRef = useRef<HTMLButtonElement | null>(null);

  const pack = useMemo(() => {
    return packIds(level, partnerId)
      .map(blockById)
      .filter((b): b is BlockDef => Boolean(b))
      .filter((b) => (b.hidden ? revealScript : true));
  }, [level, partnerId, revealScript]);

  useEffect(() => {
    setWorkStore(free ? "free" : level.id, work);
  }, [work, level.id, free, setWorkStore]);

  const liveStars = computeStars({
    levelId: level.id,
    events: events ?? {},
    work,
    quiz: quizPassed,
    hintsUsed,
    partnerId,
  });

  const persistStars = useCallback(
    (n: number) => {
      if (n > stars) awardStars(level.id, n);
    },
    [awardStars, level.id, stars],
  );

  const place = (defId: string, slotId: string, fromUid?: string, text?: string) => {
    const def = blockById(defId);
    const slot = level.slots.find((s) => s.id === slotId);
    if (!def || !slot) return false;
    if (!slot.accepts.includes(def.kind)) return false;
    const cap = slot.id === "skills" && level.id === "L6" && lowGrade ? 4 : (slot.capacity ?? 1);
    setWork((w) => {
      let blocks = w.blocks.filter((b) => b.uid !== fromUid);
      const inSlot = blocks.filter((b) => b.slotId === slotId);
      if (inSlot.length >= cap) {
        const last = inSlot[inSlot.length - 1];
        blocks = blocks.filter((b) => b.uid !== last.uid);
      }
      const nb: PlacedBlock = { uid: fromUid ?? uid("b"), defId, slotId, text: text ?? def.text };
      return { blocks: [...blocks, nb] };
    });
    setJelly(slotId);
    setTimeout(() => setJelly(null), 420);
    if (def.kind === "persona") bump(level.id, "EVT_PERSONA_SWAP");
    if (def.kind === "knowledge") bump(level.id, "EVT_RAG_FEED");
    if (def.kind === "skill") bump(level.id, "EVT_TOOL_EQUIP");
    if (def.kind === "persona" && !awake) {
      setAwake(true);
      setMood("happy");
    }
    return true;
  };

  const hitSlot = (x: number, y: number) => {
    let best: { id: string; d: number } | null = null;
    for (const slot of level.slots) {
      const el = slotRefs.current[slot.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      const d = Math.hypot(x - cx, y - cy);
      if (inside || d < 48) {
        if (!best || d < best.d) best = { id: slot.id, d };
      }
    }
    return best?.id ?? null;
  };

  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d));
    const up = (e: PointerEvent) => {
      const trash = trashRef.current?.getBoundingClientRect();
      if (trash && e.clientX >= trash.left && e.clientX <= trash.right && e.clientY >= trash.top && e.clientY <= trash.bottom) {
        if (drag.fromUid) {
          setUndo(work);
          setWork((w) => ({ blocks: w.blocks.filter((b) => b.uid !== drag.fromUid) }));
          toast("积木被吃掉了，30 秒内可吐回");
          setTimeout(() => setUndo(null), 30000);
        }
        setDrag(null);
        setHover(null);
        return;
      }
      const slotId = hitSlot(e.clientX, e.clientY);
      if (slotId) {
        const ok = place(drag.defId, slotId, drag.fromUid);
        if (!ok) {
          setMood("confused");
          toast("这格不吃这种积木");
        }
      }
      setDrag(null);
      setHover(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag]);

  useEffect(() => {
    if (!drag) return;
    setHover(hitSlot(drag.x, drag.y));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag?.x, drag?.y]);

  const startDrag = (defId: string, e: ReactPointerEvent, fromUid?: string) => {
    e.preventDefault();
    setDrag({ defId, fromUid, x: e.clientX, y: e.clientY });
    setPicked(null);
  };

  const onSlotClick = (slotId: string) => {
    if (!picked) return;
    const ok = place(picked, slotId);
    if (!ok) toast("这格不吃这种积木");
    setPicked(null);
  };

  const applyReply = (reply: AgentReply, question: string) => {
    setMood(reply.mood);
    setBadge(reply.ragHit);
    setRaised(reply.raisedSkill ?? null);
    setFw(Boolean(reply.firework));
    setStickers(reply.stickers ?? null);
    setLines((ls) => [
      ...ls,
      { id: uid("q"), from: "kid", text: question },
      {
        id: uid("a"),
        from: "agent",
        text: reply.text,
        badge: reply.firework ? "firework" : reply.ragHit ? "rag" : reply.tool ? "tool" : undefined,
        tool: reply.tool,
        mood: reply.mood,
        stickers: reply.stickers,
        math: reply.math,
        raisedSkill: reply.raisedSkill,
      },
    ]);
    if (reply.ragHit) bump(level.id, "EVT_BADGE_RAG_HIT");
    if (reply.ragSpecific) bump(level.id, "EVT_RAG_HIT_SPECIFIC");
    if (reply.tool && reply.toolOk) {
      bump(level.id, "EVT_TOOL_AUTO_PICK");
      bump(level.id, "EVT_TOOL_EXEC");
    }
    if (reply.firework) bump(level.id, "EVT_SHOW_FIREWORK");
    if (reply.mood === "happy" || reply.mood === "talk" || reply.mood === "proud") {
      if (!awake) setAwake(true);
    }
  };

  const talk = async (question: string, via: "tap" | "voice" | "ask") => {
    if (busy) return;
    const q = question.trim();
    if (!q) return;
    setBusy(true);
    bump(level.id, "EVT_ASK");
    bump(level.id, "EVT_RUN");
    if (via === "tap") bump(level.id, "EVT_TRIGGER_TAP");
    if (via === "voice") bump(level.id, "EVT_TRIGGER_VOICE");
    if (level.id === "L3" && !askedBefore) markAsked(level.id);

    const reply = runAgent({
      question: q,
      work,
      partnerId,
      level,
      askedBeforeFeed: askedBefore,
      voicePhrase,
      via,
    });
    applyReply(reply, q);

    const generic = reply.mood === "idle" && !reply.ragHit && !reply.tool;
    if ((free || level.id === "L8") && generic) {
      const p = partnerById(personaId(work, partnerId));
      const grok = await askStarSpirit({
        data: {
          question: q,
          personaName: p.name,
          personaTitle: p.title,
          catchphrase: catchphraseOf(work, p.id),
          personality: p.personality,
          knowledge: knowledgeIn(work).map((k) => ({ title: k.title, body: k.body })),
          skills: equippedSkills(work),
          partnerId: p.id,
        },
      });
      if (grok.ok) {
        setLines((ls) => {
          const copy = [...ls];
          const last = copy[copy.length - 1];
          if (last?.from === "agent") last.text = grok.text;
          return copy;
        });
      }
    }

    const next = computeStars({
      levelId: level.id,
      events: useApp.getState().events[level.id] ?? {},
      work,
      quiz: quizPassed,
      hintsUsed,
      partnerId,
    });
    if (!free) persistStars(next);
    setBusy(false);
    if (!free && next >= 1 && stars === 0) setWin(true);
    if (!free && level.id === "L8" && next >= 1) setFinale(true);
    setTimeout(() => {
      setRaised(null);
      setFw(false);
    }, 2800);
  };

  const doHint = () => {
    if (hintsUsed >= 3) {
      const gap = level.slots.find((s) => s.gap && !work.blocks.some((b) => b.slotId === s.id));
      if (gap) {
        const cand = pack.find((b) => gap.accepts.includes(b.kind));
        if (cand) place(cand.id, gap.id);
      }
      toast("伙伴帮你放好了一块。这关最多两颗星。");
      setHintLv(3);
      return;
    }
    const n = useHint(level.id);
    setHintLv(n);
    const gap = level.slots.find((s) => s.gap && !work.blocks.some((b) => b.slotId === s.id)) ?? level.slots.find((s) => s.gap);
    if (n === 1) setHintText("看看积木区哦");
    if (n === 2) setHintText("试试这张卡");
    if (n === 3) setHintText(gap ? `把它拖进「${gap.label}」` : "把它拖进空槽");
  };

  const pid = personaId(work, partnerId);
  const p = partnerById(pid);
  const hasTap = work.blocks.some((b) => blockById(b.defId)?.kind === "trigger-tap");
  const hasVoice = work.blocks.some((b) => blockById(b.defId)?.kind === "trigger-voice");
  const asks = QUICK_ASKS[free ? "free" : level.id] ?? QUICK_ASKS.free;
  const bounceId =
    hintLv >= 2
      ? pack.find((b) => {
          const gap = level.slots.find((s) => s.gap && !work.blocks.some((x) => x.slotId === s.id));
          return gap && gap.accepts.includes(b.kind);
        })?.id
      : undefined;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-cream text-ink">
      <div className="flex flex-wrap items-center gap-2 border-b border-cream-3 bg-foam px-3 py-2 md:px-5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-coral">
            {level.id} · {level.concept}
          </p>
          <p className="truncate text-sm font-semibold">{level.mission}</p>
        </div>
        <Stars n={Math.max(stars, liveStars)} />
        <button
          type="button"
          onClick={doHint}
          className="inline-flex h-11 items-center gap-1 rounded-full bg-star/20 px-3 text-sm font-semibold text-navy"
        >
          <HelpCircle className="h-4 w-4" />
          闪闪帮忙 {hintsUsed}/3
        </button>
      </div>

      {level.checklist && (
        <ol className="flex flex-wrap gap-2 bg-cream-2 px-3 py-2 text-xs font-semibold md:px-5">
          {level.checklist.map((c, i) => (
            <li key={c} className="rounded-full bg-foam px-3 py-1 text-ink-soft">
              {i + 1}. {c}
            </li>
          ))}
        </ol>
      )}

      {hintText && (
        <div className="flex items-center gap-3 bg-navy px-4 py-2 text-sm text-cream">
          <Fairy className="h-10 w-10" />
          <p>{hintText}</p>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-auto lg:grid lg:grid-cols-3 lg:overflow-hidden">
        <div className="min-h-0 px-3 py-4 md:px-6 lg:col-span-2 lg:overflow-auto">
          <div className="mx-auto flex max-w-xl flex-col gap-3">
            {level.slots.map((slot, idx) => {
              const filled = work.blocks.filter((b) => b.slotId === slot.id);
              const isGap = Boolean(slot.gap) && filled.length === 0;
              const pulse = isGap && (slot.shadow !== "none" || hintLv >= 3);
              return (
                <div key={slot.id} className="flex items-stretch gap-3">
                  <span className="mt-4 w-6 text-center text-sm font-semibold text-fog">{idx + 1}</span>
                  <div
                    ref={(el) => {
                      slotRefs.current[slot.id] = el;
                    }}
                    onClick={() => onSlotClick(slot.id)}
                    className={cn(
                      "flex min-h-[5.5rem] flex-1 flex-wrap items-center gap-2 rounded-[22px] border-2 border-dashed px-3 py-2",
                      hover === slot.id ? "border-coral bg-coral/10" : "border-cream-3 bg-foam",
                      pulse && "gap-pulse",
                      jelly === slot.id && "jelly",
                    )}
                  >
                    <div className="w-full">
                      <p className="text-[11px] font-semibold text-ink-soft">{slot.label}</p>
                      {slot.shadow !== "none" && filled.length === 0 && (
                        <p className="text-xs text-fog">{slot.hint}</p>
                      )}
                    </div>
                    {filled.length === 0 && slot.shadow === "full" && slot.prefill && (
                      <div className="opacity-30">
                        {(() => {
                          const d = blockById(slot.prefill);
                          return d ? <BlockTile def={d} compact /> : null;
                        })()}
                      </div>
                    )}
                    {filled.length === 0 && slot.shadow === "outline" && (
                      <div className="flex h-12 w-24 items-center justify-center rounded-xl border border-dashed border-fog text-[11px] text-fog">
                        {kindLabel(slot.accepts[0])}
                      </div>
                    )}
                    {filled.map((b) => {
                      const d = blockById(b.defId);
                      if (!d) return null;
                      const locked = level.slots.find((s) => s.id === b.slotId)?.locked;
                      return (
                        <BlockTile
                          key={b.uid}
                          def={d}
                          text={b.text}
                          compact
                          gold={d.knowledge?.specific}
                          onPointerDown={locked ? undefined : (e) => startDrag(b.defId, e, b.uid)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="flex min-h-[300px] flex-col overflow-hidden border-t border-cream-3 bg-navy text-cream lg:col-span-1 lg:min-h-0 lg:overflow-auto lg:border-l lg:border-t-0">
          <div className="relative flex shrink-0 flex-col items-center px-4 pt-4">
            {fw && <Fireworks />}
            <button
              type="button"
              disabled={!hasTap || busy}
              onClick={() => talk(ask || asks[0] || "你是谁？", "tap")}
              className="relative"
            >
              <PartnerPortrait id={pid} mood={awake ? mood : "sleep"} size="md" className="lg:h-40 lg:w-40" />
              {hasTap && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-trigger px-2 py-0.5 text-[10px] font-bold">
                  点一点
                </span>
              )}
            </button>
            <p className="mt-3 text-sm font-semibold">
              {p.title}·{p.name}
            </p>
            {badge && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-rag px-3 py-1 text-xs font-bold jelly">
                <Sparkles className="h-3.5 w-3.5" /> 用了百宝箱
              </span>
            )}
            {raised && (
              <span className="mt-2 rounded-2xl bg-skill px-3 py-1.5 text-xs font-bold" style={{ animation: "raise-card 0.4s ease" }}>
                自己举起了「{skillName(raised)}」
              </span>
            )}
            {stickers && (
              <div className="mt-3 flex flex-wrap justify-center gap-1">
                {Array.from({ length: stickers.count }).map((_, i) => (
                  <span key={i} className="rounded-lg bg-cream px-2 py-1 text-xs font-semibold text-ink">
                    {stickers.kind}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-3 w-full min-h-0 flex-1 space-y-2 overflow-auto px-1 pb-2">
              {lines.slice(-6).map((l) => (
                <div
                  key={l.id}
                  className={cn(
                    "max-w-[90%] rounded-2xl px-3 py-2 text-sm",
                    l.from === "kid" ? "ml-auto bg-coral text-navy" : "bg-white/10",
                  )}
                >
                  {l.text}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2 border-t border-white/10 p-3">
            <div className="flex flex-wrap gap-1.5">
              {asks.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold"
                  onClick={() => talk(q, hasVoice && q === voicePhrase ? "voice" : "ask")}
                >
                  {q}
                </button>
              ))}
            </div>
            {hasVoice && (
              <div className="flex gap-1.5">
                {PRESET_CATCHPHRASES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setVoicePhrase(level.id, c.label);
                      talk(c.label, "voice");
                    }}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      voicePhrase === c.label ? "bg-mint text-navy" : "bg-white/10",
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                talk(ask, "ask");
                setAsk("");
              }}
            >
              <input
                value={ask}
                onChange={(e) => setAsk(e.target.value)}
                placeholder="对它说…"
                className="h-11 flex-1 rounded-full bg-white/10 px-4 text-sm outline-none placeholder:text-cream/40"
              />
              <Button type="submit" size="sm" disabled={busy}>
                问
              </Button>
            </form>
          </div>
        </aside>
      </div>

      <div className="border-t border-cream-3 bg-cream-2 px-3 py-3 md:px-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-ink-soft">积木托盘 · 拖进空槽，或先点积木再点空槽</p>
          <div className="flex items-center gap-2">
            {undo && (
              <button type="button" className="text-xs font-semibold text-coral" onClick={() => { setWork(undo); setUndo(null); }}>
                吐回来
              </button>
            )}
            {level.id === "L8" && !revealScript && (
              <button type="button" className="text-xs font-semibold text-ink-soft" onClick={() => setRevealScript(true)}>
                底层有一张？
              </button>
            )}
            <button
              ref={trashRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-ink/10 text-ink-soft"
              aria-label="垃圾桶"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className={cn("flex gap-2 overflow-x-auto pb-2 no-scrollbar", hintLv >= 1 && "ring-2 ring-star rounded-2xl p-2")}>
          {pack.map((def) => (
            <BlockTile
              key={def.id}
              def={def}
              gold={def.knowledge?.specific}
              bounce={bounceId === def.id}
              dim={Boolean(picked) && picked !== def.id}
              onPointerDown={(e) => startDrag(def.id, e)}
              onClick={() => setPicked((x) => (x === def.id ? null : def.id))}
            />
          ))}
        </div>
        {work.blocks.some((b) => blockById(b.defId)?.kind === "catchphrase") && (
          <CatchphraseEditor
            work={work}
            setWork={setWork}
            lowGrade={lowGrade}
          />
        )}
        {work.blocks.some((b) => blockById(b.defId)?.kind === "opening") && (
          <OpeningEditor work={work} setWork={setWork} />
        )}
        {work.blocks.some((b) => blockById(b.defId)?.kind === "trigger-voice") && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-ink-soft">暗号是</span>
            <input
              value={work.blocks.find((b) => blockById(b.defId)?.kind === "trigger-voice")?.text ?? voicePhrase}
              onChange={(e) => {
                const v = e.target.value.slice(0, 8);
                setVoicePhrase(level.id, v);
                setWork((w) => ({
                  blocks: w.blocks.map((b) =>
                    blockById(b.defId)?.kind === "trigger-voice" ? { ...b, text: v } : b,
                  ),
                }));
              }}
              className="h-10 w-32 rounded-full bg-foam px-3 text-sm outline-none ring-1 ring-cream-3"
            />
          </div>
        )}
      </div>

      {drag && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 opacity-90"
          style={{ left: drag.x, top: drag.y }}
        >
          {blockById(drag.defId) && <BlockTile def={blockById(drag.defId)!} compact />}
        </div>
      )}

      {win && (
        <Victory
          level={level}
          stars={Math.max(stars, liveStars)}
          onQuiz={() => {
            setWin(false);
            setQuizOn(true);
          }}
          onClose={() => setWin(false)}
        />
      )}
      {quizOn && (
        <Quiz
          level={level}
          onClose={() => setQuizOn(false)}
          onWin={() => {
            passQuiz(level.id, level.quiz.cardIds);
            persistStars(3);
            setQuizOn(false);
            setWin(true);
          }}
        />
      )}
      {finale && <Finale onClose={() => setFinale(false)} />}

      {!free && !win && liveStars >= 1 && (
        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-cream-3 bg-foam px-4 py-3">
          <p className="text-sm font-semibold">已经能通关啦。还可以继续玩，点亮更多星。</p>
          <div className="flex gap-2">
            {!quizPassed && (
              <Button tone="star" size="sm" onClick={() => setQuizOn(true)}>
                口诀测验
              </Button>
            )}
            <Button size="sm" onClick={() => setWin(true)}>
              收下星星
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-1" aria-label={`${n} 星`}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
            i <= n ? "bg-star text-navy" : "bg-cream-3 text-fog",
          )}
        >
          {i}
        </span>
      ))}
    </div>
  );
}

function skillName(id: SkillId) {
  return { draw: "画画", math: "算数", sing: "唱歌", joke: "讲笑话", answer: "举答案牌" }[id];
}

function CatchphraseEditor({
  work,
  setWork,
  lowGrade,
}: {
  work: Work;
  setWork: (fn: (w: Work) => Work) => void;
  lowGrade: boolean;
}) {
  const cur = work.blocks.find((b) => blockById(b.defId)?.kind === "catchphrase");
  if (!cur) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-ink-soft">口头禅</span>
      {PRESET_CATCHPHRASES.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() =>
            setWork((w) => ({
              blocks: w.blocks.map((b) => (b.uid === cur.uid ? { ...b, text: c.label } : b)),
            }))
          }
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold",
            cur.text === c.label ? "bg-persona text-foam" : "bg-foam",
          )}
        >
          {c.label}
        </button>
      ))}
      {!lowGrade && (
        <input
          value={cur.text ?? ""}
          maxLength={8}
          placeholder="自己写"
          onChange={(e) =>
            setWork((w) => ({
              blocks: w.blocks.map((b) => (b.uid === cur.uid ? { ...b, text: e.target.value } : b)),
            }))
          }
          className="h-9 w-28 rounded-full bg-foam px-3 text-xs outline-none ring-1 ring-cream-3"
        />
      )}
    </div>
  );
}

function OpeningEditor({
  work,
  setWork,
}: {
  work: Work;
  setWork: (fn: (w: Work) => Work) => void;
}) {
  const cur = work.blocks.find((b) => blockById(b.defId)?.kind === "opening");
  if (!cur) return null;
  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="text-xs font-semibold text-ink-soft">开场白</span>
      <input
        value={cur.text ?? "你是谁？"}
        maxLength={16}
        onChange={(e) =>
          setWork((w) => ({
            blocks: w.blocks.map((b) => (b.uid === cur.uid ? { ...b, text: e.target.value } : b)),
          }))
        }
        className="h-9 flex-1 rounded-full bg-foam px-3 text-xs outline-none ring-1 ring-cream-3"
      />
    </div>
  );
}

function Fireworks() {
  const bits = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map((i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/3 h-2 w-2 rounded-full bg-star"
          style={{
            transform: `rotate(${i * 20}deg) translateY(-40px)`,
            animation: "ribbon 1.2s ease-out both",
            animationDelay: `${(i % 6) * 40}ms`,
            background: ["#F5C15A", "#FF8A4C", "#3ECFB4", "#E56B9A"][i % 4],
          }}
        />
      ))}
    </div>
  );
}

function Victory({
  level,
  stars,
  onQuiz,
  onClose,
}: {
  level: LevelDef;
  stars: number;
  onQuiz: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-cream p-6 text-ink shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <p className="text-sm font-semibold text-coral">通关 · {level.name}</p>
        <div className="mt-4 flex justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                "inline-flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold",
                i <= stars ? "bg-star text-navy jelly" : "bg-cream-3 text-fog",
              )}
            >
              {i}
            </span>
          ))}
        </div>
        <p className="mt-4 text-center text-lg font-semibold">{level.wow}</p>
        <p className="mt-3 rounded-2xl bg-navy px-4 py-3 text-sm text-cream">{level.hook}</p>
        <div className="mt-5 flex flex-col gap-2">
          {stars < 3 && (
            <Button tone="star" onClick={onQuiz}>
              口诀测验点亮第三星
            </Button>
          )}
          <Link to="/map" className="block">
            <span className="pressable inline-flex h-12 w-full items-center justify-center rounded-full bg-coral text-base font-semibold text-navy shadow-[0_5px_0_var(--color-coral-deep)]">
              回星图
            </span>
          </Link>
          <Button tone="ghost" className="text-ink" onClick={onClose}>
            再玩一会儿
          </Button>
        </div>
      </div>
    </div>
  );
}

function Quiz({
  level,
  onClose,
  onWin,
}: {
  level: LevelDef;
  onClose: () => void;
  onWin: () => void;
}) {
  const [wrong, setWrong] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4">
      <div className="w-full max-w-md rounded-[28px] bg-cream p-6 text-ink">
        <p className="text-sm font-semibold text-coral">口诀测验 · 零文字依赖</p>
        <p className="mt-2 text-xl font-semibold">{level.quiz.question}</p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {level.quiz.options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                if (o.correct) onWin();
                else {
                  setWrong(o.id);
                  toast("再看看口诀");
                }
              }}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl bg-foam p-3 ring-2 ring-transparent",
                wrong === o.id && "wiggle ring-display",
              )}
            >
              <PedIcon name={o.icon} />
              <span className="text-xs font-semibold">{o.label}</span>
            </button>
          ))}
        </div>
        <Button tone="ghost" className="mt-4 w-full text-ink" onClick={onClose}>
          关闭
        </Button>
      </div>
    </div>
  );
}

function Finale({ onClose }: { onClose: () => void }) {
  const ids = ["cat", "dog", "rabbit", "parrot", "turtle", "owl"] as const;
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-navy p-6 text-cream">
      <div className="mx-auto max-w-2xl pt-6 text-center">
        <p className="text-star">星核拼合</p>
        <h2 className="mt-2 text-3xl font-semibold">舱门，开了</h2>
        <img src="/scenes/hero.jpg" alt="" className="mx-auto mt-6 w-full rounded-[28px] object-cover" />
        <p className="mt-6 text-lg">里面还有一个笼子。名牌上写着：第二个伙伴。</p>
        <p className="mt-2 text-cream/70">灰雾，原来也是星灵。</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {ids.map((id) => (
            <PartnerPortrait key={id} id={id} mood="look" size="sm" />
          ))}
        </div>
        <Button className="mt-8" onClick={onClose}>
          我们下学期再见
        </Button>
      </div>
    </div>
  );
}
