import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useApp, i as PartnerPortrait, n as Route, o as cn, p as levelById } from "./router-BqNGgz6D.mjs";
import { t as StudentChrome } from "./StudentChrome-Dp4m-Bkq.mjs";
import { t as Button } from "./button-CfhSUvMi.mjs";
import { t as LevelStudio } from "./Editor-KG6B8JJm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/level._levelId-BaAWnaNQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Cutscene({ beats, partnerId, onDone }) {
	const [i, setI] = (0, import_react.useState)(0);
	const beat = beats[i];
	const onDoneRef = (0, import_react.useRef)(onDone);
	onDoneRef.current = onDone;
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => {
			if (i >= beats.length - 1) onDoneRef.current();
			else setI((x) => x + 1);
		}, 5200);
		return () => clearTimeout(t);
	}, [i, beats.length]);
	if (!beat) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-dvh w-full flex-col overflow-hidden bg-navy text-left",
		onClick: () => {
			if (i >= beats.length - 1) onDone();
			else setI((x) => x + 1);
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {
			scene: beat.scene,
			partnerId
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative z-10 mt-auto bg-gradient-to-t from-navy via-navy/90 to-transparent px-6 pb-10 pt-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.2em] text-star",
						children: "星语号"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-2xl font-semibold leading-snug text-cream md:text-3xl",
						children: beat.caption
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1.5",
							children: beats.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 rounded-full transition-all", idx === i ? "w-8 bg-coral" : "w-3 bg-white/25") }, idx))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							tone: "ghost",
							size: "sm",
							onClick: (e) => {
								e.stopPropagation();
								onDone();
							},
							children: "跳过"
						})]
					})
				]
			})
		})]
	});
}
function Scene({ scene, partnerId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: scene === "bridge" || scene === "night" || scene === "fire" || scene === "queue" ? "/scenes/rainbow.jpg" : scene === "ship" || scene === "door" || scene === "cape" ? "/scenes/hero.jpg" : "/scenes/echo.jpg",
				alt: "",
				className: "h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-navy/35" }),
			(scene === "fog" || scene === "wind") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(200,210,230,0.35),transparent)] opacity-80",
				style: { animation: "fog-drift 8s linear infinite" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-x-0 top-[18%] flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bob",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerPortrait, {
						id: partnerId,
						size: "xl",
						mood: scene === "beach" || scene === "tear" ? "sleep" : scene === "repeat" ? "confused" : scene === "badge" || scene === "equip" ? "hold-card" : scene === "feed" || scene === "album" ? "hold-box" : scene === "door" ? "look" : "idle"
					})
				})
			})
		]
	});
}
function LevelPage() {
	const { levelId } = Route.useParams();
	const level = (0, import_react.useMemo)(() => levelById(levelId), [levelId]);
	const partnerId = useApp((s) => s.partnerId) ?? "cat";
	const seen = useApp((s) => s.seenCutscene[levelId]);
	const mark = useApp((s) => s.markCutscene);
	const onboarded = useApp((s) => s.onboarded);
	const [playCut, setPlayCut] = (0, import_react.useState)(!seen);
	if (!level) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-navy",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/map",
			children: "关卡走丢了，回星图"
		})
	});
	if (!onboarded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-navy",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/onboard",
			children: "先选一只伙伴"
		})
	});
	if (playCut) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cutscene, {
		beats: level.cutscene,
		partnerId,
		onDone: () => {
			mark(level.id);
			setPlayCut(false);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-cream",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-navy",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentChrome, {
				title: `${level.id} ${level.name}`,
				backTo: "/map"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelStudio, { level })]
	});
}
//#endregion
export { LevelPage as component };
