import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useApp, i as PartnerPortrait, o as cn, u as PARTNERS } from "./router-BqNGgz6D.mjs";
import { t as Button } from "./button-CfhSUvMi.mjs";
import { t as Starfield } from "./Starfield-H2Ub5STE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboard-xb1j17Ah.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Onboard() {
	const nav = useNavigate();
	const onboardStudent = useApp((s) => s.onboardStudent);
	const [name, setName] = (0, import_react.useState)(useApp.getState().studentName || "");
	const [pid, setPid] = (0, import_react.useState)(useApp.getState().partnerId);
	const [code, setCode] = (0, import_react.useState)("8821");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Starfield, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-3xl px-5 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.2em] text-star",
					children: "开课六选一"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-3xl font-semibold",
					children: "选一只伙伴，贯穿八课"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-cream/70",
					children: "伙伴是被营救的同学，不是工具。它会说话，有脾气，有本领。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mt-8 block text-sm font-semibold text-cream/80",
					children: "你的名字"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					maxLength: 6,
					onChange: (e) => setName(e.target.value),
					placeholder: "两个字就好",
					className: "mt-2 h-14 w-full rounded-2xl bg-white/10 px-4 text-lg outline-none ring-1 ring-white/10 placeholder:text-cream/35"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mt-6 block text-sm font-semibold text-cream/80",
					children: "课堂码"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: code,
					maxLength: 8,
					onChange: (e) => setCode(e.target.value),
					className: "mt-2 h-12 w-40 rounded-2xl bg-white/10 px-4 font-semibold tracking-[0.3em] outline-none ring-1 ring-white/10"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3",
					children: PARTNERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setPid(p.id),
						className: cn("rounded-[24px] bg-white/8 p-4 text-left ring-2 transition", pid === p.id ? "ring-coral bg-white/14" : "ring-transparent"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerPortrait, {
								id: p.id,
								size: "md"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-semibold",
								children: [
									p.title,
									"·",
									p.name
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-cream/60",
								children: p.catchphrase
							})
						]
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-8 w-full",
					size: "lg",
					disabled: !name.trim() || !pid,
					onClick: () => {
						if (!pid) return;
						onboardStudent(name.trim(), pid);
						nav({ to: "/map" });
					},
					children: "登岛 · 开始营救"
				})
			]
		})]
	});
}
//#endregion
export { Onboard as component };
