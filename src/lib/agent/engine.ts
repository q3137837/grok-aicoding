import type { AgentReply, PartnerId, PlacedBlock, SkillId, Work } from "@/lib/types";
import { blockById } from "@/lib/content/blocks";
import { partnerById } from "@/lib/content/partners";
import type { LevelDef } from "@/lib/types";

export function placedOf(work: Work, slotId?: string) {
  return work.blocks.filter((b) => (slotId ? b.slotId === slotId : true));
}

export function defOf(b: PlacedBlock) {
  return blockById(b.defId);
}

export function equippedSkills(work: Work): SkillId[] {
  return work.blocks
    .map(defOf)
    .filter((d) => d?.kind === "skill" && d.skill)
    .map((d) => d!.skill!);
}

export function knowledgeIn(work: Work) {
  return work.blocks
    .map(defOf)
    .filter((d) => d?.kind === "knowledge" && d.knowledge)
    .map((d) => d!.knowledge!);
}

export function personaId(work: Work, fallback: PartnerId): PartnerId {
  const p = work.blocks.map(defOf).find((d) => d?.kind === "persona" && d.partnerId);
  return p?.partnerId ?? fallback;
}

export function catchphraseOf(work: Work, partnerId: PartnerId) {
  const b = work.blocks.find((x) => defOf(x)?.kind === "catchphrase");
  if (b?.text) return b.text;
  return partnerById(personaId(work, partnerId)).catchphrase;
}

function hasKind(work: Work, kind: string) {
  return work.blocks.some((b) => defOf(b)?.kind === kind);
}

function pickTool(text: string, skills: SkillId[]): SkillId | undefined {
  const t = text.replace(/\s/g, "");
  if ((/画|小猫|云朵|涂鸦/.test(t) || /🐱/.test(text)) && skills.includes("draw")) return "draw";
  if ((/[0-9０-９].*[+\-×x÷+−＋].*[0-9０-９]|等于|加|减|乘|除/.test(t)) && skills.includes("math"))
    return "math";
  if (/唱|歌/.test(t) && skills.includes("sing")) return "sing";
  if (/笑话|好笑|讲个/.test(t) && skills.includes("joke")) return "joke";
  if (/几点|节目|菜单|合唱|答案/.test(t) && skills.includes("answer")) return "answer";
  return undefined;
}

function parseDraw(text: string): { kind: string; count: number } | null {
  const m = text.replace(/\s/g, "").match(/画?([0-9一二三四五六七八九十]+)?(只|朵|个|片)?(小猫|猫|云|星星|月亮|花|苹果)?/);
  if (!m) return null;
  const numMap: Record<string, number> = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
  let count = 1;
  if (m[1]) count = numMap[m[1]] ?? (parseInt(m[1], 10) || 1);
  const kind = m[3] || "星星";
  return { kind, count: Math.min(8, count) };
}

function parseMath(text: string): string | null {
  const t = text.replace(/[＝=等于？?]/g, "=").replace(/×|x|X/g, "*").replace(/÷/g, "/").replace(/＋/g, "+").replace(/−|－/g, "-");
  const m = t.match(/(-?\d+)\s*([+\-*/])\s*(-?\d+)/);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[3]);
  const op = m[2];
  let n = 0;
  if (op === "+") n = a + b;
  else if (op === "-") n = a - b;
  else if (op === "*") n = a * b;
  else if (op === "/") n = b === 0 ? NaN : a / b;
  if (!Number.isFinite(n)) return null;
  return `${a} ${op === "*" ? "×" : op === "/" ? "÷" : op} ${b} = ${n}`;
}

