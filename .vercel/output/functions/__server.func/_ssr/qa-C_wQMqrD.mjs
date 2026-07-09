import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as useProject } from "./project-context-CkM5ik6g.mjs";
import { t as PageHeader } from "./console-DdZ8SIgj.mjs";
import { N as CircleX, P as CircleCheck, i as TriangleAlert, r as User } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/qa-C_wQMqrD.js
var import_jsx_runtime = require_jsx_runtime();
function QaPage() {
	const { tasks, updateTask, getAnalytics } = useProject();
	const qaTasks = tasks.filter((t) => t.status === "qa" || t.qaStatus === "failed");
	const allAnalytics = {
		qaPassed: tasks.filter((t) => t.qaStatus === "passed").length,
		qaFailed: tasks.filter((t) => t.qaStatus === "failed").length,
		qaWaiting: tasks.filter((t) => t.status === "qa").length
	};
	function handlePass(taskId) {
		updateTask(taskId, {
			status: "done",
			qaStatus: "passed",
			completedAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
		});
	}
	function handleFail(taskId) {
		updateTask(taskId, {
			status: "doing",
			qaStatus: "failed"
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		crumbs: [{ label: "Task Tracker" }, { label: "QA Review" }],
		status: {
			label: `${qaTasks.length} pending review`,
			tone: qaTasks.length > 0 ? "info" : "success"
		}
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 overflow-y-auto p-6 space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-3 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-card border border-border rounded-md text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold text-success",
						children: allAnalytics.qaPassed
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-mono text-muted-foreground uppercase",
						children: "Passed"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-card border border-border rounded-md text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold text-destructive",
						children: allAnalytics.qaFailed
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-mono text-muted-foreground uppercase",
						children: "Failed"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-card border border-border rounded-md text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold text-warning",
						children: allAnalytics.qaWaiting
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-mono text-muted-foreground uppercase",
						children: "Waiting"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card border border-border rounded-lg p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4",
				children: "Waiting for QA"
			}), qaTasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-10 text-success mx-auto mb-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "All tasks are reviewed. Nothing waiting for QA."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: qaTasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-surface-2 border border-border rounded-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px] text-primary font-bold",
										children: t.taskId
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: t.title
									})]
								}), t.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-1",
									children: t.description
								})]
							}), t.qaStatus === "failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[10px] font-mono text-destructive bg-destructive/10 px-2 py-0.5 rounded shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3" }), "Rework"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 text-xs text-muted-foreground mb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-3" }), t.developer]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.category }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.field }),
								t.dueDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Due: ", t.dueDate] })
							]
						}),
						t.remarks && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-3 p-2 bg-card border border-border rounded text-xs text-muted-foreground",
							children: t.remarks
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [t.qaStatus !== "failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleFail(t.id),
								className: "px-4 py-2 bg-destructive/10 text-destructive text-xs font-bold rounded hover:bg-destructive/20 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5" }), "Fail — Back to Dev"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handlePass(t.id),
								className: "px-4 py-2 bg-success/10 text-success text-xs font-bold rounded hover:bg-success/20 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), "Pass — Done"]
							})]
						})
					]
				}, t.id))
			})]
		})]
	})] });
}
//#endregion
export { QaPage as component };
