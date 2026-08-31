import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, _ as createRootRoute, b as useRouter, d as HeadContent, g as createFileRoute, h as lazyRouteComponent, m as Outlet, p as createRouter, u as Scripts, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BqNGgz6D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var LEVELS = [
	{
		id: "L1",
		index: 1,
		chapter: 1,
		name: "唤醒伙伴",
		concept: "角色卡决定它是谁",
		motto: "换张卡，变个它",
		newBlocks: ["persona"],
		shadow: "S3",
		gapCount: 1,
		firstGapSafe: true,
		allowTrial: false,
		autonomy: 5,
		mission: "把一张角色卡放进空槽，点伙伴，看它醒来。",
		wow: "同一个「你是谁」，三张卡三种回答。",
		hook: "灰雾深处，传来一声猫叫。可岛上，没有猫。",
		cutscene: [
			{
				caption: "灰雾来了。声音，被偷走了。",
				scene: "fog"
			},
			{
				caption: "伙伴躺在沙滩。它忘了自己是谁。",
				scene: "beach"
			},
			{
				caption: "驯养员，用一张卡，唤醒它。",
				scene: "card"
			}
		],
		slots: [
			{
				id: "trigger",
				label: "开关",
				hint: "点一点",
				accepts: ["trigger-tap"],
				shadow: "full",
				prefill: "trigger-tap",
				locked: true
			},
			{
				id: "speech",
				label: "说话",
				hint: "气泡",
				accepts: ["display-speech"],
				shadow: "full",
				prefill: "speech",
				locked: true
			},
			{
				id: "opening",
				label: "开场白",
				hint: "你是谁？",
				accepts: ["opening"],
				shadow: "full",
				prefill: "opening",
				locked: true
			},
			{
				id: "persona",
				label: "它是谁",
				hint: "先放角色卡哦",
				accepts: ["persona"],
				shadow: "full",
				gap: true
			}
		],
		pack: [
			"persona-cat",
			"persona-dog",
			"persona-rabbit"
		],
		quiz: {
			question: "想让伙伴变个样，用什么？",
			options: [
				{
					id: "a",
					label: "角色卡",
					icon: "persona",
					correct: true
				},
				{
					id: "b",
					label: "百宝箱",
					icon: "rag"
				},
				{
					id: "c",
					label: "烟花",
					icon: "firework"
				}
			],
			cardIds: ["persona"]
		}
	},
	{
		id: "L2",
		index: 2,
		chapter: 1,
		name: "它开口了",
		concept: "触发器让它开始行动",
		motto: "点一点，就说话",
		newBlocks: ["trigger", "catchphrase"],
		shadow: "S3",
		gapCount: 2,
		firstGapSafe: true,
		allowTrial: false,
		autonomy: 10,
		mission: "给它一句口头禅，再写一句开场白。点它，听它说你的话。",
		wow: "全班同时点伙伴，教室变成口头禅大合唱。",
		hook: "沙滩上出现脚印。圆圆的。不是动物的。",
		cutscene: [
			{
				caption: "伙伴醒了。可它只会一句。像复读机。",
				scene: "repeat"
			},
			{
				caption: "驯养员，教它说新话。",
				scene: "card"
			},
			{
				caption: "先定暗号：点一点，它就开口。",
				scene: "light"
			}
		],
		slots: [
			{
				id: "trigger",
				label: "开关",
				hint: "点一点",
				accepts: ["trigger-tap"],
				shadow: "full",
				prefill: "trigger-tap",
				locked: true
			},
			{
				id: "persona",
				label: "它是谁",
				hint: "角色卡",
				accepts: ["persona"],
				shadow: "full",
				gap: true
			},
			{
				id: "speech",
				label: "说话",
				hint: "气泡",
				accepts: ["display-speech"],
				shadow: "full",
				prefill: "speech",
				locked: true
			},
			{
				id: "catchphrase",
				label: "口头禅",
				hint: "挂嘴边的那句",
				accepts: ["catchphrase"],
				shadow: "full",
				gap: true
			},
			{
				id: "opening",
				label: "开场白",
				hint: "第一句话",
				accepts: ["opening"],
				shadow: "full",
				gap: true
			}
		],
		pack: [
			"persona-cat",
			"persona-dog",
			"persona-rabbit",
			"catchphrase",
			"opening"
		],
		quiz: {
			question: "伙伴怎么开始说话？",
			options: [
				{
					id: "a",
					label: "点一点",
					icon: "trigger",
					correct: true
				},
				{
					id: "b",
					label: "放烟花",
					icon: "firework"
				},
				{
					id: "c",
					label: "喂资料",
					icon: "rag"
				}
			],
			cardIds: ["trigger", "catchphrase"]
		}
	},
	{
		id: "L3",
		index: 3,
		chapter: 1,
		name: "喂它记忆",
		concept: "先喂，再问",
		motto: "喂资料，答得妙",
		newBlocks: ["rag"],
		shadow: "S2",
		gapCount: 2,
		firstGapSafe: true,
		allowTrial: true,
		autonomy: 25,
		mission: "先问一次（它会不知道），再把百宝箱和三张资料喂进去，再问。",
		wow: "它不是猜的！它查了我喂的书！",
		hook: "百宝箱底，多出一页记忆。上面写着：灰雾会学人说话。",
		cutscene: [
			{
				caption: "伙伴想家了。它忘了家。",
				scene: "home"
			},
			{
				caption: "驯养员有百宝箱。喂一口，它想起一口。",
				scene: "feed"
			},
			{
				caption: "先喂，再问。记住顺序。",
				scene: "badge"
			}
		],
		slots: [
			{
				id: "trigger",
				label: "开关",
				hint: "点一点",
				accepts: ["trigger-tap"],
				shadow: "full",
				prefill: "trigger-tap",
				locked: true
			},
			{
				id: "persona",
				label: "它是谁",
				hint: "角色卡",
				accepts: ["persona"],
				shadow: "outline",
				gap: true
			},
			{
				id: "rag",
				label: "百宝箱",
				hint: "从卡包拖百宝箱",
				accepts: ["rag"],
				shadow: "outline",
				gap: true
			},
			{
				id: "feed",
				label: "喂资料",
				hint: "资料放进箱子",
				accepts: ["knowledge"],
				shadow: "outline",
				gap: true,
				capacity: 3
			},
			{
				id: "speech",
				label: "提问",
				hint: "气泡",
				accepts: ["display-speech"],
				shadow: "full",
				prefill: "speech",
				locked: true
			}
		],
		pack: [
			"persona-cat",
			"persona-dog",
			"persona-rabbit",
			"rag",
			"know-echo-loc",
			"know-echo-food",
			"know-echo-song"
		],
		quiz: {
			question: "伙伴怎么知道岛的歌？",
			options: [
				{
					id: "a",
					label: "喂了资料",
					icon: "rag",
					correct: true
				},
				{
					id: "b",
					label: "它瞎猜",
					icon: "persona"
				},
				{
					id: "c",
					label: "它做梦",
					icon: "firework"
				}
			],
			cardIds: ["rag"]
		}
	},
	{
		id: "L4",
		index: 4,
		chapter: 1,
		name: "专属记忆",
		concept: "喂什么，答什么",
		motto: "喂什么，答什么",
		newBlocks: ["memory"],
		shadow: "S2",
		gapCount: 3,
		firstGapSafe: false,
		allowTrial: true,
		autonomy: 40,
		mission: "在混着的资料里，挑出只属于它的三页记忆，再问「你叫什么」。",
		wow: "喂对出生纸的瞬间，它想起自己的名字。",
		hook: "那页记忆有落款。被水泡花了。只剩一个字：回。",
		cutscene: [
			{
				caption: "坏消息。伙伴连名字都忘了。",
				scene: "tear"
			},
			{
				caption: "普通资料，救不了它。要喂它的专属记忆页。",
				scene: "album"
			},
			{
				caption: "别喂错。错了，它会更糊涂。",
				scene: "wind"
			}
		],
		slots: [
			{
				id: "trigger",
				label: "开关",
				hint: "点一点",
				accepts: ["trigger-tap"],
				shadow: "outline",
				gap: true
			},
			{
				id: "persona",
				label: "它是谁",
				hint: "角色卡",
				accepts: ["persona"],
				shadow: "outline",
				gap: true
			},
			{
				id: "memory",
				label: "记忆页",
				hint: "建一页只属于它的记忆",
				accepts: ["memory"],
				shadow: "outline",
				gap: true
			},
			{
				id: "feed",
				label: "专属资料",
				hint: "金边的才是它的",
				accepts: ["knowledge"],
				shadow: "outline",
				gap: true,
				capacity: 3
			},
			{
				id: "speech",
				label: "提问",
				hint: "问：你叫什么",
				accepts: ["display-speech"],
				shadow: "outline"
			}
		],
		pack: [
			"persona-cat",
			"persona-dog",
			"persona-rabbit",
			"trigger-tap",
			"memory",
			"speech",
			"know-news",
			"know-joke-card",
			"know-other-map"
		],
		extraPackLowGrade: [],
		quiz: {
			question: "想让伙伴答得准，要喂？",
			options: [
				{
					id: "a",
					label: "对的知识",
					icon: "memory",
					correct: true
				},
				{
					id: "b",
					label: "随便什么",
					icon: "rag"
				},
				{
					id: "c",
					label: "烟花",
					icon: "firework"
				}
			],
			cardIds: ["memory"]
		}
	},
	{
		id: "L5",
		index: 5,
		chapter: 2,
		name: "它有本领了",
		concept: "技能是它自己选的",
		motto: "装了技能牌，自己会安排",
		newBlocks: ["skill"],
		shadow: "S1",
		gapCount: 3,
		firstGapSafe: true,
		allowTrial: true,
		autonomy: 60,
		mission: "自己搭回角色卡和开关，再把画画、算数两张技能牌装上。只说事，看它自己举牌。",
		wow: "你说「画 3 只小猫」，没人告诉它用画画，它自己举起画画牌。",
		hook: "新技能牌背面，有抓痕。抓痕是新的。",
		cutscene: [
			{
				caption: "彩虹环带。七座桥。桥断了，没人修。",
				scene: "bridge"
			},
			{
				caption: "伙伴不会修桥。给它技能牌。",
				scene: "equip"
			},
			{
				caption: "牌装上，它自己举。你说事，它来选。",
				scene: "choose"
			}
		],
		slots: [
			{
				id: "trigger",
				label: "开关",
				hint: "先放点一点",
				accepts: ["trigger-tap"],
				shadow: "hint",
				gap: true
			},
			{
				id: "persona",
				label: "它是谁",
				hint: "先放角色卡哦",
				accepts: ["persona"],
				shadow: "hint",
				gap: true
			},
			{
				id: "rag",
				label: "百宝箱",
				hint: "可以带着箱子",
				accepts: ["rag"],
				shadow: "hint"
			},
			{
				id: "skills",
				label: "技能槽",
				hint: "技能牌装进槽",
				accepts: ["skill"],
				shadow: "hint",
				gap: true,
				capacity: 2
			},
			{
				id: "speech",
				label: "说话",
				hint: "气泡",
				accepts: ["display-speech"],
				shadow: "hint"
			}
		],
		pack: [
			"persona-cat",
			"persona-dog",
			"persona-rabbit",
			"persona-parrot",
			"trigger-tap",
			"rag",
			"speech",
			"skill-draw",
			"skill-math"
		],
		quiz: {
			question: "技能牌，谁说了算？",
			options: [
				{
					id: "a",
					label: "它自己选",
					icon: "skill",
					correct: true
				},
				{
					id: "b",
					label: "我指定",
					icon: "trigger"
				},
				{
					id: "c",
					label: "百宝箱",
					icon: "rag"
				}
			],
			cardIds: ["skill"]
		}
	},
	{
		id: "L6",
		index: 6,
		chapter: 2,
		name: "暗号行动",
		concept: "喊暗号，本领到",
		motto: "喊暗号，本领到",
		newBlocks: ["voice"],
		shadow: "S1",
		gapCount: 3,
		firstGapSafe: false,
		allowTrial: true,
		autonomy: 70,
		mission: "槽只有三个，技能有四张，你决定带哪个。再设一句暗号。",
		wow: "别人的暗号它一律不理。这是你调教出来的、独一无二的它。",
		hook: "我们喊暗号。灰雾那头，回了同一句。",
		cutscene: [
			{
				caption: "夜。环带集市。卖艺的桥，还差一块。",
				scene: "night"
			},
			{
				caption: "给它一个暗号。听到暗号，它就开嗓。",
				scene: "stage"
			},
			{
				caption: "槽只有三个。技能有四个。你决定。",
				scene: "slots"
			}
		],
		slots: [
			{
				id: "persona",
				label: "它是谁",
				hint: "角色卡",
				accepts: ["persona"],
				shadow: "hint",
				gap: true
			},
			{
				id: "rag",
				label: "百宝箱",
				hint: "带着箱子",
				accepts: ["rag"],
				shadow: "hint"
			},
			{
				id: "feed",
				label: "集市资料",
				hint: "喂两张",
				accepts: ["knowledge"],
				shadow: "hint",
				capacity: 2
			},
			{
				id: "skills",
				label: "技能槽×3",
				hint: "四张里弃一张",
				accepts: ["skill"],
				shadow: "hint",
				gap: true,
				capacity: 3
			},
			{
				id: "voice",
				label: "暗号",
				hint: "设一句暗号词",
				accepts: ["trigger-voice"],
				shadow: "hint",
				gap: true
			},
			{
				id: "trigger",
				label: "点一点",
				hint: "也可点它",
				accepts: ["trigger-tap"],
				shadow: "hint"
			}
		],
		pack: [
			"persona-cat",
			"persona-dog",
			"persona-parrot",
			"rag",
			"know-echo-food",
			"know-echo-song",
			"skill-draw",
			"skill-math",
			"skill-sing",
			"skill-joke",
			"trigger-voice",
			"trigger-tap"
		],
		quiz: {
			question: "喊暗号，是为了？",
			options: [
				{
					id: "a",
					label: "让它开始本领",
					icon: "voice",
					correct: true
				},
				{
					id: "b",
					label: "吓走灰雾",
					icon: "firework"
				},
				{
					id: "c",
					label: "换角色卡",
					icon: "persona"
				}
			],
			cardIds: ["voice"]
		}
	},
	{
		id: "L7",
		index: 7,
		chapter: 2,
		name: "晚会策划师",
		concept: "先查箱，再举牌",
		motto: "先查箱，再举牌",
		newBlocks: ["firework", "combo"],
		shadow: "S1-lite",
		gapCount: 4,
		firstGapSafe: false,
		allowTrial: true,
		autonomy: 85,
		mission: "喂晚会资料、装举牌技能、绑烟花，再自创一个环节。客人问，它自己查、举、放。",
		wow: "NPC 问烟花几点放，它自己翻箱、举牌「八点整」、放烟花。",
		hook: "烟花夜。天上映出一张脸。脸在笑。",
		cutscene: [
			{
				caption: "今晚，环带晚会。全场伙伴，都要出节目。",
				scene: "fire"
			},
			{
				caption: "你的伙伴，当策划师。客人问，它查，它答。",
				scene: "queue"
			},
			{
				caption: "答得好，放烟花。让全场记住它。",
				scene: "fire"
			}
		],
		checklist: [
			"喂晚会资料",
			"装举牌技能",
			"绑烟花",
			"自创一个环节"
		],
		npcs: [
			{
				name: "贝壳摊主",
				question: "烟花几点放？",
				expect: "八点"
			},
			{
				name: "月亮饼阿姨",
				question: "菜单上有什么？",
				expect: "月亮饼"
			},
			{
				name: "合唱队长",
				question: "今晚有合唱吗？",
				expect: "合唱"
			}
		],
		slots: [
			{
				id: "persona",
				label: "它是谁",
				hint: "",
				accepts: ["persona"],
				shadow: "none",
				gap: true
			},
			{
				id: "trigger",
				label: "开关",
				hint: "",
				accepts: ["trigger-tap", "trigger-voice"],
				shadow: "none",
				gap: true
			},
			{
				id: "rag",
				label: "百宝箱",
				hint: "喂晚会资料",
				accepts: ["rag"],
				shadow: "none",
				gap: true
			},
			{
				id: "feed",
				label: "晚会资料",
				hint: "",
				accepts: ["knowledge"],
				shadow: "none",
				gap: true,
				capacity: 3
			},
			{
				id: "skills",
				label: "技能",
				hint: "装举牌",
				accepts: ["skill"],
				shadow: "none",
				capacity: 3
			},
			{
				id: "show",
				label: "展示",
				hint: "绑烟花",
				accepts: [
					"display-firework",
					"display-ribbon",
					"display-speech"
				],
				shadow: "none",
				capacity: 2
			}
		],
		pack: [
			"persona-cat",
			"persona-dog",
			"persona-parrot",
			"persona-owl",
			"trigger-tap",
			"rag",
			"know-show-list",
			"know-show-time",
			"know-show-menu",
			"skill-answer",
			"skill-sing",
			"skill-draw",
			"skill-math",
			"firework",
			"ribbon",
			"speech"
		],
		quiz: {
			question: "它举牌前，先干了啥？",
			options: [
				{
					id: "a",
					label: "查百宝箱",
					icon: "combo",
					correct: true
				},
				{
					id: "b",
					label: "先放烟花",
					icon: "firework"
				},
				{
					id: "c",
					label: "换角色卡",
					icon: "persona"
				}
			],
			cardIds: ["firework", "combo"]
		}
	},
	{
		id: "L8",
		index: 8,
		chapter: 2,
		name: "星核拼合",
		concept: "完整智能伙伴 2.0",
		motto: "带上它，去见真相",
		newBlocks: ["script"],
		shadow: "S0",
		gapCount: 0,
		firstGapSafe: true,
		allowTrial: true,
		autonomy: 100,
		mission: "独立配置：角色卡 + 百宝箱（≥2 资料）+ ≥2 技能 + 触发器。剧本卡藏在最底层，选装。",
		wow: "舱门开了。里面还有一个笼子。名牌上写着：第二个伙伴。",
		hook: "舱门开了。里面还有一个笼子。名牌上写着：第二个伙伴。灰雾，原来也是星灵。",
		cutscene: [
			{
				caption: "八颗星核，集齐了。舱门，就要开了。",
				scene: "ship"
			},
			{
				caption: "最后一步。做一件大礼：你的伙伴，2.0 版。",
				scene: "cape"
			},
			{
				caption: "带上它，去见真相。",
				scene: "door"
			}
		],
		slots: [
			{
				id: "persona",
				label: "它是谁",
				hint: "",
				accepts: ["persona"],
				shadow: "none",
				gap: true
			},
			{
				id: "trigger",
				label: "开关",
				hint: "",
				accepts: ["trigger-tap", "trigger-voice"],
				shadow: "none",
				gap: true
			},
			{
				id: "rag",
				label: "百宝箱",
				hint: "",
				accepts: ["rag", "memory"],
				shadow: "none",
				gap: true
			},
			{
				id: "feed",
				label: "资料",
				hint: "",
				accepts: ["knowledge"],
				shadow: "none",
				capacity: 4
			},
			{
				id: "skills",
				label: "技能",
				hint: "",
				accepts: ["skill"],
				shadow: "none",
				capacity: 3
			},
			{
				id: "show",
				label: "展示",
				hint: "",
				accepts: [
					"display-speech",
					"display-firework",
					"display-ribbon"
				],
				shadow: "none",
				capacity: 2
			},
			{
				id: "script",
				label: "剧本",
				hint: "点问号才展开",
				accepts: ["script-if"],
				shadow: "none"
			}
		],
		pack: [
			"persona-cat",
			"persona-dog",
			"persona-rabbit",
			"persona-parrot",
			"persona-turtle",
			"persona-owl",
			"trigger-tap",
			"trigger-voice",
			"rag",
			"memory",
			"know-echo-loc",
			"know-echo-song",
			"know-show-time",
			"know-show-menu",
			"skill-draw",
			"skill-math",
			"skill-sing",
			"skill-answer",
			"speech",
			"firework",
			"ribbon",
			"script-if"
		],
		quiz: {
			question: "口诀大闯关：换张卡，会怎样？",
			options: [
				{
					id: "a",
					label: "变个它",
					icon: "persona",
					correct: true
				},
				{
					id: "b",
					label: "放烟花",
					icon: "firework"
				},
				{
					id: "c",
					label: "喂资料",
					icon: "rag"
				}
			],
			cardIds: ["script"]
		}
	}
];
function levelById(id) {
	return LEVELS.find((l) => l.id === id);
}
var PARTNERS = [
	{
		id: "cat",
		name: "铃铛",
		title: "傲娇猫",
		personality: "嘴硬心软，被夸会扭头，耳朵却竖着",
		catchphrase: "才、才不是！",
		opening: "你、你来啦。才不是在等你。",
		wake: "才、才不是在等你！我是铃铛。",
		confused: "哼，这和我有什么关系……我是谁来着？",
		remember: "……才不是高兴呢。我叫铃铛。",
		skipSkill: "哼，本来也不想唱。",
		lookDoor: "笼子里……还有谁？",
		bg: "#F4C9A3",
		accent: "#E07A3D"
	},
	{
		id: "dog",
		name: "来福",
		title: "捧场狗",
		personality: "全场最捧，别人作品运行时鼓掌",
		catchphrase: "好棒好棒！",
		opening: "你好你好！今天也要加油！",
		wake: "好棒好棒！我是来福！终于等到你啦！",
		confused: "好棒的问题！但是……我是谁来着？",
		remember: "我叫来福！！嘿嘿，我想起来啦！",
		skipSkill: "我把机会让给画画啦！",
		lookDoor: "里面还有新朋友？好棒！",
		bg: "#F3E0A8",
		accent: "#D4A017"
	},
	{
		id: "rabbit",
		name: "雪球",
		title: "害羞兔",
		personality: "声音小小，长时间没操作会打瞌睡",
		catchphrase: "……我在。",
		opening: "嗯……你好。",
		wake: "……我在。我叫雪球。",
		confused: "……对不起，我好像想不起来。",
		remember: "我想起来了……我叫雪球。谢谢你。",
		skipSkill: "……那我安静画画好了。",
		lookDoor: "……门开了。好亮。",
		bg: "#D9E7F5",
		accent: "#7BA3C9"
	},
	{
		id: "parrot",
		name: "彩虹",
		title: "话痨鹦鹉",
		personality: "说不完，通关后会复述孩子的操作",
		catchphrase: "然后然后！",
		opening: "然后然后！你来啦你来啦！",
		wake: "然后然后！我叫彩虹！我有好多话要说！",
		confused: "然后然后……咦？下一句是什么来着？",
		remember: "然后然后我叫彩虹！名字想起来啦！",
		skipSkill: "然后我不唱了改画画，可以吧！",
		lookDoor: "然后然后里面还有一个？！",
		bg: "#C8EDE4",
		accent: "#2BA38E"
	},
	{
		id: "turtle",
		name: "阿慢",
		title: "慢性子龟",
		personality: "一字一顿，加载时先伸头再出壳",
		catchphrase: "别急……",
		opening: "别急……我来了。",
		wake: "别急……我是阿慢。慢慢来，也很好。",
		confused: "别急……让我想想。嗯，想不起来。",
		remember: "别急……我想起来了。我叫阿慢。",
		skipSkill: "别急……这张牌，下次再用。",
		lookDoor: "别急……门会开的。看。",
		bg: "#D5E6C3",
		accent: "#6A8F4E"
	},
	{
		id: "owl",
		name: "咕咕",
		title: "博士猫头鹰",
		personality: "爱讲知识，喂错资料时扶眼镜叹气",
		catchphrase: "听我说！",
		opening: "听我说，今天有新发现。",
		wake: "听我说！我是咕咕博士。知识，会回来的。",
		confused: "听我说……这份资料，似乎不是关于我。",
		remember: "听我说！我叫咕咕。记忆校验完成。",
		skipSkill: "听我说，这张技能先归档。",
		lookDoor: "听我说……灰雾，也许也是星灵。",
		bg: "#E8D5B7",
		accent: "#8A5A2B"
	}
];
function partnerById(id) {
	return PARTNERS.find((p) => p.id === id) ?? PARTNERS[0];
}
var ECHO_LOC = {
	id: "echo-loc",
	title: "岛的位置",
	body: "回声岛在星海东边，三颗暖星的正下面。",
	keywords: [
		"在哪",
		"位置",
		"哪里",
		"东边",
		"回声岛"
	]
};
var ECHO_FOOD = {
	id: "echo-food",
	title: "岛的特产",
	body: "回声岛特产是回声贝壳：对着它喊一声，会响三声。",
	keywords: [
		"特产",
		"贝壳",
		"吃",
		"有什么"
	]
};
var ECHO_SONG = {
	id: "echo-song",
	title: "岛的歌",
	body: "岛歌叫《亮晶晶》，第一句是：星光亮晶晶，伙伴在想你。",
	keywords: [
		"歌",
		"唱",
		"亮晶晶",
		"岛歌"
	]
};
var NEWS = {
	id: "news",
	title: "过期新闻",
	body: "去年彗星集市取消了。这和伙伴自己没关系。",
	keywords: ["新闻", "彗星"],
	distractor: true
};
var JOKE = {
	id: "joke-card",
	title: "无关笑话",
	body: "为什么星星不说话？因为它在眨眼。这不是伙伴的记忆。",
	keywords: ["笑话"],
	distractor: true
};
var OTHER_MAP = {
	id: "other-map",
	title: "别岛地图",
	body: "雾珊瑚岛在西边。那不是我们的家。",
	keywords: ["珊瑚", "西边"],
	distractor: true
};
var SHOW_LIST = {
	id: "show-list",
	title: "节目单",
	body: "今晚节目：开场舞、伙伴合唱、最后放烟花。",
	keywords: [
		"节目",
		"合唱",
		"开场"
	]
};
var SHOW_TIME = {
	id: "show-time",
	title: "时间表",
	body: "烟花八点整放。不要提前，不要迟到。",
	keywords: [
		"几点",
		"时间",
		"八点",
		"烟花"
	]
};
var SHOW_MENU = {
	id: "show-menu",
	title: "菜单",
	body: "晚会菜单：星糖苹果、月亮饼、热可可。",
	keywords: [
		"菜单",
		"吃",
		"苹果",
		"月亮饼"
	]
};
function memoriesFor(id) {
	return {
		cat: [
			{
				id: "mem-birth-cat",
				title: "出生纸",
				body: "铃铛出生在星光镇屋顶，生日是流星雨那天。脖子上的铃是妈妈留的。",
				keywords: [
					"名字",
					"你是谁",
					"你叫",
					"谁"
				],
				specific: true,
				partnerId: "cat"
			},
			{
				id: "mem-name-cat",
				title: "名字的故事",
				body: "它叫铃铛，因为走路会叮铃铃响。自己却说才不是故意的。",
				keywords: [
					"名字的故事",
					"为什么叫",
					"铃"
				],
				specific: true,
				partnerId: "cat"
			},
			{
				id: "mem-fav-cat",
				title: "最爱的歌",
				body: "铃铛最爱的歌是《月亮不肯睡》，只在没人时哼。",
				keywords: [
					"最爱",
					"喜欢",
					"歌"
				],
				specific: true,
				partnerId: "cat"
			}
		],
		dog: [
			{
				id: "mem-birth-dog",
				title: "出生纸",
				body: "来福出生在星光镇面包店后巷，生日是星星雨那天。",
				keywords: [
					"名字",
					"你是谁",
					"你叫",
					"谁"
				],
				specific: true,
				partnerId: "dog"
			},
			{
				id: "mem-name-dog",
				title: "名字的故事",
				body: "店里的人说来了就有福，所以叫来福。",
				keywords: ["名字的故事", "为什么叫"],
				specific: true,
				partnerId: "dog"
			},
			{
				id: "mem-fav-dog",
				title: "最爱的歌",
				body: "来福最爱的歌是《好棒进行曲》，会跟着摇尾巴。",
				keywords: [
					"最爱",
					"喜欢",
					"歌"
				],
				specific: true,
				partnerId: "dog"
			}
		],
		rabbit: [
			{
				id: "mem-birth-rabbit",
				title: "出生纸",
				body: "雪球出生在回声岛软沙坡，月亮特别圆的晚上。",
				keywords: [
					"名字",
					"你是谁",
					"你叫",
					"谁"
				],
				specific: true,
				partnerId: "rabbit"
			},
			{
				id: "mem-name-rabbit",
				title: "名字的故事",
				body: "它团起来像一颗雪球，大家就这么叫它。",
				keywords: ["名字的故事", "为什么叫"],
				specific: true,
				partnerId: "rabbit"
			},
			{
				id: "mem-fav-rabbit",
				title: "最爱的歌",
				body: "雪球最爱轻轻的摇篮曲，听着听着会睡着。",
				keywords: [
					"最爱",
					"喜欢",
					"歌"
				],
				specific: true,
				partnerId: "rabbit"
			}
		],
		parrot: [
			{
				id: "mem-birth-parrot",
				title: "出生纸",
				body: "彩虹破壳于虹桥第三拱，那天天上有双彩虹。",
				keywords: [
					"名字",
					"你是谁",
					"你叫",
					"谁"
				],
				specific: true,
				partnerId: "parrot"
			},
			{
				id: "mem-name-parrot",
				title: "名字的故事",
				body: "羽毛七色，所以叫彩虹。它自己会补充：然后还有第八色。",
				keywords: ["名字的故事", "为什么叫"],
				specific: true,
				partnerId: "parrot"
			},
			{
				id: "mem-fav-parrot",
				title: "最爱的歌",
				body: "彩虹最爱把别人的话编成歌，唱个不停。",
				keywords: [
					"最爱",
					"喜欢",
					"歌"
				],
				specific: true,
				partnerId: "parrot"
			}
		],
		turtle: [
			{
				id: "mem-birth-turtle",
				title: "出生纸",
				body: "阿慢出生在潮汐沙滩，用了三天三夜才出壳。",
				keywords: [
					"名字",
					"你是谁",
					"你叫",
					"谁"
				],
				specific: true,
				partnerId: "turtle"
			},
			{
				id: "mem-name-turtle",
				title: "名字的故事",
				body: "大家等它等得太久，笑着叫它阿慢。它觉得这名字刚刚好。",
				keywords: ["名字的故事", "为什么叫"],
				specific: true,
				partnerId: "turtle"
			},
			{
				id: "mem-fav-turtle",
				title: "最爱的歌",
				body: "阿慢最爱的歌只有两句，要唱一分钟。",
				keywords: [
					"最爱",
					"喜欢",
					"歌"
				],
				specific: true,
				partnerId: "turtle"
			}
		],
		owl: [
			{
				id: "mem-birth-owl",
				title: "出生纸",
				body: "咕咕出生在星光镇图书馆塔顶，第一次叫就很有学问。",
				keywords: [
					"名字",
					"你是谁",
					"你叫",
					"谁"
				],
				specific: true,
				partnerId: "owl"
			},
			{
				id: "mem-name-owl",
				title: "名字的故事",
				body: "它叫咕咕，因为思考时会咕一声。博士是后来加上的。",
				keywords: ["名字的故事", "为什么叫"],
				specific: true,
				partnerId: "owl"
			},
			{
				id: "mem-fav-owl",
				title: "最爱的歌",
				body: "咕咕最爱的是知识口诀歌，唱完要提问。",
				keywords: [
					"最爱",
					"喜欢",
					"歌"
				],
				specific: true,
				partnerId: "owl"
			}
		]
	}[id];
}
var ALL_KNOWLEDGE = [
	ECHO_LOC,
	ECHO_FOOD,
	ECHO_SONG,
	NEWS,
	JOKE,
	OTHER_MAP,
	SHOW_LIST,
	SHOW_TIME,
	SHOW_MENU,
	...PARTNERS.flatMap((p) => memoriesFor(p.id))
];
var BLOCKS = [
	...PARTNERS.map((p) => ({
		id: `persona-${p.id}`,
		kind: "persona",
		label: `${p.title}·${p.name}`,
		motto: "换张卡，变个它",
		color: "persona",
		partnerId: p.id
	})),
	{
		id: "trigger-tap",
		kind: "trigger-tap",
		label: "点一点",
		motto: "点一点，就说话",
		color: "trigger"
	},
	{
		id: "trigger-voice",
		kind: "trigger-voice",
		label: "喊暗号",
		motto: "喊暗号，本领到",
		color: "trigger",
		text: "小星星"
	},
	{
		id: "catchphrase",
		kind: "catchphrase",
		label: "口头禅",
		motto: "口头禅，挂嘴边",
		color: "persona"
	},
	{
		id: "opening",
		kind: "opening",
		label: "开场白",
		motto: "第一句话",
		color: "display",
		text: "你是谁？"
	},
	{
		id: "rag",
		kind: "rag",
		label: "百宝箱",
		motto: "喂资料，答得妙",
		color: "rag"
	},
	{
		id: "memory",
		kind: "memory",
		label: "记忆页",
		motto: "喂什么，答什么",
		color: "rag"
	},
	...ALL_KNOWLEDGE.map((k) => ({
		id: `know-${k.id}`,
		kind: "knowledge",
		label: k.title,
		color: "rag",
		knowledge: k
	})),
	{
		id: "skill-draw",
		kind: "skill",
		label: "画画",
		color: "skill",
		skill: "draw",
		motto: "装了技能牌，自己会安排"
	},
	{
		id: "skill-math",
		kind: "skill",
		label: "算数",
		color: "skill",
		skill: "math"
	},
	{
		id: "skill-sing",
		kind: "skill",
		label: "唱歌",
		color: "skill",
		skill: "sing"
	},
	{
		id: "skill-joke",
		kind: "skill",
		label: "讲笑话",
		color: "skill",
		skill: "joke"
	},
	{
		id: "skill-answer",
		kind: "skill",
		label: "举答案牌",
		color: "skill",
		skill: "answer"
	},
	{
		id: "speech",
		kind: "display-speech",
		label: "说话气泡",
		color: "display"
	},
	{
		id: "firework",
		kind: "display-firework",
		label: "放烟花",
		motto: "答得好，烟花冒",
		color: "display"
	},
	{
		id: "ribbon",
		kind: "display-ribbon",
		label: "彩带",
		color: "display"
	},
	{
		id: "script-if",
		kind: "script-if",
		label: "如果就",
		motto: "如果这样，就那样",
		color: "script",
		hidden: true
	}
];
function blockById(id) {
	return BLOCKS.find((b) => b.id === id);
}
var CODEX = [
	{
		id: "persona",
		name: "角色卡 · 它是谁",
		motto: "换张卡，变个它",
		desc: "决定伙伴的性格和说话方式。",
		color: "persona",
		lesson: "L1"
	},
	{
		id: "trigger",
		name: "触发器 · 点一点",
		motto: "点一点，就说话",
		desc: "让伙伴开始行动的开关。",
		color: "trigger",
		lesson: "L2"
	},
	{
		id: "catchphrase",
		name: "口头禅 · 挂嘴边",
		motto: "口头禅，挂嘴边",
		desc: "伙伴最爱的那句话，会渗进每次回答。",
		color: "persona",
		lesson: "L2"
	},
	{
		id: "rag",
		name: "百宝箱 · 喂知识",
		motto: "喂资料，答得妙",
		desc: "AI 不知道的事，可以喂给它。",
		color: "rag",
		lesson: "L3"
	},
	{
		id: "memory",
		name: "记忆页 · 只属于它",
		motto: "喂什么，答什么",
		desc: "资料质量决定回答质量。",
		color: "rag",
		lesson: "L4"
	},
	{
		id: "skill",
		name: "技能 · 它自己选",
		motto: "装了技能牌，自己会安排",
		desc: "孩子只说事，伙伴自己举牌。",
		color: "skill",
		lesson: "L5"
	},
	{
		id: "voice",
		name: "触发器 · 喊暗号",
		motto: "喊暗号，本领到",
		desc: "听到那句话，本领立刻开始。",
		color: "trigger",
		lesson: "L6"
	},
	{
		id: "firework",
		name: "展示 · 放烟花",
		motto: "答得好，烟花冒",
		desc: "答得好，天开花。",
		color: "display",
		lesson: "L7"
	},
	{
		id: "combo",
		name: "组合技 · 查完举牌",
		motto: "先查箱，再举牌",
		desc: "先查百宝箱，再把答案举起来。",
		color: "display",
		lesson: "L7"
	},
	{
		id: "script",
		name: "剧本 · 如果就",
		motto: "如果这样，就那样",
		desc: "答对时，放烟花。装不装都能毕业。",
		color: "script",
		lesson: "L8"
	}
];
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
var INITIAL = {
	role: "guest",
	studentName: "",
	teacherName: "王老师",
	partnerId: null,
	classCode: "8821",
	familyCode: "",
	energy: 12,
	silentMode: true,
	lowGrade: true,
	previewAll: false,
	onboarded: false,
	parentBound: false,
	unlocked: ["L1"],
	stars: {},
	collected: [],
	lit: [],
	events: {},
	works: {},
	freeWorks: [],
	hintsUsed: {},
	quizPassed: {},
	askedBeforeFeed: {},
	seenCutscene: {},
	gachaPity: 0,
	cosmetics: [],
	currentLesson: "L1",
	classLocked: false,
	praise: null,
	voicePhrase: {}
};
function familyCodeFrom(name) {
	const n = (name || "星").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
	return String(1e3 + n % 9e3);
}
var useApp = create()(persist((set, get) => ({
	...INITIAL,
	hydrated: true,
	setHydrated: () => set({ hydrated: true }),
	setRole: (role) => set({ role }),
	onboardStudent: (studentName, partnerId) => set({
		role: "student",
		studentName,
		partnerId,
		onboarded: true,
		familyCode: familyCodeFrom(studentName)
	}),
	onboardTeacher: (teacherName) => set({
		role: "teacher",
		teacherName,
		onboarded: true
	}),
	bindParent: (code) => {
		const ok = code.trim() === get().familyCode || code.trim() === "8821";
		if (ok) set({
			role: "parent",
			parentBound: true
		});
		return ok;
	},
	setSilent: (silentMode) => set({ silentMode }),
	setLowGrade: (lowGrade) => set({ lowGrade }),
	enablePreviewAll: () => set({
		previewAll: true,
		unlocked: LEVELS.map((l) => l.id),
		onboarded: true,
		role: get().role === "guest" ? "student" : get().role,
		studentName: get().studentName || "小星",
		partnerId: get().partnerId ?? "cat",
		familyCode: get().familyCode || familyCodeFrom("小星")
	}),
	resetDemo: () => set({
		...INITIAL,
		hydrated: true,
		familyCode: ""
	}),
	bump: (levelId, ev, n = 1) => set((s) => {
		const cur = s.events[levelId] ?? {};
		return { events: {
			...s.events,
			[levelId]: {
				...cur,
				[ev]: (cur[ev] ?? 0) + n
			}
		} };
	}),
	setWork: (levelId, work) => set((s) => ({ works: {
		...s.works,
		[levelId]: work
	} })),
	useHint: (levelId) => {
		const next = (get().hintsUsed[levelId] ?? 0) + 1;
		set((s) => ({ hintsUsed: {
			...s.hintsUsed,
			[levelId]: next
		} }));
		return next;
	},
	passQuiz: (levelId, cardIds) => {
		set((s) => ({ quizPassed: {
			...s.quizPassed,
			[levelId]: true
		} }));
		get().bump(levelId, "EVT_QUIZ_PASS");
		cardIds.forEach((id) => get().lightCard(id));
	},
	awardStars: (levelId, n) => {
		const prev = get().stars[levelId] ?? 0;
		const stars = Math.max(prev, n);
		const idx = LEVELS.findIndex((l) => l.id === levelId);
		const unlocked = new Set(get().unlocked);
		unlocked.add(levelId);
		if (stars >= 1 && idx >= 0 && idx < LEVELS.length - 1) unlocked.add(LEVELS[idx + 1].id);
		const level = LEVELS[idx];
		if (stars >= 1 && level) level.quiz.cardIds.forEach((id) => get().collectCard(id));
		if (stars >= 2 && level) level.quiz.cardIds.forEach((id) => get().lightCard(id));
		set({
			stars: {
				...get().stars,
				[levelId]: stars
			},
			unlocked: Array.from(unlocked)
		});
		if (stars > prev) get().addEnergy(stars === 1 ? 10 : stars === 2 ? 8 : 8);
	},
	collectCard: (id) => set((s) => s.collected.includes(id) ? s : { collected: [...s.collected, id] }),
	lightCard: (id) => set((s) => {
		if (s.lit.includes(id)) return s;
		const collected = s.collected.includes(id) ? s.collected : [...s.collected, id];
		return {
			lit: [...s.lit, id],
			collected,
			energy: s.energy + 8
		};
	}),
	addEnergy: (n) => set((s) => ({ energy: Math.max(0, s.energy + n) })),
	pullGacha: () => {
		const s = get();
		if (s.energy < 40) return null;
		const pity = s.gachaPity + 1;
		const rare = pity >= 4 || Math.random() < .18;
		const pool = rare ? [
			"星光相框",
			"彩虹披风",
			"铃铛徽章",
			"夜空皮肤"
		] : [
			"贴纸·星",
			"贴纸·贝壳",
			"卡套·暖橙",
			"卡套·薄荷",
			"小旗"
		];
		const item = pool[Math.floor(Math.random() * pool.length)];
		set({
			energy: s.energy - 40,
			gachaPity: rare ? 0 : pity,
			cosmetics: [...s.cosmetics, item]
		});
		const card = CODEX[Math.floor(Math.random() * (CODEX.length - 1))];
		get().collectCard(card.id);
		return {
			item,
			rare
		};
	},
	saveFree: (title, work) => set((s) => ({
		freeWorks: [{
			id: uid("free"),
			title,
			work,
			at: Date.now()
		}, ...s.freeWorks].slice(0, 12),
		energy: s.energy + 10
	})),
	markAsked: (levelId) => set((s) => ({ askedBeforeFeed: {
		...s.askedBeforeFeed,
		[levelId]: true
	} })),
	markCutscene: (levelId) => set((s) => ({ seenCutscene: {
		...s.seenCutscene,
		[levelId]: true
	} })),
	setVoicePhrase: (levelId, phrase) => set((s) => ({ voicePhrase: {
		...s.voicePhrase,
		[levelId]: phrase
	} })),
	setLesson: (currentLesson) => set({ currentLesson }),
	setLocked: (classLocked) => set({ classLocked }),
	lightningPraise: (name) => set({ praise: {
		name,
		at: Date.now()
	} }),
	clearPraise: () => set({ praise: null })
}), {
	name: "xingyu-hao-v1",
	partialize: (s) => {
		const { hydrated, praise, classLocked, ...rest } = s;
		return rest;
	},
	onRehydrateStorage: () => (state) => {
		state?.setHydrated();
	}
}));
function PartnerPortrait({ id, mood = "idle", size = "md", className }) {
	const p = partnerById(id);
	const dim = size === "sm" ? "h-16 w-16" : size === "md" ? "h-28 w-28" : size === "lg" ? "h-40 w-40" : "h-56 w-56";
	const asleep = mood === "sleep";
	const confused = mood === "confused" || mood === "yawn";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative inline-flex items-end justify-center", dim, className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("relative h-full w-full overflow-hidden rounded-[28%]", asleep ? "" : "bob", confused && "wiggle"),
				style: { background: p.bg },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: `/partners/${id}.jpg`,
					alt: p.name,
					className: cn("h-full w-full object-cover object-top transition-[filter,transform] duration-500", asleep && "grayscale contrast-75 brightness-90")
				}), asleep && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-navy/25" })]
			}),
			asleep && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute -top-2 right-1 text-star text-lg font-bold",
				children: "?"
			}),
			mood === "hold-box" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute -right-2 bottom-3 rounded-xl bg-rag px-2 py-1 text-[10px] font-bold text-foam",
				children: "百宝箱"
			}),
			mood === "hold-card" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute -right-1 top-4 rounded-xl bg-skill px-2 py-1 text-[10px] font-bold text-foam",
				children: "举牌"
			}),
			mood === "proud" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute -top-3 left-1/2 -translate-x-1/2 text-star",
				children: "✦"
			})
		]
	});
}
function Fairy({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/partners/fairy.jpg",
		alt: "闪闪",
		className: cn("h-14 w-14 rounded-full object-cover bob", className)
	});
}
function AppOverlays() {
	const locked = useApp((s) => s.classLocked);
	const praise = useApp((s) => s.praise);
	const partnerId = useApp((s) => s.partnerId) ?? "cat";
	const clearPraise = useApp((s) => s.clearPraise);
	(0, import_react.useEffect)(() => {
		if (!praise) return;
		const t = setTimeout(clearPraise, 1e4);
		return () => clearTimeout(t);
	}, [praise, clearPraise]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [locked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[80] flex flex-col items-center justify-center bg-cream text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerPortrait, {
				id: partnerId,
				mood: "idle",
				size: "lg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-3xl font-semibold",
				children: "请抬头看老师"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-ink-soft",
				children: "屏幕先休息一下，耳朵张开。"
			})
		]
	}), praise && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[70] flex flex-col items-center justify-center bg-navy/80",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confetti, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative rounded-[28px] bg-cream px-10 py-8 text-center text-ink shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-coral",
					children: "闪电点赞"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-3xl font-semibold",
					children: praise.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-ink-soft",
					children: "上大屏啦 · 全班一起鼓掌"
				})
			]
		})]
	})] });
}
function Confetti() {
	const bits = Array.from({ length: 28 }, (_, i) => i);
	const colors = [
		"#FF8A4C",
		"#3ECFB4",
		"#F5C15A",
		"#E56B9A",
		"#7B63C8"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 overflow-hidden",
		"aria-hidden": true,
		children: bits.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute top-0 h-3 w-2 rounded-sm",
			style: {
				left: `${i * 13 % 100}%`,
				background: colors[i % colors.length],
				animation: `confetti-fall ${2.4 + i % 5 * .2}s linear ${i * .05}s both`
			}
		}, i))
	});
}
var styles_default = "/assets/styles-C5yS0rhO.css";
var APP_NAME = "星语号";
var Route$9 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0E1A3A"
			},
			{
				name: "description",
				content: "小学 AI 编程 · Agent 原生课堂。星光驯养员，去把伙伴唤醒。"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "zh-CN",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-dvh bg-navy text-cream",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppOverlays, {})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					position: "top-center",
					toastOptions: { style: {
						background: "#F7F0E4",
						color: "#1B1635",
						border: "none",
						borderRadius: "18px",
						fontFamily: "Fredoka, Noto Sans SC, sans-serif",
						fontWeight: 600
					} }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$8 = () => import("./routes-BKHwoD__.mjs");
var Route$8 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./chest-B97rIgKH.mjs");
var Route$7 = createFileRoute("/chest")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./codex-C6z8O5eI.mjs");
var Route$6 = createFileRoute("/codex")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./free-DTonmlZV.mjs");
var Route$5 = createFileRoute("/free")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./map-B-Zw5oMo.mjs");
var Route$4 = createFileRoute("/map")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./onboard-xb1j17Ah.mjs");
var Route$3 = createFileRoute("/onboard")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./parent-VZWC4hNP.mjs");
var Route$2 = createFileRoute("/parent")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./teacher-Doll0qoz.mjs");
var Route$1 = createFileRoute("/teacher")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./level._levelId-BaAWnaNQ.mjs");
var Route = createFileRoute("/level/$levelId")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$8.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$9
	}),
	ChestRoute: Route$7.update({
		id: "/chest",
		path: "/chest",
		getParentRoute: () => Route$9
	}),
	CodexRoute: Route$6.update({
		id: "/codex",
		path: "/codex",
		getParentRoute: () => Route$9
	}),
	FreeRoute: Route$5.update({
		id: "/free",
		path: "/free",
		getParentRoute: () => Route$9
	}),
	MapRoute: Route$4.update({
		id: "/map",
		path: "/map",
		getParentRoute: () => Route$9
	}),
	OnboardRoute: Route$3.update({
		id: "/onboard",
		path: "/onboard",
		getParentRoute: () => Route$9
	}),
	ParentRoute: Route$2.update({
		id: "/parent",
		path: "/parent",
		getParentRoute: () => Route$9
	}),
	TeacherRoute: Route$1.update({
		id: "/teacher",
		path: "/teacher",
		getParentRoute: () => Route$9
	}),
	LevelLevelIdRoute: Route.update({
		id: "/level/$levelId",
		path: "/level/$levelId",
		getParentRoute: () => Route$9
	})
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { useApp as a, CODEX as c, partnerById as d, LEVELS as f, PartnerPortrait as i, blockById as l, Route as n, cn as o, levelById as p, Fairy as r, uid as s, router_exports as t, PARTNERS as u };
