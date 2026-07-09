import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as useProject } from "./project-context-CkM5ik6g.mjs";
import { t as PageHeader } from "./console-DdZ8SIgj.mjs";
import { B as ArrowRight, P as CircleCheck, i as TriangleAlert, j as Clock, m as ListChecks } from "../_libs/lucide-react.mjs";
import { a as Bar, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as Pie, r as YAxis, s as Cell, t as PieChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DWMSsqCp.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS_COLORS = {
	pending: "#888",
	doing: "#eab308",
	qa: "#3b82f6",
	done: "#22c55e"
};
var STATUS_LABELS = {
	pending: "Pending",
	doing: "Doing",
	qa: "QA",
	done: "Done"
};
function Dashboard() {
	const navigate = useNavigate();
	const { projects, tasks, currentProject, getAnalytics } = useProject();
	const totalTasks = tasks.length;
	const totalDone = tasks.filter((t) => t.status === "done").length;
	const overdue = tasks.filter((t) => t.dueDate && t.dueDate < (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) && t.status !== "done").length;
	const statusData = [
		"pending",
		"doing",
		"qa",
		"done"
	].map((s) => ({
		name: STATUS_LABELS[s],
		value: tasks.filter((t) => t.status === s).length,
		color: STATUS_COLORS[s]
	}));
	const devMap = /* @__PURE__ */ new Map();
	tasks.forEach((t) => {
		if (!t.developer) return;
		const e = devMap.get(t.developer) ?? {
			done: 0,
			total: 0
		};
		e.total++;
		if (t.status === "done") e.done++;
		devMap.set(t.developer, e);
	});
	const devData = Array.from(devMap.entries()).map(([name, d]) => ({
		name,
		done: d.done,
		pending: d.total - d.done
	}));
	const recentTasks = [...tasks].filter((t) => t.status !== "done").sort((a, b) => {
		const dateA = a.startDate || a.dueDate || "";
		return (b.startDate || b.dueDate || "").localeCompare(dateA);
	}).slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		crumbs: [{ label: "Task Tracker" }, { label: "Dashboard" }],
		status: {
			label: `${totalTasks} tasks · ${overdue} overdue`,
			tone: overdue > 0 ? "warn" : "info"
		}
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 overflow-y-auto p-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 bg-card border border-border rounded-md",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-9 rounded-md bg-surface-2 grid place-items-center text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-mono text-muted-foreground uppercase",
								children: "All Tasks"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xl font-bold",
								children: totalTasks
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 bg-card border border-border rounded-md",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-9 rounded-md bg-surface-2 grid place-items-center text-success",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-mono text-muted-foreground uppercase",
								children: "Done"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xl font-bold text-success",
								children: totalDone
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 bg-card border border-border rounded-md",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-9 rounded-md bg-surface-2 grid place-items-center text-warning",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-mono text-muted-foreground uppercase",
								children: "In Progress"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xl font-bold text-warning",
								children: tasks.filter((t) => t.status === "doing").length
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 bg-card border border-border rounded-md",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-9 rounded-md bg-surface-2 grid place-items-center text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-mono text-muted-foreground uppercase",
								children: "Overdue"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xl font-bold text-destructive",
								children: overdue > 0 ? overdue : 0
							})] })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-lg p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4",
						children: "Task Status"
					}), totalTasks === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground text-center py-8",
						children: "No data yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: 180,
							height: 180,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: statusData,
								cx: "50%",
								cy: "50%",
								innerRadius: 50,
								outerRadius: 80,
								paddingAngle: 3,
								dataKey: "value",
								children: statusData.map((entry, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									fill: entry.color,
									stroke: "transparent"
								}, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "#1a1a2e",
								border: "1px solid #2a2a4e",
								borderRadius: "6px",
								fontSize: "12px"
							} })] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: statusData.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-2.5 rounded-full",
										style: { background: s.color }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground w-14",
										children: s.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold",
										children: s.value
									})
								]
							}, s.name))
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-lg p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4",
						children: "Developer Progress"
					}), devData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground text-center py-8",
						children: "No developer data yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 200,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: devData,
							barGap: 2,
							barCategoryGap: "20%",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									tick: {
										fontSize: 10,
										fill: "#888"
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: {
										fontSize: 10,
										fill: "#888"
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "#1a1a2e",
									border: "1px solid #2a2a4e",
									borderRadius: "6px",
									fontSize: "12px"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "done",
									name: "Done",
									stackId: "a",
									fill: "#22c55e",
									radius: [
										2,
										2,
										0,
										0
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "pending",
									name: "Pending",
									stackId: "a",
									fill: "#333",
									radius: [
										2,
										2,
										0,
										0
									]
								})
							]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4",
				children: "Projects"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4",
				children: projects.map((p) => {
					const a = getAnalytics(p.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => navigate({ to: "/tasks" }),
						className: "bg-card border border-border rounded-lg p-5 hover:border-primary/50 cursor-pointer transition-all hover:shadow-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono text-muted-foreground",
									children: p.prefix
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Progress"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold",
										children: [a.overallProgress, "%"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 bg-white/5 rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-primary transition-all",
										style: { width: `${a.overallProgress}%` }
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-4 gap-2 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-bold",
										children: a.total
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] font-mono text-muted-foreground",
										children: "Tasks"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-bold text-success",
										children: a.done
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] font-mono text-muted-foreground",
										children: "Done"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-bold text-info",
										children: a.qa
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] font-mono text-muted-foreground",
										children: "QA"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-bold text-warning",
										children: a.doing
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] font-mono text-muted-foreground",
										children: "Doing"
									})] })
								]
							})
						]
					}, p.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-lg p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-[10px] font-mono text-muted-foreground uppercase tracking-widest",
							children: "Active Tasks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => navigate({ to: "/tasks" }),
							className: "text-[10px] font-mono text-primary hover:underline flex items-center gap-1",
							children: ["View all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: recentTasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground text-center py-8",
							children: "No active tasks. Create your first task!"
						}) : recentTasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 p-3 bg-surface-2 border border-border rounded text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-6 rounded-full bg-surface-2 border border-border grid place-items-center text-[9px] font-bold shrink-0",
									children: t.developer?.slice(0, 2).toUpperCase() || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-medium truncate",
										children: t.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-mono text-muted-foreground",
										children: t.taskId
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] font-mono px-1.5 py-0.5 rounded ${t.status === "doing" ? "bg-warning/10 text-warning" : t.status === "qa" ? "bg-info/10 text-info" : "bg-muted/10 text-muted-foreground"}`,
									children: t.status === "doing" ? "Doing" : t.status === "qa" ? "QA" : "Pending"
								})
							]
						}, t.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-lg p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4",
						children: "Developer Workload"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: currentProject && getAnalytics(currentProject.id).devProgress.length > 0 ? getAnalytics(currentProject.id).devProgress.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium",
								children: d.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `text-[10px] font-mono ${d.pct >= 80 ? "text-success" : d.pct >= 50 ? "text-warning" : "text-destructive"}`,
								children: [d.pct, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1.5 bg-white/5 rounded-full overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `h-full rounded-full ${d.pct >= 80 ? "bg-success" : d.pct >= 50 ? "bg-warning" : "bg-destructive"}`,
								style: { width: `${d.pct}%` }
							})
						})] }, d.name)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground text-center py-8",
							children: "No developer data yet."
						})
					})]
				})]
			})
		]
	})] });
}
//#endregion
export { Dashboard as component };