function matchKnowledge(q: string, work: Work) {
  const cards = knowledgeIn(work);
  const scored = cards
    .map((c) => ({
      c,
      n: c.keywords.reduce((acc, k) => acc + (q.includes(k) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.n - a.n);
  if (!scored[0] || scored[0].n <= 0) {
    if (cards.length && /你是谁|你叫|名字|最爱|在哪|歌|特产|几点|菜单|节目/.test(q)) {
      return scored.find((s) => s.c.specific) ?? scored[0] ?? null;
    }
    return null;
  }
  return scored[0];
}

export function runAgent(opts: {
  question: string;
  work: Work;
  partnerId: PartnerId;
  level: LevelDef;
  askedBeforeFeed: boolean;
  voicePhrase?: string;
  via: "tap" | "voice" | "ask";
}): AgentReply {
  const { question, work, level, via } = opts;
  const p = partnerById(personaId(work, opts.partnerId));
  const cp = catchphraseOf(work, p.id);
  const skills = equippedSkills(work);
  const q = question.trim() || "你是谁？";
  const hasRag = hasKind(work, "rag") || hasKind(work, "memory");
  const cards = knowledgeIn(work);
  const fed = hasRag && cards.length > 0;

  if (via === "voice") {
    const phrase = (opts.voicePhrase || "小星星").trim();
    const voiceBlock = work.blocks.find((b) => defOf(b)?.kind === "trigger-voice");
    const expect = (voiceBlock?.text || phrase).trim();
    if (q !== expect && !q.includes(expect)) {
      return {
        text: `${cp} 这不是我的暗号哦。`,
        mood: "idle",
        ragHit: false,
        ragSpecific: false,
      };
    }
  }

  if (level.id === "L3" && /在哪|位置|歌|特产|回声岛/.test(q) && !fed) {
    return {
      text: `${cp} 呃……不知道。`,
      mood: "confused",
      ragHit: false,
      ragSpecific: false,
    };
  }

  const tool = pickTool(q, skills);

  if (tool === "draw") {
    const d = parseDraw(q) ?? { kind: "小猫", count: 3 };
    return {
      text: `${cp} 我自己选了画画。给你 ${d.count} ${d.kind}。`,
      mood: "hold-card",
      ragHit: false,
      ragSpecific: false,
      tool,
      toolOk: true,
      stickers: d,
      raisedSkill: "draw",
    };
  }
  if (tool === "math") {
    const math = parseMath(q);
    if (!math) {
      return {
        text: `${cp} 你想让我算什么呀？`,
        mood: "confused",
        ragHit: false,
        ragSpecific: false,
      };
    }
    return {
      text: `${cp} 我举起算数牌。${math}`,
      mood: "hold-card",
      ragHit: false,
      ragSpecific: false,
      tool,
      toolOk: true,
      math,
      raisedSkill: "math",
    };
  }
  if (tool === "sing") {
    return {
      text: `${cp} 星光亮晶晶，伙伴在想你～`,
      mood: "happy",
      ragHit: false,
      ragSpecific: false,
      tool,
      toolOk: true,
      raisedSkill: "sing",
    };
  }
  if (tool === "joke") {
    return {
      text: `${cp} 星星为什么不去上学？因为它已经在银河系啦。`,
      mood: "happy",
      ragHit: false,
      ragSpecific: false,
      tool,
      toolOk: true,
      raisedSkill: "joke",
    };
  }

  const hit = matchKnowledge(q, work);
  if (hit && fed) {
    const specific = Boolean(hit.c.specific) && !hit.c.distractor;
    const firework = hasKind(work, "display-firework") && (level.id === "L7" || level.id === "L8");
    const raise = skills.includes("answer") && (level.id === "L7" || level.id === "L8");
    if (hit.c.distractor) {
      return {
        text: p.confused,
        mood: "confused",
        ragHit: false,
        ragSpecific: false,
      };
    }
    return {
      text: raise ? `${cp} ${hit.c.body}` : `${cp} ${hit.c.body}`,
      mood: specific ? "proud" : "hold-box",
      ragHit: true,
      ragSpecific: specific,
      tool: raise ? "answer" : undefined,
      toolOk: raise,
      raisedSkill: raise ? "answer" : undefined,
      firework,
    };
  }

  if (/你是谁|你叫|名字/.test(q)) {
    const specific = cards.some((c) => c.specific && c.partnerId === p.id);
    if (level.id === "L4") {
      if (!specific) {
        return {
          text: p.confused,
          mood: "confused",
          ragHit: false,
          ragSpecific: false,
        };
      }
      return {
        text: p.remember,
        mood: "proud",
        ragHit: true,
        ragSpecific: true,
      };
    }
    return {
      text: p.wake,
      mood: "talk",
      ragHit: false,
      ragSpecific: false,
    };
  }

  if (level.id === "L1" || level.id === "L2") {
    const opening = work.blocks.find((b) => defOf(b)?.kind === "opening")?.text;
    return {
      text: `${cp} ${opening || p.opening} 我是${p.title}${p.name}。`,
      mood: "talk",
      ragHit: false,
      ragSpecific: false,
    };
  }

  if (!fed && /在哪|歌|特产|几点|菜单|节目|你叫|名字/.test(q)) {
    return {
      text: `${cp} 呃……不知道。`,
      mood: "yawn",
      ragHit: false,
      ragSpecific: false,
    };
  }

  if (tool === "answer" && !hit) {
    return {
      text: `${cp} 箱子里没有这题的答案。先喂我？`,
      mood: "confused",
      ragHit: false,
      ragSpecific: false,
    };
  }

  return {
    text: `${cp} ${p.opening} 我在听。`,
    mood: "idle",
    ragHit: false,
    ragSpecific: false,
  };
}

export function computeStars(opts: {
  levelId: string;
  events: Record<string, number>;
  work: Work;
  quiz: boolean;
  hintsUsed: number;
  partnerId: PartnerId;
}): number {
  const { levelId, events, work, quiz, hintsUsed } = opts;
  const e = (k: string) => events[k] ?? 0;
  let star = 0;

  if (levelId === "L1") {
    if (e("EVT_PERSONA_SWAP") >= 1 && e("EVT_TRIGGER_TAP") >= 1) star = 1;
    if (e("EVT_PERSONA_SWAP") >= 2 && e("EVT_TRIGGER_TAP") >= 2) star = 2;
  } else if (levelId === "L2") {
    if (e("EVT_TRIGGER_TAP") >= 3) star = 1;
    if (e("EVT_TRIGGER_TAP") >= 3 && work.blocks.some((b) => defOf(b)?.kind === "catchphrase" && (b.text || "").length > 0))
      star = 2;
  } else if (levelId === "L3") {
    if (hasKind(work, "rag") && e("EVT_ASK") >= 1) star = 1;
    if (e("EVT_BADGE_RAG_HIT") >= 3) star = 2;
  } else if (levelId === "L4") {
    if (e("EVT_RAG_HIT_SPECIFIC") >= 1) star = 1;
    if (e("EVT_RAG_HIT_SPECIFIC") >= 3) star = 2;
  } else if (levelId === "L5") {
    if (equippedSkills(work).length >= 2 && (e("EVT_TOOL_EXEC") >= 1 || e("EVT_TOOL_AUTO_PICK") >= 1)) star = 1;
    if (e("EVT_TOOL_AUTO_PICK") >= 3) star = 2;
  } else if (levelId === "L6") {
    if (e("EVT_TRIGGER_VOICE") >= 1 && e("EVT_TOOL_EXEC") >= 1) star = 1;
    if (e("EVT_TRIGGER_VOICE") >= 2 && e("EVT_TOOL_AUTO_PICK") >= 2) star = 2;
  } else if (levelId === "L7") {
    if (e("EVT_BADGE_RAG_HIT") >= 1 && e("EVT_TOOL_EXEC") >= 1 && e("EVT_SHOW_FIREWORK") >= 1) star = 1;
    if (e("EVT_BADGE_RAG_HIT") >= 3 && e("EVT_SHOW_FIREWORK") >= 1) star = 2;
  } else if (levelId === "L8") {
    const ok =
      hasKind(work, "persona") &&
      (hasKind(work, "rag") || hasKind(work, "memory")) &&
      knowledgeIn(work).length >= 2 &&
      equippedSkills(work).length >= 2 &&
      (hasKind(work, "trigger-tap") || hasKind(work, "trigger-voice")) &&
      e("EVT_RUN") >= 1;
    if (ok) star = 1;
    if (ok && e("EVT_ASK") >= 3) star = 2;
  }

  if (quiz && star >= 1) star = 3;
  if (hintsUsed >= 3 && star > 2) star = 2;
  return star;
}

export function workMeets(level: LevelDef, work: Work): boolean {
  if (level.id === "L8") {
    return (
      hasKind(work, "persona") &&
      (hasKind(work, "rag") || hasKind(work, "memory")) &&
      knowledgeIn(work).length >= 2 &&
      equippedSkills(work).length >= 2 &&
      (hasKind(work, "trigger-tap") || hasKind(work, "trigger-voice"))
    );
  }
  const gaps = level.slots.filter((s) => s.gap);
  return gaps.every((s) => work.blocks.some((b) => b.slotId === s.id));
}

export const PRESET_CATCHPHRASES = [
  { id: "star", label: "小星星" },
  { id: "candy", label: "棒棒糖" },
  { id: "rocket", label: "小火箭" },
  { id: "moon", label: "月亮船" },
  { id: "song", label: "叮铃铃" },
  { id: "hug", label: "抱抱" },
];

export const QUICK_ASKS: Record<string, string[]> = {
  L1: ["你是谁？"],
  L2: ["你是谁？", "你好呀"],
  L3: ["回声岛在哪？", "岛的特产是什么？", "岛的歌怎么唱？"],
  L4: ["你叫什么？", "你最爱什么歌？", "你的名字有故事吗？"],
  L5: ["画 3 只小猫", "画 5 朵云", "3+4 等于几", "10-2 等于几"],
  L6: ["小星星", "画 3 只小猫", "2+2 等于几"],
  L7: ["烟花几点放？", "菜单上有什么？", "今晚有合唱吗？"],
  L8: ["你是谁？", "烟花几点放？", "画 3 只小猫"],
  free: ["你是谁？", "画 3 只小猫", "3+4 等于几", "讲个笑话"],
};
