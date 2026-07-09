import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/console-DdZ8SIgj.js
var import_jsx_runtime = require_jsx_runtime();
function PageHeader({ crumbs, status, actions }) {
	const toneClass = status?.tone === "warn" ? "bg-warning/10 text-warning border-warning/20" : status?.tone === "info" ? "bg-info/10 text-info border-info/20" : "bg-success/10 text-success border-success/20";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "h-14 shrink-0 flex items-center justify-between px-6 border-b border-border bg-surface/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-sm min-w-0",
			children: [crumbs.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2 min-w-0",
				children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground/40",
					children: "/"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: c.muted || i < crumbs.length - 1 ? "text-muted-foreground truncate" : "font-medium truncate",
					children: c.label
				})]
			}, i)), status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `ml-3 px-2 py-0.5 text-[10px] font-mono uppercase border ${toneClass}`,
				children: status.label
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-3",
			children: actions
		})]
	});
}
//#endregion
export { PageHeader as t };
