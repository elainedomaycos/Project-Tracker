import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as useProject } from "./project-context-CkM5ik6g.mjs";
import { t as PageHeader } from "./console-DdZ8SIgj.mjs";
import { C as FileCheck, L as Calendar, M as Circle, P as CircleCheck, b as FlaskConical, j as Clock, p as LoaderCircle, r as User, u as ScrollText, x as Flag } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-DJFDo5Ev.js
var import_jsx_runtime = require_jsx_runtime();
var PRIORITY_COLORS = {
	critical: "text-red-500",
	high: "text-orange-500",
	medium: "text-yellow-500",
	low: "text-muted-foreground"
};
function StatusIcon({ status }) {
	if (status === "done") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-success" });
	if (status === "qa") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "size-4 text-info" });
	if (status === "doing") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 text-warning" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-4 text-muted-foreground" });
}
function getProjectHealth(pct) {
	if (pct >= 70) return {
		label: "On Track",
		color: "text-success",
		bg: "bg-success/10 border-success/20"
	};
	if (pct >= 40) return {
		label: "At Risk",
		color: "text-warning",
		bg: "bg-warning/10 border-warning/20"
	};
	return {
		label: "Behind",
		color: "text-destructive",
		bg: "bg-destructive/10 border-destructive/20"
	};
}
function ProgressRing({ pct, size = 100, strokeWidth = 6 }) {
	const r = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * r;
	const offset = circumference - pct / 100 * circumference;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: size,
		height: size,
		className: "shrink-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r,
				fill: "none",
				stroke: "currentColor",
				strokeWidth,
				className: "text-white/5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r,
				fill: "none",
				stroke: "currentColor",
				strokeWidth,
				strokeDasharray: circumference,
				strokeDashoffset: offset,
				strokeLinecap: "round",
				className: "text-primary transition-all duration-700",
				transform: `rotate(-90 ${size / 2} ${size / 2})`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: "50%",
				y: "50%",
				dominantBaseline: "central",
				textAnchor: "middle",
				className: "fill-primary text-lg font-bold",
				fontSize: size * .22,
				children: [pct, "%"]
			})
		]
	});
}
function ClientPage() {
	const { projects, tasks, getAnalytics } = useProject();
	const totalStats = projects.reduce((acc, p) => {
		const a = getAnalytics(p.id);
		return {
			total: acc.total + a.total,
			done: acc.done + a.done,
			doing: acc.doing + a.doing,
			qa: acc.qa + a.qa,
			pending: acc.pending + a.pending
		};
	}, {
		total: 0,
		done: 0,
		doing: 0,
		qa: 0,
		pending: 0
	});
	if (projects.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, { crumbs: [{ label: "Task Tracker" }, { label: "Client Portal" }] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex-1 grid place-items-center p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "size-16 rounded-full bg-surface-2 border border-border grid place-items-center mx-auto text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "size-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No projects available yet."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-mono text-muted-foreground",
					children: "Projects will appear here once created by the project manager."
				})
			]
		})
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		crumbs: [{ label: "Task Tracker" }, { label: "Client Portal" }],
		status: {
			label: `${projects.length} project${projects.length > 1 ? "s" : ""} · ${totalStats.done}/${totalStats.total} tasks done`,
			tone: "info"
		}
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 overflow-y-auto p-6 space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 md:grid-cols-5 gap-3",
			children: [
				{
					label: "Total Tasks",
					value: totalStats.total,
					icon: ScrollText,
					color: "text-primary"
				},
				{
					label: "Completed",
					value: totalStats.done,
					icon: CircleCheck,
					color: "text-success"
				},
				{
					label: "In Progress",
					value: totalStats.doing,
					icon: LoaderCircle,
					color: "text-warning"
				},
				{
					label: "In Testing",
					value: totalStats.qa,
					icon: FlaskConical,
					color: "text-info"
				},
				{
					label: "Pending",
					value: totalStats.pending,
					icon: Circle,
					color: "text-muted-foreground"
				}
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card border border-border rounded-lg p-4 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "size-9 rounded-lg bg-surface-2 grid place-items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: `size-4 ${s.color}` })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-lg font-bold",
					children: s.value
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[9px] font-mono text-muted-foreground uppercase",
					children: s.label
				})] })]
			}, s.label))
		}), projects.map((p) => {
			const a = getAnalytics(p.id);
			const health = getProjectHealth(a.overallProgress);
			const recentInProgress = tasks.filter((t) => t.projectId === p.id).filter((t) => t.status !== "done").sort((a, b) => (b.dueDate || "").localeCompare(a.dueDate || "")).slice(0, 4);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card border border-border rounded-xl overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-6 py-5 border-b border-border flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-12 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center text-primary font-bold text-lg",
							children: p.prefix
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[9px] font-mono px-2 py-0.5 rounded-full border ${health.bg} ${health.color}`,
								children: health.label
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] font-mono text-muted-foreground mt-0.5",
							children: [
								"Created ",
								new Date(p.createdAt).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric"
								}),
								" · ",
								a.total,
								" task",
								a.total !== 1 ? "s" : ""
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressRing, {
						pct: a.overallProgress,
						size: 72,
						strokeWidth: 5
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 md:grid-cols-4 gap-3",
							children: [
								{
									label: "Done",
									value: a.done,
									total: a.total,
									color: "text-success",
									bg: "bg-success/5 border-success/20"
								},
								{
									label: "Testing",
									value: a.qa,
									total: a.total,
									color: "text-info",
									bg: "bg-info/5 border-info/20"
								},
								{
									label: "In Progress",
									value: a.doing,
									total: a.total,
									color: "text-warning",
									bg: "bg-warning/5 border-warning/20"
								},
								{
									label: "Pending",
									value: a.pending,
									total: a.total,
									color: "text-muted-foreground",
									bg: "bg-surface-2 border-border"
								}
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `rounded-lg border p-4 ${s.bg}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-2xl font-bold ${s.color}`,
											children: s.value
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-mono text-muted-foreground",
											children: [s.total > 0 ? Math.round(s.value / s.total * 100) : 0, "%"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-mono text-muted-foreground uppercase",
										children: s.label
									}),
									s.total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `h-full rounded-full ${s.color.replace("text-", "bg-")}`,
											style: { width: `${s.value / s.total * 100}%` }
										})
									})
								]
							}, s.label))
						}),
						a.categoryProgress.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "size-3" }), "Module Progress"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-3",
							children: a.categoryProgress.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-surface-2 border border-border rounded-lg p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium",
											children: cat.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [
												cat.done,
												"/",
												cat.total,
												" tasks"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-2 bg-white/5 rounded-full overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `h-full rounded-full transition-all ${cat.pct >= 80 ? "bg-success" : cat.pct >= 50 ? "bg-warning" : "bg-destructive"}`,
											style: { width: `${cat.pct}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mt-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `text-[10px] font-mono font-bold ${cat.pct >= 80 ? "text-success" : cat.pct >= 50 ? "text-warning" : "text-destructive"}`,
												children: [cat.pct, "%"]
											}),
											cat.pct >= 80 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3 text-success" }),
											cat.pct > 0 && cat.pct < 80 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 text-warning" }),
											cat.pct === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-3 text-muted-foreground" })
										]
									})
								]
							}, cat.name))
						})] }),
						recentInProgress.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), "Active Tasks"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border border border-border rounded-lg overflow-hidden",
							children: recentInProgress.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 px-4 py-3 bg-card hover:bg-surface-2 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusIcon, { status: t.status }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium truncate",
											children: t.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] font-mono text-muted-foreground flex items-center gap-2 mt-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.taskId }), t.developer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-3" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.developer })
											] })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-[10px] font-mono text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: `size-3 ${PRIORITY_COLORS[t.priority] || ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: t.priority === "critical" || t.priority === "high" ? "text-warning" : "",
											children: t.priority
										})]
									}),
									t.dueDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 text-[10px] font-mono text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(t.dueDate).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric"
										}) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] font-mono px-2 py-0.5 rounded-full ${t.status === "doing" ? "bg-warning/10 text-warning" : t.status === "qa" ? "bg-info/10 text-info" : "bg-muted/10 text-muted-foreground"}`,
										children: t.status === "doing" ? "In Progress" : t.status === "qa" ? "Testing" : "Pending"
									})
								]
							}, t.id))
						})] }),
						a.total === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center py-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-12 rounded-full bg-surface-2 border border-border grid place-items-center mx-auto text-muted-foreground mb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "size-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "No tasks yet for this project."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-mono text-muted-foreground mt-1",
									children: "Tasks will appear here once assigned by the project manager."
								})
							]
						})
					]
				})]
			}, p.id);
		})]
	})] });
}
//#endregion
export { ClientPage as component };
