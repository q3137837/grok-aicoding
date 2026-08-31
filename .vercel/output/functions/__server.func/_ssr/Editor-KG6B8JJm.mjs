import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as Trash2, o as Sparkles, p as CircleHelp } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useApp, d as partnerById, i as PartnerPortrait, l as blockById, o as cn, r as Fairy, s as uid } from "./router-BqNGgz6D.mjs";
import { t as Button } from "./button-CfhSUvMi.mjs";
import { t as PedIcon } from "./PedIcons-O0pIMFRf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Editor-KG6B8JJm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function defOf(b) {
	return blockById(b.defId);
}
function equippedSkills(work) {
	return work.blocks.map(defOf).filter((d) => d?.kind === "skill" && d.skill).map((d) => d.skill);
}
function knowledgeIn(work) {
	return work.blocks.map(defOf).filter((d) => d?.kind === "knowledge" && d.knowledge).map((d) => d.knowledge);
}
function personaId(work, fallback) {
	return work.blocks.map(defOf).find((d) => d?.kind === "persona" && d.partnerId)?.partnerId ?? fallback;
}
function catchphraseOf(work, partnerId) {
	const b = work.blocks.find((x) => defOf(x)?.kind === "catchphrase");
	if (b?.text) return b.text;
	return partnerById(personaId(work, partnerId)).catchphrase;
}
function hasKind(work, kind) {
	return work.blocks.some((b) => defOf(b)?.kind === kind);
}
function pickTool(text, skills) {
	const t = text.replace(/\s/g, "");
	if ((/画|小猫|云朵|涂鸦/.test(t) || /🐱/.test(text)) && skills.includes("draw")) return "draw";
	if (/[0-9０-９].*[+\-×x÷+−＋].*[0-9０-９]|等于|加|减|乘|除/.test(t) && skills.includes("math")) return "math";
	if (/唱|歌/.test(t) && skills.includes("sing")) return "sing";
	if (/笑话|好笑|讲个/.test(t) && skills.includes("joke")) return "joke";
	if (/几点|节目|菜单|合唱|答案/.test(t) && skills.includes("answer")) return "answer";
}
function parseDraw(text) {
	const m = text.replace(/\s/g, "").match(/画?([0-9一二三四五六七八九十]+)?(只|朵|个|片)?(小猫|猫|云|星星|月亮|花|苹果)?/);
	if (!m) return null;
	const numMap = {
		一: 1,
		二: 2,
		三: 3,
		四: 4,
		五: 5,
		六: 6,
		七: 7,
		八: 8,
		九: 9,
		十: 10
	};
	let count = 1;
	if (m[1]) count = numMap[m[1]] ?? (parseInt(m[1], 10) || 1);
	return {
		kind: m[3] || "星星",
		count: Math.min(8, count)
	};
}
function parseMath(text) {
	const m = text.replace(/[＝=等于？?]/g, "=").replace(/×|x|X/g, "*").replace(/÷/g, "/").replace(/＋/g, "+").replace(/−|－/g, "-").match(/(-?\d+)\s*([+\-*/])\s*(-?\d+)/);
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
function matchKnowledge(q, work) {
	const cards = knowledgeIn(work);
	const scored = cards.map((c) => ({
		c,
		n: c.keywords.reduce((acc, k) => acc + (q.includes(k) ? 1 : 0), 0)
	})).sort((a, b) => b.n - a.n);
	if (!scored[0] || scored[0].n <= 0) {
		if (cards.length && /你是谁|你叫|名字|最爱|在哪|歌|特产|几点|菜单|节目/.test(q)) return scored.find((s) => s.c.specific) ?? scored[0] ?? null;
		return null;
	}
	return scored[0];
}
function runAgent(opts) {
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
		const expect = (work.blocks.find((b) => defOf(b)?.kind === "trigger-voice")?.text || phrase).trim();
		if (q !== expect && !q.includes(expect)) return {
			text: `${cp} 这不是我的暗号哦。`,
			mood: "idle",
			ragHit: false,
			ragSpecific: false
		};
	}
	if (level.id === "L3" && /在哪|位置|歌|特产|回声岛/.test(q) && !fed) return {
		text: `${cp} 呃……不知道。`,
		mood: "confused",
		ragHit: false,
		ragSpecific: false
	};
	const tool = pickTool(q, skills);
	if (tool === "draw") {
		const d = parseDraw(q) ?? {
			kind: "小猫",
			count: 3
		};
		return {
			text: `${cp} 我自己选了画画。给你 ${d.count} ${d.kind}。`,
			mood: "hold-card",
			ragHit: false,
			ragSpecific: false,
			tool,
			toolOk: true,
			stickers: d,
			raisedSkill: "draw"
		};
	}
	if (tool === "math") {
		const math = parseMath(q);
		if (!math) return {
			text: `${cp} 你想让我算什么呀？`,
			mood: "confused",
			ragHit: false,
			ragSpecific: false
		};
		return {
			text: `${cp} 我举起算数牌。${math}`,
			mood: "hold-card",
			ragHit: false,
			ragSpecific: false,
			tool,
			toolOk: true,
			math,
			raisedSkill: "math"
		};
	}
	if (tool === "sing") return {
		text: `${cp} 星光亮晶晶，伙伴在想你～`,
		mood: "happy",
		ragHit: false,
		ragSpecific: false,
		tool,
		toolOk: true,
		raisedSkill: "sing"
	};
	if (tool === "joke") return {
		text: `${cp} 星星为什么不去上学？因为它已经在银河系啦。`,
		mood: "happy",
		ragHit: false,
		ragSpecific: false,
		tool,
		toolOk: true,
		raisedSkill: "joke"
	};
	const hit = matchKnowledge(q, work);
	if (hit && fed) {
		const specific = Boolean(hit.c.specific) && !hit.c.distractor;
		const firework = hasKind(work, "display-firework") && (level.id === "L7" || level.id === "L8");
		const raise = skills.includes("answer") && (level.id === "L7" || level.id === "L8");
		if (hit.c.distractor) return {
			text: p.confused,
			mood: "confused",
			ragHit: false,
			ragSpecific: false
		};
		return {
			text: raise ? `${cp} ${hit.c.body}` : `${cp} ${hit.c.body}`,
			mood: specific ? "proud" : "hold-box",
			ragHit: true,
			ragSpecific: specific,
			tool: raise ? "answer" : void 0,
			toolOk: raise,
			raisedSkill: raise ? "answer" : void 0,
			firework
		};
	}
	if (/你是谁|你叫|名字/.test(q)) {
		const specific = cards.some((c) => c.specific && c.partnerId === p.id);
		if (level.id === "L4") {
			if (!specific) return {
				text: p.confused,
				mood: "confused",
				ragHit: false,
				ragSpecific: false
			};
			return {
				text: p.remember,
				mood: "proud",
				ragHit: true,
				ragSpecific: true
			};
		}
		return {
			text: p.wake,
			mood: "talk",
			ragHit: false,
			ragSpecific: false
		};
	}
	if (level.id === "L1" || level.id === "L2") return {
		text: `${cp} ${work.blocks.find((b) => defOf(b)?.kind === "opening")?.text || p.opening} 我是${p.title}${p.name}。`,
		mood: "talk",
		ragHit: false,
		ragSpecific: false
	};
	if (!fed && /在哪|歌|特产|几点|菜单|节目|你叫|名字/.test(q)) return {
		text: `${cp} 呃……不知道。`,
		mood: "yawn",
		ragHit: false,
		ragSpecific: false
	};
	if (tool === "answer" && !hit) return {
		text: `${cp} 箱子里没有这题的答案。先喂我？`,
		mood: "confused",
		ragHit: false,
		ragSpecific: false
	};
	return {
		text: `${cp} ${p.opening} 我在听。`,
		mood: "idle",
		ragHit: false,
		ragSpecific: false
	};
}
function computeStars(opts) {
	const { levelId, events, work, quiz, hintsUsed } = opts;
	const e = (k) => events[k] ?? 0;
	let star = 0;
	if (levelId === "L1") {
		if (e("EVT_PERSONA_SWAP") >= 1 && e("EVT_TRIGGER_TAP") >= 1) star = 1;
		if (e("EVT_PERSONA_SWAP") >= 2 && e("EVT_TRIGGER_TAP") >= 2) star = 2;
	} else if (levelId === "L2") {
		if (e("EVT_TRIGGER_TAP") >= 3) star = 1;
		if (e("EVT_TRIGGER_TAP") >= 3 && work.blocks.some((b) => defOf(b)?.kind === "catchphrase" && (b.text || "").length > 0)) star = 2;
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
		const ok = hasKind(work, "persona") && (hasKind(work, "rag") || hasKind(work, "memory")) && knowledgeIn(work).length >= 2 && equippedSkills(work).length >= 2 && (hasKind(work, "trigger-tap") || hasKind(work, "trigger-voice")) && e("EVT_RUN") >= 1;
		if (ok) star = 1;
		if (ok && e("EVT_ASK") >= 3) star = 2;
	}
	if (quiz && star >= 1) star = 3;
	if (hintsUsed >= 3 && star > 2) star = 2;
	return star;
}
var PRESET_CATCHPHRASES = [
	{
		id: "star",
		label: "小星星"
	},
	{
		id: "candy",
		label: "棒棒糖"
	},
	{
		id: "rocket",
		label: "小火箭"
	},
	{
		id: "moon",
		label: "月亮船"
	},
	{
		id: "song",
		label: "叮铃铃"
	},
	{
		id: "hug",
		label: "抱抱"
	}
];
var QUICK_ASKS = {
	L1: ["你是谁？"],
	L2: ["你是谁？", "你好呀"],
	L3: [
		"回声岛在哪？",
		"岛的特产是什么？",
		"岛的歌怎么唱？"
	],
	L4: [
		"你叫什么？",
		"你最爱什么歌？",
		"你的名字有故事吗？"
	],
	L5: [
		"画 3 只小猫",
		"画 5 朵云",
		"3+4 等于几",
		"10-2 等于几"
	],
	L6: [
		"小星星",
		"画 3 只小猫",
		"2+2 等于几"
	],
	L7: [
		"烟花几点放？",
		"菜单上有什么？",
		"今晚有合唱吗？"
	],
	L8: [
		"你是谁？",
		"烟花几点放？",
		"画 3 只小猫"
	],
	free: [
		"你是谁？",
		"画 3 只小猫",
		"3+4 等于几",
		"讲个笑话"
	]
};
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var askStarSpirit = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("40d98133b4c81b1a8a4ab1bed13d22449354d789f6ee3e02aea0a840b37de03e"));
function seedWork(level) {
	const blocks = [];
	for (const slot of level.slots) if (slot.prefill) blocks.push({
		uid: uid("b"),
		defId: slot.prefill,
		slotId: slot.id,
		text: blockById(slot.prefill)?.text
	});
	return { blocks };
}
function packIds(level, partnerId) {
	const ids = [...level.pack];
	const mine = `persona-${partnerId}`;
	if (!ids.includes(mine) && ids.some((x) => x.startsWith("persona-"))) ids.unshift(mine);
	if (level.id === "L4") ids.push(`know-mem-birth-${partnerId}`, `know-mem-name-${partnerId}`, `know-mem-fav-${partnerId}`);
	return Array.from(new Set(ids));
}
var COLOR = {
	persona: "bg-persona shadow-[0_4px_0_var(--color-persona-deep)]",
	rag: "bg-rag shadow-[0_4px_0_var(--color-rag-deep)]",
	skill: "bg-skill shadow-[0_4px_0_var(--color-skill-deep)]",
	trigger: "bg-trigger shadow-[0_4px_0_var(--color-trigger-deep)]",
	script: "bg-script text-navy shadow-[0_4px_0_var(--color-script-deep)]",
	display: "bg-display shadow-[0_4px_0_var(--color-display-deep)]"
};
function BlockTile({ def, text, compact, gold, dim, bounce, onPointerDown, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onPointerDown,
		onClick,
		className: cn("relative select-none rounded-2xl px-3 py-2 text-left text-foam", COLOR[def.color], compact ? "min-h-14 min-w-[5.5rem]" : "min-h-16 min-w-[7.5rem]", gold && "ring-2 ring-star", dim && "opacity-40", bounce && "bob", def.knowledge?.distractor && "grayscale"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] uppercase tracking-wide opacity-80",
				children: kindLabel(def.kind)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold leading-tight",
				children: def.label
			}),
			(text || def.motto) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 max-w-[9rem] truncate text-[11px] opacity-90",
				children: text || def.motto
			})
		]
	});
}
function kindLabel(kind) {
	if (kind === "trigger-tap" || kind === "trigger-voice") return "触发器";
	if (kind === "persona" || kind === "catchphrase") return "角色卡";
	if (kind === "opening") return "开场白";
	if (kind === "rag" || kind === "memory" || kind === "knowledge") return "百宝箱";
	if (kind === "skill") return "技能";
	if (kind.startsWith("display")) return "展示";
	if (kind === "script-if") return "剧本";
	return "积木";
}
function LevelStudio({ level, free }) {
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
	const [work, setWork] = (0, import_react.useState)(() => stored ?? seedWork(level));
	const [drag, setDrag] = (0, import_react.useState)(null);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [hover, setHover] = (0, import_react.useState)(null);
	const [mood, setMood] = (0, import_react.useState)(level.id === "L1" ? "sleep" : "idle");
	const [lines, setLines] = (0, import_react.useState)([]);
	const [ask, setAsk] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [badge, setBadge] = (0, import_react.useState)(false);
	const [raised, setRaised] = (0, import_react.useState)(null);
	const [fw, setFw] = (0, import_react.useState)(false);
	const [stickers, setStickers] = (0, import_react.useState)(null);
	const [hintLv, setHintLv] = (0, import_react.useState)(0);
	const [hintText, setHintText] = (0, import_react.useState)(null);
	const [quizOn, setQuizOn] = (0, import_react.useState)(false);
	const [win, setWin] = (0, import_react.useState)(false);
	const [finale, setFinale] = (0, import_react.useState)(false);
	const [undo, setUndo] = (0, import_react.useState)(null);
	const [revealScript, setRevealScript] = (0, import_react.useState)(false);
	const [jelly, setJelly] = (0, import_react.useState)(null);
	const [awake, setAwake] = (0, import_react.useState)(level.id !== "L1");
	const slotRefs = (0, import_react.useRef)({});
	const trashRef = (0, import_react.useRef)(null);
	const pack = (0, import_react.useMemo)(() => {
		return packIds(level, partnerId).map(blockById).filter((b) => Boolean(b)).filter((b) => b.hidden ? revealScript : true);
	}, [
		level,
		partnerId,
		revealScript
	]);
	(0, import_react.useEffect)(() => {
		setWorkStore(free ? "free" : level.id, work);
	}, [
		work,
		level.id,
		free,
		setWorkStore
	]);
	const liveStars = computeStars({
		levelId: level.id,
		events: events ?? {},
		work,
		quiz: quizPassed,
		hintsUsed,
		partnerId
	});
	const persistStars = (0, import_react.useCallback)((n) => {
		if (n > stars) awardStars(level.id, n);
	}, [
		awardStars,
		level.id,
		stars
	]);
	const place = (defId, slotId, fromUid, text) => {
		const def = blockById(defId);
		const slot = level.slots.find((s) => s.id === slotId);
		if (!def || !slot) return false;
		if (!slot.accepts.includes(def.kind)) return false;
		const cap = slot.id === "skills" && level.id === "L6" && lowGrade ? 4 : slot.capacity ?? 1;
		setWork((w) => {
			let blocks = w.blocks.filter((b) => b.uid !== fromUid);
			const inSlot = blocks.filter((b) => b.slotId === slotId);
			if (inSlot.length >= cap) {
				const last = inSlot[inSlot.length - 1];
				blocks = blocks.filter((b) => b.uid !== last.uid);
			}
			const nb = {
				uid: fromUid ?? uid("b"),
				defId,
				slotId,
				text: text ?? def.text
			};
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
	const hitSlot = (x, y) => {
		let best = null;
		for (const slot of level.slots) {
			const el = slotRefs.current[slot.id];
			if (!el) continue;
			const r = el.getBoundingClientRect();
			const cx = r.left + r.width / 2;
			const cy = r.top + r.height / 2;
			const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
			const d = Math.hypot(x - cx, y - cy);
			if (inside || d < 48) {
				if (!best || d < best.d) best = {
					id: slot.id,
					d
				};
			}
		}
		return best?.id ?? null;
	};
	(0, import_react.useEffect)(() => {
		if (!drag) return;
		const move = (e) => setDrag((d) => d ? {
			...d,
			x: e.clientX,
			y: e.clientY
		} : d);
		const up = (e) => {
			const trash = trashRef.current?.getBoundingClientRect();
			if (trash && e.clientX >= trash.left && e.clientX <= trash.right && e.clientY >= trash.top && e.clientY <= trash.bottom) {
				if (drag.fromUid) {
					setUndo(work);
					setWork((w) => ({ blocks: w.blocks.filter((b) => b.uid !== drag.fromUid) }));
					toast("积木被吃掉了，30 秒内可吐回");
					setTimeout(() => setUndo(null), 3e4);
				}
				setDrag(null);
				setHover(null);
				return;
			}
			const slotId = hitSlot(e.clientX, e.clientY);
			if (slotId) {
				if (!place(drag.defId, slotId, drag.fromUid)) {
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
	}, [drag]);
	(0, import_react.useEffect)(() => {
		if (!drag) return;
		setHover(hitSlot(drag.x, drag.y));
	}, [drag?.x, drag?.y]);
	const startDrag = (defId, e, fromUid) => {
		e.preventDefault();
		setDrag({
			defId,
			fromUid,
			x: e.clientX,
			y: e.clientY
		});
		setPicked(null);
	};
	const onSlotClick = (slotId) => {
		if (!picked) return;
		if (!place(picked, slotId)) toast("这格不吃这种积木");
		setPicked(null);
	};
	const applyReply = (reply, question) => {
		setMood(reply.mood);
		setBadge(reply.ragHit);
		setRaised(reply.raisedSkill ?? null);
		setFw(Boolean(reply.firework));
		setStickers(reply.stickers ?? null);
		setLines((ls) => [
			...ls,
			{
				id: uid("q"),
				from: "kid",
				text: question
			},
			{
				id: uid("a"),
				from: "agent",
				text: reply.text,
				badge: reply.firework ? "firework" : reply.ragHit ? "rag" : reply.tool ? "tool" : void 0,
				tool: reply.tool,
				mood: reply.mood,
				stickers: reply.stickers,
				math: reply.math,
				raisedSkill: reply.raisedSkill
			}
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
	const talk = async (question, via) => {
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
			via
		});
		applyReply(reply, q);
		const generic = reply.mood === "idle" && !reply.ragHit && !reply.tool;
		if ((free || level.id === "L8") && generic) {
			const p = partnerById(personaId(work, partnerId));
			const grok = await askStarSpirit({ data: {
				question: q,
				personaName: p.name,
				personaTitle: p.title,
				catchphrase: catchphraseOf(work, p.id),
				personality: p.personality,
				knowledge: knowledgeIn(work).map((k) => ({
					title: k.title,
					body: k.body
				})),
				skills: equippedSkills(work),
				partnerId: p.id
			} });
			if (grok.ok) setLines((ls) => {
				const copy = [...ls];
				const last = copy[copy.length - 1];
				if (last?.from === "agent") last.text = grok.text;
				return copy;
			});
		}
		const next = computeStars({
			levelId: level.id,
			events: useApp.getState().events[level.id] ?? {},
			work,
			quiz: quizPassed,
			hintsUsed,
			partnerId
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
	const bounceId = hintLv >= 2 ? pack.find((b) => {
		const gap = level.slots.find((s) => s.gap && !work.blocks.some((x) => x.slotId === s.id));
		return gap && gap.accepts.includes(b.kind);
	})?.id : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col overflow-hidden bg-cream text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-cream-3 bg-foam px-3 py-2 md:px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-semibold text-coral",
							children: [
								level.id,
								" · ",
								level.concept
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-semibold",
							children: level.mission
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { n: Math.max(stars, liveStars) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: doHint,
						className: "inline-flex h-11 items-center gap-1 rounded-full bg-star/20 px-3 text-sm font-semibold text-navy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, { className: "h-4 w-4" }),
							"闪闪帮忙 ",
							hintsUsed,
							"/3"
						]
					})
				]
			}),
			level.checklist && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex flex-wrap gap-2 bg-cream-2 px-3 py-2 text-xs font-semibold md:px-5",
				children: level.checklist.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-full bg-foam px-3 py-1 text-ink-soft",
					children: [
						i + 1,
						". ",
						c
					]
				}, c))
			}),
			hintText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 bg-navy px-4 py-2 text-sm text-cream",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fairy, { className: "h-10 w-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: hintText })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col overflow-auto lg:grid lg:grid-cols-3 lg:overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 px-3 py-4 md:px-6 lg:col-span-2 lg:overflow-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto flex max-w-xl flex-col gap-3",
						children: level.slots.map((slot, idx) => {
							const filled = work.blocks.filter((b) => b.slotId === slot.id);
							const pulse = Boolean(slot.gap) && filled.length === 0 && (slot.shadow !== "none" || hintLv >= 3);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-stretch gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-4 w-6 text-center text-sm font-semibold text-fog",
									children: idx + 1
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									ref: (el) => {
										slotRefs.current[slot.id] = el;
									},
									onClick: () => onSlotClick(slot.id),
									className: cn("flex min-h-[5.5rem] flex-1 flex-wrap items-center gap-2 rounded-[22px] border-2 border-dashed px-3 py-2", hover === slot.id ? "border-coral bg-coral/10" : "border-cream-3 bg-foam", pulse && "gap-pulse", jelly === slot.id && "jelly"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "w-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] font-semibold text-ink-soft",
												children: slot.label
											}), slot.shadow !== "none" && filled.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-fog",
												children: slot.hint
											})]
										}),
										filled.length === 0 && slot.shadow === "full" && slot.prefill && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "opacity-30",
											children: (() => {
												const d = blockById(slot.prefill);
												return d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockTile, {
													def: d,
													compact: true
												}) : null;
											})()
										}),
										filled.length === 0 && slot.shadow === "outline" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-12 w-24 items-center justify-center rounded-xl border border-dashed border-fog text-[11px] text-fog",
											children: kindLabel(slot.accepts[0])
										}),
										filled.map((b) => {
											const d = blockById(b.defId);
											if (!d) return null;
											const locked = level.slots.find((s) => s.id === b.slotId)?.locked;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockTile, {
												def: d,
												text: b.text,
												compact: true,
												gold: d.knowledge?.specific,
												onPointerDown: locked ? void 0 : (e) => startDrag(b.defId, e, b.uid)
											}, b.uid);
										})
									]
								})]
							}, slot.id);
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "flex min-h-[300px] flex-col overflow-hidden border-t border-cream-3 bg-navy text-cream lg:col-span-1 lg:min-h-0 lg:overflow-auto lg:border-l lg:border-t-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex shrink-0 flex-col items-center px-4 pt-4",
						children: [
							fw && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fireworks, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: !hasTap || busy,
								onClick: () => talk(ask || asks[0] || "你是谁？", "tap"),
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerPortrait, {
									id: pid,
									mood: awake ? mood : "sleep",
									size: "md",
									className: "lg:h-40 lg:w-40"
								}), hasTap && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-trigger px-2 py-0.5 text-[10px] font-bold",
									children: "点一点"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-sm font-semibold",
								children: [
									p.title,
									"·",
									p.name
								]
							}),
							badge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-2 inline-flex items-center gap-1 rounded-full bg-rag px-3 py-1 text-xs font-bold jelly",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " 用了百宝箱"]
							}),
							raised && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-2 rounded-2xl bg-skill px-3 py-1.5 text-xs font-bold",
								style: { animation: "raise-card 0.4s ease" },
								children: [
									"自己举起了「",
									skillName(raised),
									"」"
								]
							}),
							stickers && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap justify-center gap-1",
								children: Array.from({ length: stickers.count }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-lg bg-cream px-2 py-1 text-xs font-semibold text-ink",
									children: stickers.kind
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 w-full min-h-0 flex-1 space-y-2 overflow-auto px-1 pb-2",
								children: lines.slice(-6).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("max-w-[90%] rounded-2xl px-3 py-2 text-sm", l.from === "kid" ? "ml-auto bg-coral text-navy" : "bg-white/10"),
									children: l.text
								}, l.id))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 border-t border-white/10 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: asks.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold",
									onClick: () => talk(q, hasVoice && q === voicePhrase ? "voice" : "ask"),
									children: q
								}, q))
							}),
							hasVoice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1.5",
								children: PRESET_CATCHPHRASES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setVoicePhrase(level.id, c.label);
										talk(c.label, "voice");
									},
									className: cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", voicePhrase === c.label ? "bg-mint text-navy" : "bg-white/10"),
									children: c.label
								}, c.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "flex gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									talk(ask, "ask");
									setAsk("");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: ask,
									onChange: (e) => setAsk(e.target.value),
									placeholder: "对它说…",
									className: "h-11 flex-1 rounded-full bg-white/10 px-4 text-sm outline-none placeholder:text-cream/40"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									disabled: busy,
									children: "问"
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-cream-3 bg-cream-2 px-3 py-3 md:px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-ink-soft",
							children: "积木托盘 · 拖进空槽，或先点积木再点空槽"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								undo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs font-semibold text-coral",
									onClick: () => {
										setWork(undo);
										setUndo(null);
									},
									children: "吐回来"
								}),
								level.id === "L8" && !revealScript && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs font-semibold text-ink-soft",
									onClick: () => setRevealScript(true),
									children: "底层有一张？"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									ref: trashRef,
									type: "button",
									className: "inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-ink/10 text-ink-soft",
									"aria-label": "垃圾桶",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-5 w-5" })
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("flex gap-2 overflow-x-auto pb-2 no-scrollbar", hintLv >= 1 && "ring-2 ring-star rounded-2xl p-2"),
						children: pack.map((def) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockTile, {
							def,
							gold: def.knowledge?.specific,
							bounce: bounceId === def.id,
							dim: Boolean(picked) && picked !== def.id,
							onPointerDown: (e) => startDrag(def.id, e),
							onClick: () => setPicked((x) => x === def.id ? null : def.id)
						}, def.id))
					}),
					work.blocks.some((b) => blockById(b.defId)?.kind === "catchphrase") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatchphraseEditor, {
						work,
						setWork,
						lowGrade
					}),
					work.blocks.some((b) => blockById(b.defId)?.kind === "opening") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpeningEditor, {
						work,
						setWork
					}),
					work.blocks.some((b) => blockById(b.defId)?.kind === "trigger-voice") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-ink-soft",
							children: "暗号是"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: work.blocks.find((b) => blockById(b.defId)?.kind === "trigger-voice")?.text ?? voicePhrase,
							onChange: (e) => {
								const v = e.target.value.slice(0, 8);
								setVoicePhrase(level.id, v);
								setWork((w) => ({ blocks: w.blocks.map((b) => blockById(b.defId)?.kind === "trigger-voice" ? {
									...b,
									text: v
								} : b) }));
							},
							className: "h-10 w-32 rounded-full bg-foam px-3 text-sm outline-none ring-1 ring-cream-3"
						})]
					})
				]
			}),
			drag && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 opacity-90",
				style: {
					left: drag.x,
					top: drag.y
				},
				children: blockById(drag.defId) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockTile, {
					def: blockById(drag.defId),
					compact: true
				})
			}),
			win && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Victory, {
				level,
				stars: Math.max(stars, liveStars),
				onQuiz: () => {
					setWin(false);
					setQuizOn(true);
				},
				onClose: () => setWin(false)
			}),
			quizOn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quiz, {
				level,
				onClose: () => setQuizOn(false),
				onWin: () => {
					passQuiz(level.id, level.quiz.cardIds);
					persistStars(3);
					setQuizOn(false);
					setWin(true);
				}
			}),
			finale && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Finale, { onClose: () => setFinale(false) }),
			!free && !win && liveStars >= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky bottom-0 flex items-center justify-between gap-3 border-t border-cream-3 bg-foam px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: "已经能通关啦。还可以继续玩，点亮更多星。"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [!quizPassed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						tone: "star",
						size: "sm",
						onClick: () => setQuizOn(true),
						children: "口诀测验"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => setWin(true),
						children: "收下星星"
					})]
				})]
			})
		]
	});
}
function Stars({ n }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-1",
		"aria-label": `${n} 星`,
		children: [
			1,
			2,
			3
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold", i <= n ? "bg-star text-navy" : "bg-cream-3 text-fog"),
			children: i
		}, i))
	});
}
function skillName(id) {
	return {
		draw: "画画",
		math: "算数",
		sing: "唱歌",
		joke: "讲笑话",
		answer: "举答案牌"
	}[id];
}
function CatchphraseEditor({ work, setWork, lowGrade }) {
	const cur = work.blocks.find((b) => blockById(b.defId)?.kind === "catchphrase");
	if (!cur) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 flex flex-wrap items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-semibold text-ink-soft",
				children: "口头禅"
			}),
			PRESET_CATCHPHRASES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setWork((w) => ({ blocks: w.blocks.map((b) => b.uid === cur.uid ? {
					...b,
					text: c.label
				} : b) })),
				className: cn("rounded-full px-3 py-1.5 text-xs font-semibold", cur.text === c.label ? "bg-persona text-foam" : "bg-foam"),
				children: c.label
			}, c.id)),
			!lowGrade && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: cur.text ?? "",
				maxLength: 8,
				placeholder: "自己写",
				onChange: (e) => setWork((w) => ({ blocks: w.blocks.map((b) => b.uid === cur.uid ? {
					...b,
					text: e.target.value
				} : b) })),
				className: "h-9 w-28 rounded-full bg-foam px-3 text-xs outline-none ring-1 ring-cream-3"
			})
		]
	});
}
function OpeningEditor({ work, setWork }) {
	const cur = work.blocks.find((b) => blockById(b.defId)?.kind === "opening");
	if (!cur) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-semibold text-ink-soft",
			children: "开场白"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: cur.text ?? "你是谁？",
			maxLength: 16,
			onChange: (e) => setWork((w) => ({ blocks: w.blocks.map((b) => b.uid === cur.uid ? {
				...b,
				text: e.target.value
			} : b) })),
			className: "h-9 flex-1 rounded-full bg-foam px-3 text-xs outline-none ring-1 ring-cream-3"
		})]
	});
}
function Fireworks() {
	const bits = Array.from({ length: 18 }, (_, i) => i);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 overflow-hidden",
		children: bits.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute left-1/2 top-1/3 h-2 w-2 rounded-full bg-star",
			style: {
				transform: `rotate(${i * 20}deg) translateY(-40px)`,
				animation: "ribbon 1.2s ease-out both",
				animationDelay: `${i % 6 * 40}ms`,
				background: [
					"#F5C15A",
					"#FF8A4C",
					"#3ECFB4",
					"#E56B9A"
				][i % 4]
			}
		}, i))
	});
}
function Victory({ level, stars, onQuiz, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-md overflow-hidden rounded-[28px] bg-cream p-6 text-ink shadow-[0_24px_60px_rgba(0,0,0,0.35)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-semibold text-coral",
					children: ["通关 · ", level.name]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex justify-center gap-2",
					children: [
						1,
						2,
						3
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("inline-flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold", i <= stars ? "bg-star text-navy jelly" : "bg-cream-3 text-fog"),
						children: i
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-center text-lg font-semibold",
					children: level.wow
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 rounded-2xl bg-navy px-4 py-3 text-sm text-cream",
					children: level.hook
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-col gap-2",
					children: [
						stars < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							tone: "star",
							onClick: onQuiz,
							children: "口诀测验点亮第三星"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/map",
							className: "block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pressable inline-flex h-12 w-full items-center justify-center rounded-full bg-coral text-base font-semibold text-navy shadow-[0_5px_0_var(--color-coral-deep)]",
								children: "回星图"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							tone: "ghost",
							className: "text-ink",
							onClick: onClose,
							children: "再玩一会儿"
						})
					]
				})
			]
		})
	});
}
function Quiz({ level, onClose, onWin }) {
	const [wrong, setWrong] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-[28px] bg-cream p-6 text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-coral",
					children: "口诀测验 · 零文字依赖"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xl font-semibold",
					children: level.quiz.question
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid grid-cols-3 gap-3",
					children: level.quiz.options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							if (o.correct) onWin();
							else {
								setWrong(o.id);
								toast("再看看口诀");
							}
						},
						className: cn("flex flex-col items-center gap-2 rounded-2xl bg-foam p-3 ring-2 ring-transparent", wrong === o.id && "wiggle ring-display"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PedIcon, { name: o.icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold",
							children: o.label
						})]
					}, o.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					tone: "ghost",
					className: "mt-4 w-full text-ink",
					onClick: onClose,
					children: "关闭"
				})
			]
		})
	});
}
function Finale({ onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 overflow-auto bg-navy p-6 text-cream",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl pt-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-star",
					children: "星核拼合"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl font-semibold",
					children: "舱门，开了"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/scenes/hero.jpg",
					alt: "",
					className: "mx-auto mt-6 w-full rounded-[28px] object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-lg",
					children: "里面还有一个笼子。名牌上写着：第二个伙伴。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-cream/70",
					children: "灰雾，原来也是星灵。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex flex-wrap justify-center gap-3",
					children: [
						"cat",
						"dog",
						"rabbit",
						"parrot",
						"turtle",
						"owl"
					].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerPortrait, {
						id,
						mood: "look",
						size: "sm"
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-8",
					onClick: onClose,
					children: "我们下学期再见"
				})
			]
		})
	});
}
//#endregion
export { LevelStudio as t };
