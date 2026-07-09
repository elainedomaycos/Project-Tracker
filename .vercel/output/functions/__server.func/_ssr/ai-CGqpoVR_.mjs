import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as generateProjectInsights, c as qaCheckTask, i as generateDailyScrumReport, l as useServerFn, n as generateBranchName, o as generateSprintReport, r as generateCommitMessage, s as generateTaskBreakdown, t as analyzeRequirement } from "./ai.server-CPApCQRl.mjs";
import { r as useProject } from "./project-context-CkM5ik6g.mjs";
import { t as PageHeader } from "./console-DdZ8SIgj.mjs";
import { I as ChartColumn, R as Bug, S as FileText, c as Sparkles, k as Copy, o as Square, p as LoaderCircle, s as SquareCheckBig, v as GitCommitHorizontal, y as GitBranch, z as Brain } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-CGqpoVR_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tools = [
	{
		key: "analyze",
		label: "Analyze Requirement",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5" }),
		description: "Generate epics, user stories, and tasks from a client requirement."
	},
	{
		key: "breakdown",
		label: "Task Breakdown",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "size-3.5" }),
		description: "Break a task into subtasks with estimates."
	},
	{
		key: "commit",
		label: "Commit Message",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitCommitHorizontal, { className: "size-3.5" }),
		description: "Generate a conventional commit message."
	},
	{
		key: "branch",
		label: "Branch Name",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitBranch, { className: "size-3.5" }),
		description: "Generate a standardized git branch name."
	},
	{
		key: "qa",
		label: "QA Checker",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bug, { className: "size-3.5" }),
		description: "Check implementation for issues, edge cases, and improvements."
	},
	{
		key: "daily",
		label: "Daily Scrum Report",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5" }),
		description: "Generate yesterday/today/blockers report."
	},
	{
		key: "sprint",
		label: "Sprint Report",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-3.5" }),
		description: "Full sprint summary with velocity and recommendations."
	},
	{
		key: "insights",
		label: "Project Insights",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "size-3.5" }),
		description: "Get AI-driven project health insights."
	}
];
function AIHub() {
	const { currentProject, addTask, nextTaskId } = useProject();
	const [activeTool, setActiveTool] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const [createdCount, setCreatedCount] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const analyzeFn = useServerFn(analyzeRequirement);
	const commitFn = useServerFn(generateCommitMessage);
	const branchFn = useServerFn(generateBranchName);
	const breakdownFn = useServerFn(generateTaskBreakdown);
	const dailyFn = useServerFn(generateDailyScrumReport);
	const sprintFn = useServerFn(generateSprintReport);
	const qaFn = useServerFn(qaCheckTask);
	const insightsFn = useServerFn(generateProjectInsights);
	const [inputs, setInputs] = (0, import_react.useState)({});
	function setInput(key, value) {
		setInputs((prev) => ({
			...prev,
			[key]: value
		}));
	}
	function copy(text, label) {
		navigator.clipboard.writeText(text).then(() => {
			setCopied(label);
			setTimeout(() => setCopied(null), 1500);
		});
	}
	async function handleRun(tool) {
		setActiveTool(tool);
		setLoading(true);
		setResult(null);
		setCreatedCount(null);
		setSelected(/* @__PURE__ */ new Set());
		try {
			switch (tool) {
				case "analyze": {
					const r = await analyzeFn({ data: { requirement: inputs.analyze || "" } });
					setResult(r);
					break;
				}
				case "commit": {
					const r = await commitFn({ data: { changes: inputs.commit || "" } });
					setResult(r);
					break;
				}
				case "branch": {
					const r = await branchFn({ data: { description: inputs.branch || "" } });
					setResult(r);
					break;
				}
				case "breakdown": {
					const r = await breakdownFn({ data: { task: inputs.breakdown || "" } });
					setResult(r);
					break;
				}
				case "daily": {
					const r = await dailyFn({ data: {} });
					setResult(r);
					break;
				}
				case "sprint": {
					const r = await sprintFn({ data: {} });
					setResult(r);
					break;
				}
				case "qa": {
					const r = await qaFn({ data: { taskDescription: inputs.qa || "" } });
					setResult(r);
					break;
				}
				case "insights": {
					const r = await insightsFn({ data: {} });
					setResult(r);
					break;
				}
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}
	function toggle(idx) {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(idx)) next.delete(idx);
			else next.add(idx);
			return next;
		});
	}
	function renderResult() {
		if (!result) return null;
		const r = result;
		if (r.commitMessage) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] font-mono uppercase text-muted-foreground",
				children: "Commit Message"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => copy(r.commitMessage, "commit"),
				className: "flex items-center gap-1 text-[10px] text-primary hover:underline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" }), copied === "commit" ? "Copied!" : "Copy"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "block p-3 bg-surface-2 border border-border rounded text-xs font-mono break-all",
			children: r.commitMessage
		})] });
		if (r.branchName) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] font-mono uppercase text-muted-foreground",
				children: "Branch Name"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => copy(r.branchName, "branch"),
				className: "flex items-center gap-1 text-[10px] text-primary hover:underline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" }), copied === "branch" ? "Copied!" : "Copy"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "block p-3 bg-surface-2 border border-border rounded text-xs font-mono text-primary break-all",
			children: r.branchName
		})] });
		function Checkbox({ idx }) {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => toggle(idx),
				className: "size-4 shrink-0 grid place-items-center",
				children: selected.has(idx) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "size-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4 text-muted-foreground hover:text-foreground" })
			});
		}
		function createTasksFrom(items, category) {
			if (!currentProject) return;
			items.forEach((item) => {
				addTask({
					projectId: currentProject.id,
					title: item.title,
					description: item.description || `From AI: ${category}`,
					developer: currentProject.id === "tourism" ? "Rachel" : "John",
					category,
					field: "fullstack",
					status: "pending",
					qaStatus: "waiting",
					commit: "",
					remarks: "",
					dueDate: "",
					startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
					completedAt: "",
					priority: item.priority || "medium"
				});
			});
			setCreatedCount(items.length);
		}
		if (r.insights) {
			const items = r.insights.filter((_, i) => selected.has(i));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-mono uppercase text-muted-foreground",
						children: "Project Insights"
					}),
					r.insights.map((insight, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 p-3 bg-surface-2 border border-border rounded text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, { idx: i }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `size-2 rounded-full shrink-0 mt-1.5 ${insight.risk === "healthy" ? "bg-success" : insight.risk === "warning" ? "bg-warning" : "bg-destructive"}` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-medium",
									children: insight.module
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground",
									children: insight.reason
								})]
							})
						]
					}, i)),
					currentProject && items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => createTasksFrom(items.map((i) => ({
							title: `[${i.module}] ${i.reason}`,
							priority: i.risk === "high" ? "high" : "medium"
						})), "AI Insight"),
						className: "w-full px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110",
						children: [
							"Create ",
							items.length,
							" Task",
							items.length > 1 ? "s" : "",
							" from Selected"
						]
					})
				]
			});
		}
		if (r.passed !== void 0) {
			const issues = r.issues || [];
			const allSuggestions = (r.suggestions || []).map((s) => ({
				title: s,
				priority: "low"
			}));
			const items = [...issues, ...allSuggestions].filter((_, i) => selected.has(i));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono uppercase text-muted-foreground",
							children: "Verdict: "
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-xs font-bold ${r.passed ? "text-success" : "text-destructive"}`,
							children: r.passed ? "PASSED" : "FAILED"
						})]
					}),
					issues.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-mono text-muted-foreground mb-1",
						children: "Issues"
					}), issues.map((issue, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 text-xs p-2 bg-destructive/5 border border-destructive/20 rounded mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, { idx: i }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							issue.title,
							" — ",
							issue.description
						] })]
					}, i))] }),
					r.suggestions?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-mono text-muted-foreground mb-1",
						children: "Suggestions"
					}), r.suggestions.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 text-xs p-2 bg-info/5 border border-info/20 rounded mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, { idx: issues.length + i }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s })]
					}, i))] }),
					r.edgeCases?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-mono text-muted-foreground mb-1",
						children: "Edge Cases"
					}), r.edgeCases.map((ec, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs p-2 bg-surface-2 border border-border rounded mb-1",
						children: ec
					}, i))] }),
					currentProject && items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => createTasksFrom(items, "QA Check"),
						className: "w-full px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110",
						children: [
							"Create ",
							items.length,
							" Task",
							items.length > 1 ? "s" : "",
							" from Selected"
						]
					})
				]
			});
		}
		if (r.subtasks) {
			const items = r.subtasks.filter((_, i) => selected.has(i));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[10px] font-mono uppercase text-muted-foreground",
						children: [
							"Subtasks (",
							r.subtasks.length,
							")"
						]
					}),
					r.subtasks.map((st, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 p-2.5 bg-surface-2 border border-border rounded text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, { idx: i }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-xs",
								children: st.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-muted-foreground",
								children: st.estimate
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-mono text-primary font-bold",
								children: [st.storyPoints, " pts"]
							})
						]
					}, i)),
					currentProject && items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => createTasksFrom(items.map((st) => ({
							title: st.title,
							priority: st.storyPoints >= 5 ? "high" : "medium"
						})), "Task Breakdown"),
						className: "w-full px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110",
						children: [
							"Create ",
							items.length,
							" Task",
							items.length > 1 ? "s" : "",
							" from Selected"
						]
					})
				]
			});
		}
		if (r.yesterday) {
			const blockers = (r.blockers || []).filter(Boolean);
			const items = blockers.filter((_, i) => selected.has(i));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-mono uppercase text-muted-foreground mb-2",
							children: "Yesterday"
						}), r.yesterday.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs flex items-center gap-1.5 mb-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckIcon, { className: "size-3 text-success" }),
								" ",
								item
							]
						}, i))] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-mono uppercase text-muted-foreground mb-2",
							children: "Today"
						}), r.today.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs flex items-center gap-1.5 mb-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowIcon, { className: "size-3 text-primary" }),
								" ",
								item
							]
						}, i))] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-mono uppercase text-muted-foreground mb-2",
								children: "Blockers"
							}),
							blockers.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs flex items-start gap-1.5 mb-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, { idx: i }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertIcon, { className: "size-3 text-destructive shrink-0 mt-0.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })
								]
							}, i)),
							blockers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: "None"
							})
						] })
					]
				}), currentProject && items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => createTasksFrom(items.map((b) => ({
						title: `BLOCKER: ${b}`,
						priority: "high"
					})), "Daily Scrum"),
					className: "w-full px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110",
					children: [
						"Create ",
						items.length,
						" Task",
						items.length > 1 ? "s" : "",
						" from Blockers"
					]
				})]
			});
		}
		if (r.sprintName) {
			const recs = r.recommendations || [];
			const items = recs.filter((_, i) => selected.has(i));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold",
							children: r.sprintName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono text-muted-foreground",
							children: r.sprintDuration
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2 bg-surface-2 border border-border rounded text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground",
								children: "Done"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-bold text-success",
								children: r.completedTasks
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2 bg-surface-2 border border-border rounded text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground",
								children: "Velocity"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-lg font-bold text-primary",
								children: [r.velocity, " pts"]
							})]
						})]
					}),
					recs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-mono text-muted-foreground mb-1",
						children: "Recommendations"
					}), recs.map((rec, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 text-xs p-2 bg-primary/5 border border-primary/20 rounded mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, { idx: i }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rec })]
					}, i))] }),
					currentProject && items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => createTasksFrom(items.map((r) => ({
							title: r,
							priority: "medium"
						})), "Sprint Report"),
						className: "w-full px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110",
						children: [
							"Create ",
							items.length,
							" Task",
							items.length > 1 ? "s" : "",
							" from Recommendations"
						]
					})
				]
			});
		}
		if (r.epic) {
			const tasks = r.tasks || [];
			const selectedTasks = tasks.filter((_, i) => selected.has(i));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono uppercase text-muted-foreground",
							children: "Epic"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold",
							children: r.epic
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
						children: [
							"User Stories (",
							r.userStories?.length,
							")"
						]
					}), r.userStories?.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2 bg-surface-2 border border-border rounded mb-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: s.title
						}), s.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground",
							children: s.description
						})]
					}, i))] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10px] font-mono uppercase text-muted-foreground mb-1",
						children: [
							"Tasks (",
							tasks.length,
							")"
						]
					}), tasks.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2 bg-surface-2 border border-border rounded mb-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, { idx: i }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 font-medium",
									children: t.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: t.assignee
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-primary font-bold",
									children: [t.storyPoints, "pts"]
								})
							]
						}), t.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground mt-1 ml-6",
							children: t.description
						})]
					}, i))] }),
					currentProject && selectedTasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							selectedTasks.forEach((t) => {
								addTask({
									projectId: currentProject.id,
									title: t.title,
									description: t.description || `From "${r.epic}" epic. ${t.title}`,
									developer: t.assignee === "frontend" || t.assignee === "fullstack" ? currentProject.id === "tourism" ? "Rachel" : "John" : "Mcdoel",
									category: r.epic,
									field: t.assignee || "fullstack",
									status: "pending",
									qaStatus: "waiting",
									commit: "",
									remarks: `Story points: ${t.storyPoints}`,
									dueDate: "",
									startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
									completedAt: "",
									priority: t.storyPoints >= 5 ? "high" : t.storyPoints >= 3 ? "medium" : "low"
								});
							});
							setCreatedCount(selectedTasks.length);
						},
						className: "w-full px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 transition-all",
						children: [
							"Create ",
							selectedTasks.length,
							" Selected Task",
							selectedTasks.length > 1 ? "s" : "",
							" in \"",
							currentProject.name,
							"\""
						]
					}),
					!currentProject && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground text-center",
						children: "Select a project first to create tasks."
					})
				]
			});
		}
		return null;
	}
	(0, import_react.useEffect)(() => {
		if (createdCount !== null) {
			const t = setTimeout(() => setCreatedCount(null), 4e3);
			return () => clearTimeout(t);
		}
	}, [createdCount]);
	function needsInput(key) {
		return ![
			"daily",
			"sprint",
			"insights"
		].includes(key);
	}
	function getPlaceholder(key) {
		switch (key) {
			case "analyze": return "e.g. \"Tourism website with login, recommendations, GIS map\"";
			case "commit": return "Describe your changes…";
			case "branch": return "Describe the feature/fix…";
			case "breakdown": return "e.g. \"Implement user login with OAuth2\"";
			case "qa": return "Describe the implementation…";
			default: return "";
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		crumbs: [{ label: "Scrum AI" }, { label: "AI Assistant" }],
		status: {
			label: "8 tools available",
			tone: "info"
		}
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 overflow-y-auto p-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-3",
				children: tools.map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setActiveTool(tool.key);
						setResult(null);
					},
					className: `p-4 bg-card border rounded-lg text-left hover:border-primary/50 transition-colors ${activeTool === tool.key ? "border-primary bg-primary/5" : "border-border"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: activeTool === tool.key ? "text-primary" : "text-muted-foreground",
							children: tool.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium",
							children: tool.label
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground leading-snug",
						children: tool.description
					})]
				}, tool.key))
			}),
			activeTool && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card border border-border rounded-lg p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold",
							children: tools.find((t) => t.key === activeTool)?.label
						})
					}),
					needsInput(activeTool) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: inputs[activeTool] || "",
						onChange: (e) => setInput(activeTool, e.target.value),
						placeholder: getPlaceholder(activeTool),
						className: "w-full h-24 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary resize-none mb-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => handleRun(activeTool),
							disabled: loading || needsInput(activeTool) && !(inputs[activeTool] || "").trim(),
							className: "px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 flex items-center gap-2 disabled:opacity-50",
							children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), loading ? "Running…" : "Run"]
						})
					}),
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-center py-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 text-primary animate-spin" })
					}),
					!loading && result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 pt-5 border-t border-border",
						children: [renderResult(), createdCount !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 px-4 py-3 bg-success/10 border border-success/30 rounded-lg text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-semibold text-success",
								children: [
									createdCount,
									" task",
									createdCount > 1 ? "s" : "",
									" created successfully!"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground mt-0.5",
								children: "Go to the Tasks page to view and manage them."
							})]
						})]
					})
				]
			}),
			!activeTool && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center py-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-10 text-primary mb-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "AI Assistant Hub"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1 max-w-md",
						children: "Select an AI tool above to analyze requirements, generate commits, branches, scrum reports, run QA checks, and more."
					})
				]
			})
		]
	})] });
}
function CheckIcon(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		...props,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "20 6 9 17 4 12" })
	});
}
function ArrowIcon(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		...props,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: "5",
			y1: "12",
			x2: "19",
			y2: "12"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "12 5 19 12 12 19" })]
	});
}
function AlertIcon(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		...props,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "12",
				y1: "9",
				x2: "12",
				y2: "13"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "12",
				y1: "17",
				x2: "12.01",
				y2: "17"
			})
		]
	});
}
//#endregion
export { AIHub as component };
