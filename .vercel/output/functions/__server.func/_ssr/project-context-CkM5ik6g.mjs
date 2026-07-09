import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-BCdJXjBV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/project-context-CkM5ik6g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_PROJECTS = [{
	id: "tourism",
	name: "Tourism Management System",
	prefix: "TS",
	createdAt: "2026-03-01",
	clientName: "",
	endUsers: [],
	modules: []
}, {
	id: "cbms",
	name: "CBMMS",
	prefix: "CBMMS",
	createdAt: "2026-02-15",
	clientName: "",
	endUsers: [],
	modules: []
}];
var DEFAULT_DEVELOPERS = [
	"Rachel",
	"Mcdoel",
	"Alvin",
	"John",
	"Elaine",
	"Carl"
];
function generateId() {
	return Math.random().toString(36).slice(2, 10);
}
function toDbTask(t) {
	return {
		id: t.id,
		task_id: t.taskId,
		project_id: t.projectId,
		title: t.title,
		description: t.description,
		developer: t.developer,
		category: t.category,
		field: t.field,
		end_user: t.endUser,
		module: t.module,
		status: t.status,
		qa_status: t.qaStatus,
		commit: t.commit,
		remarks: t.remarks,
		due_date: t.dueDate,
		start_date: t.startDate,
		completed_at: t.completedAt,
		priority: t.priority,
		branch_name: t.branch
	};
}
function fromDbTask(r) {
	return {
		id: r.id,
		taskId: r.task_id,
		projectId: r.project_id,
		title: r.title,
		description: r.description || "",
		developer: r.developer || "",
		category: r.category || "",
		field: r.field || "",
		endUser: r.end_user || "",
		module: r.module || "",
		status: r.status || "pending",
		qaStatus: r.qa_status || "waiting",
		commit: r.commit || "",
		remarks: r.remarks || "",
		dueDate: r.due_date || "",
		startDate: r.start_date || "",
		completedAt: r.completed_at || "",
		priority: r.priority || "medium",
		branch: r.branch_name || ""
	};
}
function fromDbProject(r) {
	return {
		id: r.id,
		name: r.name,
		prefix: r.prefix,
		createdAt: r.created_at,
		clientName: r.client_name || "",
		endUsers: r.end_users || [],
		modules: r.modules || []
	};
}
var ProjectContext = (0, import_react.createContext)(null);
function db() {
	return supabase;
}
function ProjectProvider({ children }) {
	const [projects, setProjects] = (0, import_react.useState)(DEFAULT_PROJECTS);
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [currentProject, setCurrentProjectState] = (0, import_react.useState)(null);
	const [currentView, setCurrentView] = (0, import_react.useState)("pm");
	const [currentDeveloper, setCurrentDeveloper] = (0, import_react.useState)("");
	const [developers, setDeveloperState] = (0, import_react.useState)(DEFAULT_DEVELOPERS);
	const [qaUsers, setQaState] = (0, import_react.useState)(["Sara", "Mike"]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		async function load() {
			try {
				const [projRes, taskRes, devRes, qaRes] = await Promise.all([
					db().from("projects").select("*"),
					db().from("tasks").select("*"),
					db().from("settings").select("value").eq("key", "developers").single(),
					db().from("settings").select("value").eq("key", "qa_users").single()
				]);
				if (projRes.data?.length) setProjects(projRes.data.map(fromDbProject));
				if (taskRes.data) setTasks(taskRes.data.map(fromDbTask));
				if (devRes.data?.value) setDeveloperState(devRes.data.value);
				if (qaRes.data?.value) setQaState(qaRes.data.value);
			} catch (e) {
				console.warn("Failed to load from Supabase, using defaults", e);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!currentProject && projects.length > 0) setCurrentProjectState(projects[0]);
	}, [projects, currentProject]);
	function setCurrentProject(id) {
		const found = projects.find((p) => p.id === id);
		if (found) setCurrentProjectState(found);
	}
	function addProject(data) {
		const id = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
		const prefix = data.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 4) || "PRJ";
		const p = {
			id,
			name: data.name,
			prefix,
			createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			clientName: data.clientName,
			endUsers: data.endUsers,
			modules: data.modules
		};
		setProjects((prev) => [...prev, p]);
		setCurrentProjectState(p);
		db().from("projects").insert({
			id,
			name: data.name,
			prefix,
			created_at: p.createdAt,
			client_name: data.clientName,
			end_users: data.endUsers,
			modules: data.modules
		}).then(() => {}).catch(() => {});
	}
	function removeProject(id) {
		setProjects((prev) => prev.filter((p) => p.id !== id));
		setTasks((prev) => prev.filter((t) => t.projectId !== id));
		if (currentProject?.id === id) {
			const remaining = projects.filter((p) => p.id !== id);
			setCurrentProjectState(remaining[0] ?? null);
		}
		db().from("tasks").delete().eq("project_id", id).then(() => {}).catch(() => {});
		db().from("projects").delete().eq("id", id).then(() => {}).catch(() => {});
	}
	function addTask(t) {
		const tid = nextTaskId(t.projectId);
		const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
		const branch = `feature/${tid.toLowerCase()}-${slug}`;
		const task = {
			id: generateId(),
			taskId: tid,
			branch,
			endUser: "",
			module: "",
			...t
		};
		setTasks((prev) => [...prev, task]);
		db().from("tasks").insert(toDbTask(task)).then(() => {}).catch(() => {});
	}
	function updateTask(id, updates) {
		setTasks((prev) => prev.map((t) => {
			if (t.id !== id) return t;
			const updated = {
				...t,
				...updates
			};
			if (updates.status === "done" && !updated.completedAt) updated.completedAt = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			return updated;
		}));
		const dbUpdates = {};
		for (const [k, v] of Object.entries(updates)) if (k === "taskId") dbUpdates.task_id = v;
		else if (k === "projectId") dbUpdates.project_id = v;
		else if (k === "qaStatus") dbUpdates.qa_status = v;
		else if (k === "dueDate") dbUpdates.due_date = v;
		else if (k === "startDate") dbUpdates.start_date = v;
		else if (k === "completedAt") dbUpdates.completed_at = v;
		else if (k === "branch") dbUpdates.branch_name = v;
		else if (k === "endUser") dbUpdates.end_user = v;
		else if (k === "module") dbUpdates.module = v;
		else dbUpdates[k] = v;
		db().from("tasks").update(dbUpdates).eq("id", id).then(() => {}).catch(() => {});
	}
	function removeTask(id) {
		setTasks((prev) => prev.filter((t) => t.id !== id));
		db().from("tasks").delete().eq("id", id).then(() => {}).catch(() => {});
	}
	function nextTaskId(projectId) {
		const proj = projects.find((p) => p.id === projectId);
		if (!proj) return "TASK-001";
		const next = (tasks.filter((t) => t.projectId === projectId).reduce((max, t) => {
			const parts = t.taskId.split("-");
			const num = parseInt(parts[parts.length - 1], 10);
			return isNaN(num) ? max : Math.max(max, num);
		}, 0) + 1).toString().padStart(3, "0");
		return `${proj.prefix}-${next}`;
	}
	function getProjectTasks(projectId) {
		return tasks.filter((t) => t.projectId === projectId);
	}
	function getDeveloperTasks(devName) {
		return tasks.filter((t) => t.developer === devName && t.status !== "done");
	}
	function getQaTasks() {
		return tasks.filter((t) => t.status === "qa");
	}
	function getAnalytics(projectId) {
		const pt = tasks.filter((t) => t.projectId === projectId);
		const total = pt.length;
		const done = pt.filter((t) => t.status === "done").length;
		const qa = pt.filter((t) => t.status === "qa").length;
		const doing = pt.filter((t) => t.status === "doing").length;
		const pending = pt.filter((t) => t.status === "pending").length;
		const overallProgress = total > 0 ? Math.round(done / total * 100) : 0;
		const devMap = /* @__PURE__ */ new Map();
		pt.forEach((t) => {
			if (!t.developer) return;
			const entry = devMap.get(t.developer) ?? {
				done: 0,
				total: 0
			};
			entry.total++;
			if (t.status === "done") entry.done++;
			devMap.set(t.developer, entry);
		});
		const devProgress = Array.from(devMap.entries()).map(([name, d]) => ({
			name,
			done: d.done,
			total: d.total,
			pct: d.total > 0 ? Math.round(d.done / d.total * 100) : 0
		})).sort((a, b) => b.pct - a.pct);
		const catMap = /* @__PURE__ */ new Map();
		pt.forEach((t) => {
			if (!t.category) return;
			const entry = catMap.get(t.category) ?? {
				done: 0,
				total: 0
			};
			entry.total++;
			if (t.status === "done") entry.done++;
			catMap.set(t.category, entry);
		});
		return {
			total,
			done,
			qa,
			doing,
			pending,
			overallProgress,
			devProgress,
			categoryProgress: Array.from(catMap.entries()).map(([name, d]) => ({
				name,
				done: d.done,
				total: d.total,
				pct: d.total > 0 ? Math.round(d.done / d.total * 100) : 0
			})).sort((a, b) => b.pct - a.pct),
			qaPassed: pt.filter((t) => t.qaStatus === "passed").length,
			qaFailed: pt.filter((t) => t.qaStatus === "failed").length,
			qaWaiting: pt.filter((t) => t.status === "qa" || t.qaStatus === "waiting").length
		};
	}
	const addDeveloper = (0, import_react.useCallback)((name) => {
		if (!name.trim()) return;
		setDeveloperState((prev) => {
			if (prev.includes(name.trim())) return prev;
			const next = [...prev, name.trim()];
			db().from("settings").upsert({
				key: "developers",
				value: next
			}).then(() => {}).catch(() => {});
			return next;
		});
	}, []);
	const removeDeveloper = (0, import_react.useCallback)((name) => {
		setDeveloperState((prev) => {
			const next = prev.filter((d) => d !== name);
			db().from("settings").upsert({
				key: "developers",
				value: next
			}).then(() => {}).catch(() => {});
			return next;
		});
	}, []);
	const addQaUser = (0, import_react.useCallback)((name) => {
		if (!name.trim()) return;
		setQaState((prev) => {
			if (prev.includes(name.trim())) return prev;
			const next = [...prev, name.trim()];
			db().from("settings").upsert({
				key: "qa_users",
				value: next
			}).then(() => {}).catch(() => {});
			return next;
		});
	}, []);
	const removeQaUser = (0, import_react.useCallback)((name) => {
		setQaState((prev) => {
			const next = prev.filter((d) => d !== name);
			db().from("settings").upsert({
				key: "qa_users",
				value: next
			}).then(() => {}).catch(() => {});
			return next;
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectContext.Provider, {
		value: {
			projects,
			tasks,
			currentProject,
			currentView,
			currentDeveloper,
			developers,
			qaUsers,
			loading,
			setCurrentProject,
			setCurrentView,
			setCurrentDeveloper,
			addProject,
			removeProject,
			addTask,
			updateTask,
			removeTask,
			nextTaskId,
			getProjectTasks,
			getDeveloperTasks,
			getQaTasks,
			getAnalytics,
			addDeveloper,
			removeDeveloper,
			addQaUser,
			removeQaUser
		},
		children
	});
}
function useProject() {
	const ctx = (0, import_react.useContext)(ProjectContext);
	if (!ctx) throw new Error("useProject must be used within ProjectProvider");
	return ctx;
}
//#endregion
export { ProjectProvider as n, useProject as r, DEFAULT_DEVELOPERS as t };
