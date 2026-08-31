import { v as Link, x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Lock } from "../_libs/lucide-react.mjs";
import { a as useApp, f as LEVELS, i as PartnerPortrait, o as cn } from "./router-BqNGgz6D.mjs";
import { n as StudentDock, t as StudentChrome } from "./StudentChrome-Dp4m-Bkq.mjs";
import { t as Starfield } from "./Starfield-H2Ub5STE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-B-Zw5oMo.js
var import_jsx_runtime = require_jsx_runtime();
function MapPage() {
	const nav = useNavigate();
	const onboarded = useApp((s) => s.onboarded);
	const partnerId = useApp((s) => s.partnerId) ?? "cat";
	const unlocked = useApp((s) => s.unlocked);
	const previewAll = useApp((s) => s.previewAll);
	const stars = useApp((s) => s.stars);
	const current = useApp((s) => s.currentLesson);
	if (!onboarded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-navy",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/onboard",
			className: "text-coral",
			children: "先选一只伙伴"
		})
	});
	const ch1 = LEVELS.filter((l) => l.chapter === 1);
	const ch2 = LEVELS.filter((l) => l.chapter === 2);
	const ch1done = ch1.every((l) => (stars[l.id] ?? 0) >= 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-navy",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentChrome, { title: "星空闯关地图" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Starfield, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-4xl space-y-8 px-4 py-6 pb-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Island, {
							title: "第 1 章 · 回声岛",
							subtitle: "找回声音与记忆",
							img: "/scenes/echo.jpg",
							done: ch1done,
							children: ch1.map((l) => {
								const open = previewAll || unlocked.includes(l.id);
								const st = stars[l.id] ?? 0;
								const pulse = current === l.id && open && st === 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
									open,
									stars: st,
									pulse,
									name: `${l.id} ${l.name}`,
									onClick: () => open && nav({
										to: "/level/$levelId",
										params: { levelId: l.id }
									})
								}, l.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Island, {
							title: "第 2 章 · 彩虹环带",
							subtitle: "找回本领",
							img: "/scenes/rainbow.jpg",
							done: ch2.every((l) => (stars[l.id] ?? 0) >= 1),
							children: ch2.map((l) => {
								const open = previewAll || unlocked.includes(l.id);
								const st = stars[l.id] ?? 0;
								const pulse = current === l.id && open && st === 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
									open,
									stars: st,
									pulse,
									name: `${l.id} ${l.name}`,
									onClick: () => open && nav({
										to: "/level/$levelId",
										params: { levelId: l.id }
									})
								}, l.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerPortrait, {
								id: partnerId,
								size: "sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-cream/70",
								children: "驾小艇登岛。通关一章，全岛点亮一次环岛烟花。"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentDock, { active: "map" })
		]
	});
}
function Island({ title, subtitle, img, done, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "overflow-hidden rounded-[28px] ring-1 ring-white/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-36 md:h-44",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: img,
					alt: "",
					className: "h-full w-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-3 left-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-semibold",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-cream/70",
						children: subtitle
					})]
				}),
				done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute right-3 top-3 rounded-full bg-star px-3 py-1 text-xs font-bold text-navy",
					children: "环岛烟花"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 bg-navy-2 p-4 md:grid-cols-4",
			children
		})]
	});
}
function Node({ open, stars, pulse, name, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		disabled: !open,
		className: cn("rounded-2xl p-3 text-left ring-1 ring-white/10", open ? "bg-white/8" : "bg-white/4 text-cream/40", pulse && "breathe"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-star",
				children: [stars, "/3 星"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-fog" }), stars >= 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] text-mint",
				children: "彩旗"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm font-semibold leading-snug",
			children: name
		})]
	});
}
//#endregion
export { MapPage as component };
