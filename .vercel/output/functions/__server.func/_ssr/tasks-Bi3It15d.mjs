import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { r as useProject, t as DEFAULT_DEVELOPERS } from "./project-context-CkM5ik6g.mjs";
import { t as PageHeader } from "./console-DdZ8SIgj.mjs";
import { C as FileCheck, P as CircleCheck, d as Plus, i as TriangleAlert, k as Copy, l as Search, t as X, y as GitBranch } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasks-Bi3It15d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_OPTIONS = [
	{
		value: "pending",
		label: "Pending"
	},
	{
		value: "doing",
		label: "Doing"
	},
	{
		value: "qa",
		label: "QA"
	},
	{
		value: "done",
		label: "Done"
	}
];
var STATUS_COLOR = {
	pending: "bg-muted/10 text-muted-foreground",
	doing: "bg-warning/10 text-warning",
	qa: "bg-info/10 text-info",
	done: "bg-success/10 text-success"
};
var QA_OPTIONS = [
	{
		value: "",
		label: "—"
	},
	{
		value: "waiting",
		label: "Waiting"
	},
	{
		value: "passed",
		label: "Passed"
	},
	{
		value: "failed",
		label: "Failed"
	}
];
var QA_COLOR = {
	waiting: "bg-warning/10 text-warning",
	passed: "bg-success/10 text-success",
	failed: "bg-destructive/10 text-destructive"
};
var CATEGORY_OPTIONS = [
	"Frontend",
	"Backend",
	"Database",
	"DevOps",
	"UI/UX",
	"Documentation",
	"Testing",
	"Security"
];
var FIELD_OPTIONS = [
	"Authentication",
	"API",
	"Reports",
	"Dashboard",
	"Forms",
	"Integration",
	"Configuration",
	"Migration"
];
function TasksPage() {
	const { projects, currentProject, getProjectTasks, getAnalytics, addTask, updateTask, removeTask, nextTaskId } = useProject();
	const [showNewModal, setShowNewModal] = (0, import_react.useState)(false);
	const [selectedTask, setSelectedTask] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filterStatus, setFilterStatus] = (0, import_react.useState)("all");
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		description: "",
		developer: "",
		category: "",
		field: "",
		endUser: "",
		module: "",
		startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		dueDate: "",
		priority: "medium"
	});
	const currentProj = projects.find((p) => p.id === pid);
	const pid = currentProject?.id ?? projects[0]?.id ?? "";
	const tasks = getProjectTasks(pid);
	const analytics = getAnalytics(pid);
	const filtered = tasks.filter((t) => {
		if (filterStatus !== "all" && t.status !== filterStatus) return false;
		if (!search.trim()) return true;
		const q = search.toLowerCase();
		return t.taskId.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.developer.toLowerCase().includes(q);
	});
	function handleCreate() {
		if (!form.title.trim() || !pid) return;
		addTask({
			projectId: pid,
			title: form.title.trim(),
			description: form.description.trim(),
			developer: form.developer,
			category: form.category,
			field: form.field,
			endUser: form.endUser,
			module: form.module,
			status: "pending",
			qaStatus: "waiting",
			commit: "",
			remarks: "",
			dueDate: form.dueDate,
			startDate: form.startDate,
			completedAt: "",
			priority: form.priority
		});
		setForm({
			title: "",
			description: "",
			developer: "",
			category: "",
			field: "",
			endUser: "",
			module: "",
			startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			dueDate: "",
			priority: "medium"
		});
		setShowNewModal(false);
	}
	function copyTaskId(taskId) {
		navigator.clipboard.writeText(taskId).then(() => {
			setCopiedId(taskId);
			setTimeout(() => setCopiedId(null), 1500);
		});
	}
	function copyBranchName(task) {
		const branch = task.branch || `feature/${task.taskId.toLowerCase()}-${task.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30)}`;
		navigator.clipboard.writeText(branch).then(() => {
			setCopiedId(`branch-${task.id}`);
			setTimeout(() => setCopiedId(null), 1500);
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			crumbs: [{ label: "Task Tracker" }, { label: currentProject?.name ?? "Tasks" }],
			status: {
				label: `${tasks.length} tasks`,
				tone: "info"
			},
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search tasks...",
							className: "w-44 pl-7 pr-3 py-1.5 rounded-md bg-surface-2 border border-border text-xs focus:outline-none focus:border-primary"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: filterStatus,
						onChange: (e) => setFilterStatus(e.target.value),
						className: "px-2.5 py-1.5 rounded-md bg-surface-2 border border-border text-xs focus:outline-none focus:border-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "pending",
								children: "Pending"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "doing",
								children: "Doing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "qa",
								children: "QA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "done",
								children: "Done"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowNewModal(true),
						className: "px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "New Task"]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-auto p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-5 gap-3 mb-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-card border border-border rounded-md text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-bold",
								children: analytics.total
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[9px] font-mono text-muted-foreground uppercase",
								children: "Total"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-card border border-border rounded-md text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-bold text-success",
								children: analytics.done
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[9px] font-mono text-muted-foreground uppercase",
								children: "Done"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-card border border-border rounded-md text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-bold text-info",
								children: analytics.qa
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[9px] font-mono text-muted-foreground uppercase",
								children: "QA"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-card border border-border rounded-md text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-bold text-warning",
								children: analytics.doing
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[9px] font-mono text-muted-foreground uppercase",
								children: "Doing"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-card border border-border rounded-md text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-bold",
								children: analytics.pending
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[9px] font-mono text-muted-foreground uppercase",
								children: "Pending"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs mb-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground font-mono text-[10px] uppercase",
							children: "Overall Progress"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold font-mono",
							children: [analytics.overallProgress, "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2.5 bg-white/5 rounded-full overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-primary transition-all",
							style: { width: `${analytics.overallProgress}%` }
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto border border-border rounded-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm border-collapse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-surface-2 border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "ID" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, {
									className: "min-w-[250px]",
									children: "Task"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Developer" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "QA" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Due" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "End User" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Module" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Branch" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							onClick: () => setSelectedTask(t),
							className: "border-b border-border hover:bg-surface-2/40 transition-colors cursor-pointer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs font-bold text-primary",
										children: t.taskId
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: (e) => {
											e.stopPropagation();
											copyTaskId(t.taskId);
										},
										className: "p-0.5 rounded hover:bg-surface-2 text-muted-foreground",
										title: "Copy ID",
										children: copiedId === t.taskId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" })
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium truncate max-w-[300px]",
										children: t.title
									}), t.priority === "high" || t.priority === "critical" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: `size-3 shrink-0 ${t.priority === "critical" ? "text-destructive" : "text-warning"}` }) : null]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-5 rounded-full bg-surface-2 border border-border grid place-items-center text-[8px] font-bold",
										children: t.developer?.slice(0, 2).toUpperCase() || "—"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs",
										children: t.developer || "—"
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: t.status,
									onClick: (e) => e.stopPropagation(),
									onChange: (e) => updateTask(t.id, { status: e.target.value }),
									className: `text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border-none cursor-pointer ${STATUS_COLOR[t.status]}`,
									children: STATUS_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: o.value,
										children: o.label
									}, o.value))
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] font-mono px-1.5 py-0.5 rounded ${QA_COLOR[t.qaStatus] || "text-muted-foreground"}`,
									children: t.qaStatus === "waiting" ? "Waiting" : t.qaStatus === "passed" ? "Pass" : t.qaStatus === "failed" ? "Fail" : "—"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] font-mono ${t.dueDate && t.dueDate < (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) && t.status !== "done" ? "text-destructive" : "text-muted-foreground"}`,
									children: t.dueDate || "—"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono text-muted-foreground",
									children: t.endUser || "—"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono text-muted-foreground",
									children: t.module || "—"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									onClick: (e) => e.stopPropagation(),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitBranch, { className: "size-3 text-muted-foreground shrink-0" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: t.branch,
											onChange: (e) => updateTask(t.id, { branch: e.target.value }),
											className: "w-40 px-1 py-0.5 bg-transparent border border-transparent hover:border-border focus:border-primary rounded text-[10px] font-mono text-muted-foreground focus:outline-none focus:bg-surface-2",
											title: "Edit branch name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => copyBranchName(t),
											className: "p-0.5 rounded hover:bg-surface-2 text-muted-foreground hover:text-primary shrink-0",
											title: "Copy branch name",
											children: copiedId === `branch-${t.id}` ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" })
										})
									]
								}) })
							]
						}, t.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 9,
							className: "text-center py-12 text-sm text-muted-foreground",
							children: search || filterStatus !== "all" ? "No tasks match your filters." : "No tasks yet. Create your first task!"
						}) })] })]
					})
				})
			]
		}),
		showNewModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 grid place-items-center bg-black/40",
			onClick: () => setShowNewModal(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-lg bg-card border border-border rounded-lg shadow-xl",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-5 py-4 border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-semibold",
							children: [
								"New Task · ",
								currentProject?.name,
								" · ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary font-mono",
									children: nextTaskId(pid)
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowNewModal(false),
							className: "p-1 rounded hover:bg-surface-2 text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] font-mono uppercase text-muted-foreground",
								children: "Title *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.title,
								onChange: (e) => setForm((p) => ({
									...p,
									title: e.target.value
								})),
								placeholder: "Fix login redirect",
								className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary",
								autoFocus: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] font-mono uppercase text-muted-foreground",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.description,
								onChange: (e) => setForm((p) => ({
									...p,
									description: e.target.value
								})),
								placeholder: "Optional details",
								className: "w-full mt-1 h-20 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary resize-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-mono uppercase text-muted-foreground",
									children: "Developer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: form.developer,
									onChange: (e) => setForm((p) => ({
										...p,
										developer: e.target.value
									})),
									className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Unassigned"
									}), DEFAULT_DEVELOPERS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: d,
										children: d
									}, d))]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-mono uppercase text-muted-foreground",
									children: "Priority"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: form.priority,
									onChange: (e) => setForm((p) => ({
										...p,
										priority: e.target.value
									})),
									className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "low",
											children: "Low"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "medium",
											children: "Medium"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "high",
											children: "High"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "critical",
											children: "Critical"
										})
									]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-mono uppercase text-muted-foreground",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: form.category,
									onChange: (e) => setForm((p) => ({
										...p,
										category: e.target.value
									})),
									className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "—"
									}), CATEGORY_OPTIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c,
										children: c
									}, c))]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-mono uppercase text-muted-foreground",
									children: "Field"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: form.field,
									onChange: (e) => setForm((p) => ({
										...p,
										field: e.target.value
									})),
									className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "—"
									}), FIELD_OPTIONS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: f,
										children: f
									}, f))]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-mono uppercase text-muted-foreground",
									children: "End User"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: form.endUser,
									onChange: (e) => setForm((p) => ({
										...p,
										endUser: e.target.value
									})),
									className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "—"
									}), (currentProj?.endUsers ?? []).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: u,
										children: u
									}, u))]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-mono uppercase text-muted-foreground",
									children: "Module"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: form.module,
									onChange: (e) => setForm((p) => ({
										...p,
										module: e.target.value
									})),
									className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "—"
									}), (currentProj?.modules ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: m,
										children: m
									}, m))]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-mono uppercase text-muted-foreground",
									children: "Start Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: form.startDate,
									onChange: (e) => setForm((p) => ({
										...p,
										startDate: e.target.value
									})),
									className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-mono uppercase text-muted-foreground",
									children: "Due Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: form.dueDate,
									onChange: (e) => setForm((p) => ({
										...p,
										dueDate: e.target.value
									})),
									className: "w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
								})] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 px-5 py-4 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowNewModal(false),
							className: "px-4 py-2 text-xs font-medium rounded border border-border hover:bg-surface-2",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleCreate,
							disabled: !form.title.trim(),
							className: "px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 disabled:opacity-50",
							children: "Create Task"
						})]
					})
				]
			})
		}),
		selectedTask && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 grid place-items-center bg-black/40",
			onClick: () => setSelectedTask(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-xl bg-card border border-border rounded-lg shadow-xl max-h-[90vh] overflow-y-auto",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-5 py-4 border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "size-4 text-primary" }), "Task Details"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelectedTask(null),
							className: "p-1 rounded hover:bg-surface-2 text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-lg font-bold text-primary",
									children: selectedTask.taskId
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitBranch, { className: "size-3.5 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: selectedTask.branch,
											onChange: (e) => updateTask(selectedTask.id, { branch: e.target.value }),
											className: "w-56 px-2 py-1 bg-surface-2 border border-border rounded text-[10px] font-mono text-muted-foreground focus:outline-none focus:border-primary",
											placeholder: "feature/..."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => copyBranchName(selectedTask),
											className: "flex items-center gap-1.5 px-2.5 py-1 bg-surface-2 border border-border rounded text-[10px] font-mono text-muted-foreground hover:text-foreground shrink-0",
											children: copiedId === `branch-${selectedTask.id}` ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" })
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
								children: "Title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: selectedTask.title
							})] }),
							selectedTask.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: selectedTask.description
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
										children: "Developer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "size-6 rounded-full bg-surface-2 border border-border grid place-items-center text-[9px] font-bold",
											children: selectedTask.developer?.slice(0, 2).toUpperCase() || "—"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm",
											children: selectedTask.developer || "Unassigned"
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
										children: "Field"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: selectedTask.field || "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
										children: "Category"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: selectedTask.category || "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
										children: "End User"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: selectedTask.endUser || "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
										children: "Module"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: selectedTask.module || "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
										children: "Priority"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${selectedTask.priority === "critical" ? "bg-destructive/10 text-destructive" : selectedTask.priority === "high" ? "bg-warning/10 text-warning" : selectedTask.priority === "medium" ? "bg-info/10 text-info" : "bg-muted/10 text-muted-foreground"}`,
										children: selectedTask.priority
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: selectedTask.status,
									onChange: (e) => updateTask(selectedTask.id, { status: e.target.value }),
									className: `text-xs font-mono font-bold px-2 py-1 rounded border-none cursor-pointer ${STATUS_COLOR[selectedTask.status]}`,
									children: STATUS_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: o.value,
										children: o.label
									}, o.value))
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
									children: "QA Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: selectedTask.qaStatus,
									onChange: (e) => updateTask(selectedTask.id, { qaStatus: e.target.value }),
									className: `text-xs font-mono font-bold px-2 py-1 rounded border-none cursor-pointer ${QA_COLOR[selectedTask.qaStatus] || "text-muted-foreground"}`,
									children: QA_OPTIONS.filter((o) => o.value !== "").map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: o.value,
										children: o.label
									}, o.value))
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
										children: "Start Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: selectedTask.startDate || "",
										onChange: (e) => updateTask(selectedTask.id, { startDate: e.target.value }),
										className: "w-full px-3 py-1.5 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
										children: "Due Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: selectedTask.dueDate || "",
										onChange: (e) => updateTask(selectedTask.id, { dueDate: e.target.value }),
										className: `w-full px-3 py-1.5 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary ${selectedTask.dueDate && selectedTask.dueDate < (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) && selectedTask.status !== "done" ? "text-destructive font-bold" : ""}`
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
										children: "Completed"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: selectedTask.completedAt || "",
										onChange: (e) => updateTask(selectedTask.id, { completedAt: e.target.value }),
										className: "w-full px-3 py-1.5 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
									})] })
								]
							}),
							selectedTask.commit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
								children: "Commit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "block p-2 bg-surface-2 border border-border rounded text-xs font-mono text-muted-foreground",
								children: selectedTask.commit
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
								children: "Remarks"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: selectedTask.remarks,
								onChange: (e) => updateTask(selectedTask.id, { remarks: e.target.value }),
								placeholder: "Add a remark...",
								className: "w-full px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between px-5 py-4 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								removeTask(selectedTask.id);
								setSelectedTask(null);
							},
							className: "px-3 py-1.5 text-xs font-medium rounded border border-destructive/30 text-destructive hover:bg-destructive/10",
							children: "Delete Task"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelectedTask(null),
							className: "px-4 py-2 text-xs font-medium rounded border border-border hover:bg-surface-2",
							children: "Close"
						})]
					})
				]
			})
		})
	] });
}
function Th({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: `text-left text-[10px] font-mono uppercase text-muted-foreground px-3 py-3 whitespace-nowrap ${className ?? ""}`,
		children
	});
}
function Td({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: `px-3 py-3 ${className ?? ""}`,
		children
	});
}
//#endregion
export { TasksPage as component };
