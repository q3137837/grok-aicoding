import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useApp } from "./router-BqNGgz6D.mjs";
import { n as StudentDock, t as StudentChrome } from "./StudentChrome-Dp4m-Bkq.mjs";
import { t as Button } from "./button-CfhSUvMi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chest-B97rIgKH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChestPage() {
	const energy = useApp((s) => s.energy);
	const pull = useApp((s) => s.pullGacha);
	const cosmetics = useApp((s) => s.cosmetics);
	const pity = useApp((s) => s.gachaPity);
	const [last, setLast] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-navy",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentChrome, { title: "许愿开盒" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-lg flex-1 flex-col items-center px-5 py-8 pb-24 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/scenes/chest.jpg",
						alt: "百宝箱",
						className: `h-56 w-56 rounded-[32px] object-cover ${open ? "jelly" : "bob"}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-cream/70",
						children: "40 能量开一次。连续 3 次落空，第 4 次必出稀有。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-star",
						children: [
							"当前能量 ",
							energy,
							" · 保底进度 ",
							pity,
							"/4"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-6",
						size: "lg",
						disabled: energy < 40,
						onClick: () => {
							const r = pull();
							if (!r) {
								toast("能量不够哦");
								return;
							}
							setLast(r);
							setOpen(true);
							toast(r.rare ? `稀有！${r.item}` : r.item);
						},
						children: "许愿开盒"
					}),
					last && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 rounded-[24px] bg-white/10 px-6 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-star",
								children: last.rare ? "稀有" : "普通"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-semibold",
								children: last.item
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-cream/50",
								children: "装饰与卡面收藏，不会直接点亮图鉴。"
							})
						]
					}),
					cosmetics.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 w-full space-y-1 text-left text-sm text-cream/80",
						children: cosmetics.slice().reverse().map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-xl bg-white/5 px-3 py-2",
							children: c
						}, `${c}-${i}`))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentDock, { active: "chest" })
		]
	});
}
//#endregion
export { ChestPage as component };
