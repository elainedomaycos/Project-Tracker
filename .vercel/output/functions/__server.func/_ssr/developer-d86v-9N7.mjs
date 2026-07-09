import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { r as useProject } from "./project-context-CkM5ik6g.mjs";
import { t as PageHeader } from "./console-DdZ8SIgj.mjs";
import { B as ArrowRight, P as CircleCheck, d as Plus, j as Clock, n as Users, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/developer-d86v-9N7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DeveloperPage() {
	const { tasks, currentProject, developers, qaUsers, updateTask, addDeveloper, removeDeveloper, addQaUser, removeQaUser } = useProject();
	const [filterDev, setFilterDev] = (0, import_react.useState)("all");
	const [showUsers, setShowUsers] = (0, import_react.useState)(false);
	const [newDev, setNewDev] = (0, import_react.useState)("");
	const [newQa, setNewQa] = (0, import_react.useState)("");
	const projectTasks = currentProject ? tasks.filter((t) => t.projectId === currentProject.id) : tasks;
	const filtered = filterDev === "all" ? projectTasks : projectTasks.filter((t) => t.developer === filterDev);
	const activeTasks = filtered.filter((t) => t.status !== "done");
	const doneTasks = filtered.filter((t) => t.status === "done");
	function handleStatusChange(taskId, status) {
		updateTask(taskId, { status });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			crumbs: [{ label: "Task Tracker" }, { label: "Developer" }],
			status: {
				label: `${activeTasks.length} active tasks`,
				tone: "info"
			},
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setShowUsers(true),
				className: "px-3 py-1.5 bg-surface-2 border border-border text-xs font-medium rounded hover:bg-surface-2/80 flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" }), "Manage Users"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto p-6 space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono uppercase text-muted-foreground",
							children: "Filter by Developer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: filterDev,
							onChange: (e) => setFilterDev(e.target.value),
							className: "px-3 py-1.5 rounded-md bg-surface-2 border border-border text-xs focus:outline-none focus:border-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Developers"
							}), developers.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: d,
								children: d
							}, d))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-mono text-muted-foreground ml-auto",
							children: [
								"Showing ",
								activeTasks.length,
								" of ",
								projectTasks.length,
								" tasks"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-lg p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4",
						children: "Tasks"
					}), activeTasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground text-center py-8",
						children: "No tasks found."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: activeTasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 p-3 bg-surface-2 border border-border rounded text-sm hover:border-primary/40 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] text-primary font-bold",
											children: t.taskId
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate font-medium",
											children: t.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] font-mono text-muted-foreground ml-auto",
											children: t.developer
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-muted-foreground mt-0.5",
									children: [
										t.category && `${t.category} · `,
										t.field && `${t.field} · `,
										"Due: ",
										t.dueDate || "—"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 shrink-0",
								children: [
									t.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleStatusChange(t.id, "doing"),
										className: "px-3 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded hover:brightness-110 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), "Start"]
									}),
									t.status === "doing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleStatusChange(t.id, "qa"),
										className: "px-3 py-1.5 bg-info text-white text-[10px] font-bold rounded hover:brightness-110 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3" }), "Move to QA"]
									}),
									t.status === "qa" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-1 text-[10px] font-mono text-info bg-info/10 rounded",
										children: "In QA"
									}),
									t.status === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1 text-[10px] font-mono text-success",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), " Done"]
									})
								]
							})]
						}, t.id))
					})]
				}),
				doneTasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-lg p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4",
						children: "Recently Completed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: doneTasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 p-2.5 bg-surface-2 border border-border rounded text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-success shrink-0" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] text-muted-foreground",
									children: t.taskId
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 truncate text-muted-foreground",
									children: t.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: t.developer
								})
							]
						}, t.id))
					})]
				})
			]
		}),
		showUsers && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 grid place-items-center bg-black/40",
			onClick: () => setShowUsers(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-lg bg-card border border-border rounded-lg shadow-xl",
				onClick: (e) => e.stopPropagation(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-5 py-4 border-b border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm font-semibold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-primary" }), " Manage Users"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowUsers(false),
						className: "p-1 rounded hover:bg-surface-2 text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 space-y-6 max-h-[70vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-[10px] font-mono uppercase text-muted-foreground mb-3",
							children: "Developers"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: newDev,
								onChange: (e) => setNewDev(e.target.value),
								placeholder: "Add developer...",
								className: "flex-1 px-3 py-1.5 rounded-md bg-surface-2 border border-border text-xs focus:outline-none focus:border-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									addDeveloper(newDev);
									setNewDev("");
								},
								disabled: !newDev.trim(),
								className: "px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 disabled:opacity-50 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), " Add"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1.5",
							children: developers.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-2.5 bg-surface-2 border border-border rounded text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => removeDeveloper(d),
									className: "p-1 rounded hover:bg-surface-2 text-muted-foreground hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
								})]
							}, d))
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-[10px] font-mono uppercase text-muted-foreground mb-3",
								children: "QA Engineers"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: newQa,
									onChange: (e) => setNewQa(e.target.value),
									placeholder: "Add QA...",
									className: "flex-1 px-3 py-1.5 rounded-md bg-surface-2 border border-border text-xs focus:outline-none focus:border-primary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										addQaUser(newQa);
										setNewQa("");
									},
									disabled: !newQa.trim(),
									className: "px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 disabled:opacity-50 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), " Add"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1.5",
								children: qaUsers.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-2.5 bg-surface-2 border border-border rounded text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: q }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => removeQaUser(q),
										className: "p-1 rounded hover:bg-surface-2 text-muted-foreground hover:text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
									})]
								}, q))
							})
						]
					})]
				})]
			})
		})
	] });
}
//#endregion
export { DeveloperPage as component };
