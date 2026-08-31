import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useApp, c as CODEX, o as cn } from "./router-BqNGgz6D.mjs";
import { n as StudentDock, t as StudentChrome } from "./StudentChrome-Dp4m-Bkq.mjs";
import { t as PedIcon } from "./PedIcons-O0pIMFRf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/codex-C6z8O5eI.js
var import_jsx_runtime = require_jsx_runtime();
function CodexPage() {
	const collected = useApp((s) => s.collected);
	const lit = useApp((s) => s.lit);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-navy",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentChrome, { title: "冒险图鉴" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-3xl flex-1 px-4 py-6 pb-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-cream/70",
						children: "抽到卡 = 收藏。点亮卡 = 学会。图鉴按点亮数计算，集齐就是学会。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-star",
						children: [
							"点亮 ",
							lit.length,
							" / ",
							CODEX.length
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 grid gap-3 sm:grid-cols-2",
						children: CODEX.map((c) => {
							const got = collected.includes(c.id);
							const on = lit.includes(c.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
								className: cn("rounded-[24px] p-4 ring-1 ring-white/10", on ? "bg-white/12" : got ? "bg-white/6" : "bg-white/3 opacity-70"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PedIcon, {
										name: iconOf(c.id),
										className: cn(!on && "grayscale")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-cream/50",
											children: c.lesson
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-semibold",
											children: got ? c.name : "????"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-star",
											children: on ? c.motto : got ? "灰面 · 待点亮" : "未抽到"
										}),
										on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm text-cream/70",
											children: c.desc
										})
									] })]
								})
							}, c.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentDock, { active: "codex" })
		]
	});
}
function iconOf(id) {
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
//#endregion
export { CodexPage as component };
