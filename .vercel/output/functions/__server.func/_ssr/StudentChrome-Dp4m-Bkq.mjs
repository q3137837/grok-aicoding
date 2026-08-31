import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Map, m as BookOpen, n as VolumeX, o as Sparkles, r as Volume2, t as WandSparkles } from "../_libs/lucide-react.mjs";
import { a as useApp, i as PartnerPortrait, o as cn } from "./router-BqNGgz6D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StudentChrome-Dp4m-Bkq.js
var import_jsx_runtime = require_jsx_runtime();
function StudentChrome({ title, backTo }) {
	const name = useApp((s) => s.studentName) || "实习驯养员";
	const partnerId = useApp((s) => s.partnerId) ?? "cat";
	const energy = useApp((s) => s.energy);
	const silent = useApp((s) => s.silentMode);
	const setSilent = useApp((s) => s.setSilent);
	const lit = useApp((s) => s.lit.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-navy/90 px-3 py-2.5 backdrop-blur-md md:px-5",
		children: [
			backTo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: backTo,
				className: "inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-white/10 px-3 text-sm font-semibold text-cream",
				children: "返回"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerPortrait, {
				id: partnerId,
				size: "sm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "truncate text-xs text-cream/60",
					children: [name, " · 星光驯养员"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hidden items-center gap-1 rounded-full bg-star/15 px-3 py-1.5 text-sm font-semibold text-star sm:inline-flex",
				children: ["点亮 ", lit]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1 rounded-full bg-coral/15 px-3 py-1.5 text-sm font-semibold text-coral",
				children: ["能量 ", energy]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10",
				onClick: () => setSilent(!silent),
				"aria-label": silent ? "打开声音" : "关闭声音",
				children: silent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-5 w-5" })
			})
		]
	});
}
function StudentDock({ active }) {
	const item = (to, key, label, Icon) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-xs font-semibold", active === key ? "bg-white/12 text-star" : "text-cream/70"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" }), label]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "sticky bottom-0 z-30 flex gap-1 border-t border-white/10 bg-navy/95 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]",
		children: [
			item("/map", "map", "星图", Map),
			item("/codex", "codex", "图鉴", BookOpen),
			item("/free", "free", "自由星", WandSparkles),
			item("/chest", "chest", "盲盒", Sparkles)
		]
	});
}
//#endregion
export { StudentDock as n, StudentChrome as t };
