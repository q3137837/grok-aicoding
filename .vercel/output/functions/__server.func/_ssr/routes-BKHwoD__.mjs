import { x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as Heart, f as GraduationCap, m as BookOpen, o as Sparkles } from "../_libs/lucide-react.mjs";
import { a as useApp, i as PartnerPortrait } from "./router-BqNGgz6D.mjs";
import { t as Button } from "./button-CfhSUvMi.mjs";
import { t as Starfield } from "./Starfield-H2Ub5STE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BKHwoD__.js
var import_jsx_runtime = require_jsx_runtime();
var SIX = [
	"cat",
	"dog",
	"rabbit",
	"parrot",
	"turtle",
	"owl"
];
function Home() {
	const nav = useNavigate();
	const hydrated = useApp((s) => s.hydrated);
	const onboarded = useApp((s) => s.onboarded);
	const role = useApp((s) => s.role);
	const enablePreviewAll = useApp((s) => s.enablePreviewAll);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative grid min-h-dvh place-items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Starfield, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "relative text-cream/80",
			children: "星语号正在靠岸…"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Starfield, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto flex min-h-dvh max-w-5xl flex-col px-5 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.28em] text-star",
					children: "STAR WHISPER · AGENT 课堂"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-4xl font-semibold leading-tight text-cream md:text-6xl",
					children: "星语号"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-md text-lg text-cream/75",
					children: "灰雾偷走了声音、记忆和本领。你是星光驯养员。搭一个会说话的伙伴，把它唤醒。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/scenes/hero.jpg",
						alt: "星语号驶过灰雾",
						className: "h-48 w-full object-cover md:h-72"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 flex justify-center gap-3",
					children: SIX.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerPortrait, {
						id,
						size: "sm"
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" }),
							title: "我是驯养员",
							desc: "选一只星灵，从第一课唤醒它。",
							onClick: () => nav({ to: onboarded && role === "student" ? "/map" : "/onboard" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-5 w-5" }),
							title: "我是老师",
							desc: "一键上课、心跳网格、闪电点赞。",
							onClick: () => nav({ to: "/teacher" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-5 w-5" }),
							title: "我是家长",
							desc: "家庭码绑定，看作品和图鉴点亮。",
							onClick: () => nav({ to: "/parent" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						tone: "star",
						onClick: () => {
							enablePreviewAll();
							nav({ to: "/map" });
						},
						children: "校长预览 · 打开全部关卡"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "inline-flex items-center gap-2 text-sm text-cream/70",
						onClick: () => nav({ to: "/codex" }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4" }), "先看图鉴"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-auto pt-10 text-xs text-cream/45",
					children: "给 6–12 岁的 Agent 原生课堂 · 角色卡 / 百宝箱 / 技能 · 不是带 AI 积木的 Scratch"
				})
			]
		})]
	});
}
function RoleCard({ icon, title, desc, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "rounded-[24px] bg-white/8 p-5 text-left ring-1 ring-white/10 transition hover:bg-white/12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-coral/20 text-coral",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-lg font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-cream/65",
				children: desc
			})
		]
	});
}
//#endregion
export { Home as component };
