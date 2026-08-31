import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useApp, f as LEVELS } from "./router-BqNGgz6D.mjs";
import { n as StudentDock, t as StudentChrome } from "./StudentChrome-Dp4m-Bkq.mjs";
import { t as Button } from "./button-CfhSUvMi.mjs";
import { t as LevelStudio } from "./Editor-KG6B8JJm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/free-DTonmlZV.js
var import_jsx_runtime = require_jsx_runtime();
function FreePage() {
	const saveFree = useApp((s) => s.saveFree);
	const works = useApp((s) => s.freeWorks);
	const template = {
		...LEVELS[7],
		id: "free",
		name: "自由创作星球",
		mission: "没有影子，没有清单。全部已解锁积木开放。做出你的伙伴 2.0。",
		shadow: "S0"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-navy",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentChrome, { title: "自由创作星球" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 bg-foam px-4 py-2 text-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: "课后还能回来的地方。提交进班级创意广场。"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					tone: "mint",
					onClick: () => {
						const w = useApp.getState().works.free ?? { blocks: [] };
						saveFree("我的伙伴 2.0", w);
						toast("已提交创意广场 · 能量 +10");
					},
					children: "提交广场"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelStudio, {
				level: template,
				free: true
			}),
			works.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-cream px-4 py-3 text-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold text-ink-soft",
					children: "广场作品"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-1 text-sm",
					children: works.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-foam px-3 py-2",
						children: [
							w.title,
							" · ",
							w.work.blocks.length,
							" 块积木"
						]
					}, w.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentDock, { active: "free" })
		]
	});
}
//#endregion
export { FreePage as component };
