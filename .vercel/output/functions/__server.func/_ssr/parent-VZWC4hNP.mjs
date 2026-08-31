import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useApp, c as CODEX, f as LEVELS, i as PartnerPortrait } from "./router-BqNGgz6D.mjs";
import { t as Button } from "./button-CfhSUvMi.mjs";
import { t as PedIcon } from "./PedIcons-O0pIMFRf.mjs";
import { t as Starfield } from "./Starfield-H2Ub5STE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parent-VZWC4hNP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ParentPage() {
	const bound = useApp((s) => s.parentBound);
	const bind = useApp((s) => s.bindParent);
	const familyCode = useApp((s) => s.familyCode);
	const name = useApp((s) => s.studentName) || "孩子";
	const partnerId = useApp((s) => s.partnerId) ?? "cat";
	const lit = useApp((s) => s.lit);
	const stars = useApp((s) => s.stars);
	const energy = useApp((s) => s.energy);
	const [code, setCode] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("week");
	const [err, setErr] = (0, import_react.useState)("");
	if (!bound) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative grid min-h-dvh place-items-center px-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Starfield, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-sm rounded-[28px] bg-cream p-6 text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold text-coral",
					children: "家长端 · 零注册"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-semibold",
					children: "输入 4 位家庭码"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-ink-soft",
					children: "孩子在学生端把码报给你。不收集手机号。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: code,
					onChange: (e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4)),
					inputMode: "numeric",
					className: "mt-5 h-16 w-full rounded-2xl bg-foam text-center text-3xl tracking-[0.4em] outline-none",
					placeholder: "8821"
				}),
				err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-display",
					children: err
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-5 w-full",
					onClick: () => {
						if (!bind(code || "8821")) setErr("码不对。问问孩子，或先用 8821 看演示。");
					},
					children: "绑定"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-center text-xs text-ink-soft",
					children: ["演示码 8821 · 当前学生码 ", familyCode || "尚未开课"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-4 block text-center text-sm text-coral",
					children: "回首页"
				})
			]
		})]
	});
	const starSum = Object.values(stars).reduce((a, b) => a + b, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh bg-cream text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "bg-navy px-5 py-6 text-cream",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.2em] text-star",
						children: "成长周报"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerPortrait, {
							id: partnerId,
							size: "sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-semibold",
							children: name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-cream/60",
							children: ["家庭码 ", familyCode || "8821"]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-3 gap-2 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								n: starSum,
								label: "本周星星"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								n: lit.length,
								label: "点亮知识卡"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								n: energy,
								label: "能量"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex gap-1 bg-foam px-3 py-2",
				children: [
					["week", "周报"],
					["work", "作品"],
					["box", "亲子开盒"],
					["poster", "换卡海报"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: `flex-1 rounded-full py-2 text-sm font-semibold ${tab === id ? "bg-coral text-navy" : "text-ink-soft"}`,
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-lg px-5 py-6",
				children: [
					tab === "week" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ink-soft",
						children: "图鉴点亮 = 真实掌握。不是抽到就算学会。"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2",
						children: CODEX.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 rounded-2xl bg-foam px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PedIcon, {
								name: c.id === "skill" ? "skill" : c.id === "rag" ? "rag" : "persona",
								className: "h-10 w-10"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-ink-soft",
									children: lit.includes(c.id) ? "已点亮" : "尚未点亮"
								})]
							})]
						}, c.id))
					})] }),
					tab === "work" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ink-soft",
						children: "孩子最新关卡进度，可在课堂里运行。"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2",
						children: LEVELS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-2xl bg-foam px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold",
								children: [
									l.id,
									" ",
									l.name
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-ink-soft",
								children: [stars[l.id] ?? 0, " / 3 星"]
							})]
						}, l.id))
					})] }),
					tab === "box" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/scenes/chest.jpg",
								alt: "",
								className: "mx-auto h-40 w-40 rounded-3xl object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm text-ink-soft",
								children: "每日 1 次免费同步开盒。奖的是装饰，点亮仍要通关。"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-4",
								children: "和孩子一起开"
							})
						]
					}),
					tab === "poster" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[24px] bg-navy p-5 text-center text-cream",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-star",
								children: "换卡海报"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xl font-semibold",
								children: [name, " 的图鉴"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-cream/60",
								children: [
									"点亮 ",
									lit.length,
									" 张 · 还缺 ",
									CODEX.length - lit.length,
									" 张"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 grid grid-cols-3 gap-2",
								children: CODEX.slice(0, 6).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl bg-white/10 py-4 text-xs",
									children: lit.includes(c.id) ? c.motto.slice(0, 4) : "缺"
								}, c.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "mt-8 block text-center text-sm text-coral",
						children: "回首页"
					})
				]
			})
		]
	});
}
function Stat({ n, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-white/8 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-2xl font-semibold tabular-nums",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-cream/60",
			children: label
		})]
	});
}
//#endregion
export { ParentPage as component };
