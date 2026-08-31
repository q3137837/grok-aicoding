import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Lock, s as MonitorUp, u as LockOpen } from "../_libs/lucide-react.mjs";
import { a as useApp, f as LEVELS, i as PartnerPortrait, o as cn } from "./router-BqNGgz6D.mjs";
import { t as Button } from "./button-CfhSUvMi.mjs";
import { t as Starfield } from "./Starfield-H2Ub5STE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teacher-Doll0qoz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAMES = [
	"小米",
	"乐乐",
	"团团",
	"果果",
	"豆豆",
	"圆圆",
	"糖糖",
	"皮皮",
	"朵朵",
	"晨晨",
	"安安",
	"明明",
	"可可",
	"跳跳",
	"芽芽",
	"月亮",
	"阳光",
	"石头",
	"木木",
	"星河"
];
var PARTNER_CYCLE = [
	"cat",
	"dog",
	"rabbit",
	"parrot",
	"turtle",
	"owl"
];
var STATUSES = [
	"done",
	"active",
	"active",
	"idle",
	"stuck",
	"active",
	"done",
	"error",
	"active",
	"idle",
	"done",
	"active",
	"stuck",
	"active",
	"done",
	"idle",
	"active",
	"done",
	"active",
	"idle"
];
function seedClass(youName, youPartner) {
	return NAMES.map((name, i) => {
		const isYou = i === 0;
		return {
			id: isYou ? "you" : `stu-${i}`,
			name: isYou ? youName || "实习驯养员" : name,
			partnerId: isYou ? youPartner ?? "cat" : PARTNER_CYCLE[i % 6],
			blocks: isYou ? 4 : 2 + i * 3 % 8,
			status: isYou ? "active" : STATUSES[i],
			stars: isYou ? 0 : i % 4 === 0 ? 3 : i % 3,
			isYou
		};
	});
}
var CLASS_CODE = "8821";
function TeacherPage() {
	const name = useApp((s) => s.studentName) || "实习驯养员";
	const partnerId = useApp((s) => s.partnerId);
	const teacherName = useApp((s) => s.teacherName);
	const onboardTeacher = useApp((s) => s.onboardTeacher);
	const lesson = useApp((s) => s.currentLesson);
	const setLesson = useApp((s) => s.setLesson);
	const locked = useApp((s) => s.classLocked);
	const setLocked = useApp((s) => s.setLocked);
	const praise = useApp((s) => s.lightningPraise);
	const reset = useApp((s) => s.resetDemo);
	const enablePreviewAll = useApp((s) => s.enablePreviewAll);
	const [tname, setTname] = (0, import_react.useState)(teacherName);
	const [rows, setRows] = (0, import_react.useState)(() => seedClass(name, partnerId));
	const [selected, setSelected] = (0, import_react.useState)("you");
	(0, import_react.useEffect)(() => {
		onboardTeacher(tname || "王老师");
	}, [onboardTeacher, tname]);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => {
			setRows((rs) => rs.map((r) => {
				if (r.isYou) return {
					...r,
					name,
					partnerId: partnerId ?? r.partnerId
				};
				if (Math.random() > .72) return r;
				const cycle = [
					"active",
					"idle",
					"active",
					"done",
					"stuck"
				];
				return {
					...r,
					status: r.status === "error" ? "error" : cycle[Math.floor(Math.random() * cycle.length)],
					blocks: Math.min(12, r.blocks + (Math.random() > .5 ? 1 : 0))
				};
			}));
		}, 3200);
		return () => clearInterval(t);
	}, [name, partnerId]);
	const done = rows.filter((r) => r.status === "done").length;
	const stuck = rows.filter((r) => r.status === "stuck" || r.status === "error");
	const selectedRow = rows.find((r) => r.id === selected) ?? rows[0];
	const pools = (0, import_react.useMemo)(() => [
		{
			name: "A 组 · 主 Key 池",
			used: 2,
			cap: 3,
			fail: 0
		},
		{
			name: "B 组 · 备用 Key",
			used: 1,
			cap: 3,
			fail: 1
		},
		{
			name: "C 组 · 削峰队列",
			used: 3,
			cap: 3,
			fail: 0
		},
		{
			name: "D 组 · 离线演示",
			used: 0,
			cap: 3,
			fail: 0
		}
	], []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-navy text-cream",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Starfield, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-6xl px-4 py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-[0.2em] text-star",
								children: "老师控制台"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-2xl font-semibold",
								children: ["一键上课 · ", tname]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: tname,
							onChange: (e) => setTname(e.target.value),
							className: "h-11 w-32 rounded-full bg-white/10 px-4 text-sm outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "text-sm text-cream/60",
							children: "回首页"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[28px] bg-white/8 p-5 ring-1 ring-white/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-cream/50",
									children: "课堂码"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-4xl font-semibold tracking-[0.2em]",
									children: CLASS_CODE
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ml-auto text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-cream/50",
										children: "全班进度"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-lg font-semibold",
										children: [
											done,
											"/",
											rows.length,
											" 已提交"
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 h-3 overflow-hidden rounded-full bg-white/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-mint",
									style: { width: `${done / rows.length * 100}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: LEVELS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setLesson(l.id),
									className: cn("rounded-full px-3 py-1.5 text-xs font-semibold", lesson === l.id ? "bg-coral text-navy" : "bg-white/10"),
									children: [
										l.id,
										" ",
										l.name
									]
								}, l.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										tone: locked ? "mint" : "star",
										size: "sm",
										onClick: () => setLocked(!locked),
										children: [locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), locked ? "解锁抬头" : "暂停锁屏"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										tone: "coral",
										size: "sm",
										onClick: () => praise(selectedRow.name),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorUp, { className: "h-4 w-4" }), "闪电点赞上大屏"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										tone: "ghost",
										size: "sm",
										onClick: enablePreviewAll,
										children: "为学生解锁全关"
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[28px] bg-white/8 p-5 ring-1 ring-white/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: "API 分组池水位"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-3",
								children: pools.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums",
										children: [
											p.used,
											"/",
											p.cap,
											p.fail ? ` · 失败 ${p.fail}` : ""
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 h-2 overflow-hidden rounded-full bg-white/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("h-full", p.used >= p.cap ? "bg-coral" : "bg-mint"),
										style: { width: `${p.used / p.cap * 100}%` }
									})
								})] }, p.name))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-xs text-cream/50",
								children: "失败自动切备用 Key。全班故障可一键离线演示。"
							})
						]
					})]
				}),
				stuck.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-2xl bg-coral/15 px-4 py-3 text-sm",
					children: [
						"智能呼叫 · ",
						stuck.length,
						" 人待协助：",
						stuck.map((s) => s.name).join("、")
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm font-semibold",
						children: "座位网格 · 心跳"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-4 gap-2 sm:grid-cols-5",
						children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSelected(r.id),
							className: cn("rounded-2xl bg-white/6 p-2 text-left ring-2", selected === r.id ? "ring-coral" : "ring-transparent", r.status === "stuck" && "ring-star", r.status === "error" && "ring-display"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerPortrait, {
									id: r.partnerId,
									size: "sm"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-xs font-semibold",
										children: [r.name, r.isYou ? " ·你" : ""]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-cream/50",
										children: [
											label(r.status),
											" · ",
											r.blocks,
											" 块"
										]
									})]
								})]
							})
						}, r.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 rounded-[28px] bg-white/8 p-5 ring-1 ring-white/10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-semibold",
							children: ["正在看 · ", selectedRow.name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-cream/60",
							children: [
								"积木 ",
								selectedRow.blocks,
								" · 星 ",
								selectedRow.stars,
								" · ",
								label(selectedRow.status)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => praise(selectedRow.name),
								children: "上大屏表扬"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								tone: "ghost",
								children: selectedRow.status === "stuck" ? "去协助" : "实时预览"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex gap-3 pb-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						tone: "ghost",
						size: "sm",
						onClick: reset,
						children: "重置演示数据"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-cream/40",
						children: "不收集手机号。学生用姓名 + 课堂码进场。"
					})]
				})
			]
		})]
	});
}
function label(s) {
	return {
		idle: "闲置",
		active: "创作中",
		stuck: "卡住",
		error: "AI 打瞌睡",
		done: "已提交"
	}[s];
}
//#endregion
export { TeacherPage as component };
