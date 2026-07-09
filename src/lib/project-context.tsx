import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type TaskStatus = "pending" | "doing" | "qa" | "done";
export type QaStatus = "waiting" | "passed" | "failed";

export type Task = {
  id: string;
  taskId: string;
  projectId: string;
  title: string;
  description: string;
  developer: string;
  field: string;
  endUser: string;
  module: string;
  status: TaskStatus;
  qaStatus: QaStatus;
  commit: string;
  remarks: string;
  dueDate: string;
  startDate: string;
  completedAt: string;
  priority: "low" | "medium" | "high" | "critical";
  branch: string;
};

export type Project = {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  clientName: string;
  endUsers: string[];
  modules: string[];
};

export type AppView = "pm" | "developer" | "qa" | "client";

type ProjectContextType = {
  projects: Project[];
  tasks: Task[];
  currentProject: Project | null;
  currentView: AppView;
  currentDeveloper: string;
  developers: string[];
  qaUsers: string[];
  loading: boolean;
  setCurrentProject: (id: string) => void;
  setCurrentView: (v: AppView) => void;
  setCurrentDeveloper: (name: string) => void;
  addProject: (data: { name: string; clientName: string; endUsers: string[]; modules: string[] }) => void;
  removeProject: (id: string) => void;
  addTask: (t: Omit<Task, "id" | "taskId">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  nextTaskId: (projectId: string) => string;
  getProjectTasks: (projectId: string) => Task[];
  getDeveloperTasks: (devName: string) => Task[];
  getQaTasks: () => Task[];
  getAnalytics: (projectId: string) => ProjectAnalytics;
  addDeveloper: (name: string) => void;
  removeDeveloper: (name: string) => void;
  addQaUser: (name: string) => void;
  removeQaUser: (name: string) => void;
};

export type ProjectAnalytics = {
  total: number;
  done: number;
  qa: number;
  doing: number;
  pending: number;
  overallProgress: number;
  devProgress: { name: string; done: number; total: number; pct: number }[];
  fieldProgress: { name: string; done: number; total: number; pct: number }[];
  qaPassed: number;
  qaFailed: number;
  qaWaiting: number;
};

const DEFAULT_PROJECTS: Project[] = [
  { id: "tourism", name: "Tourism Management System", prefix: "TS", createdAt: "2026-03-01", clientName: "", endUsers: [], modules: [] },
  { id: "cbms", name: "CBMMS", prefix: "CBMMS", createdAt: "2026-02-15", clientName: "", endUsers: [], modules: [] },
];

const DEFAULT_DEVELOPERS = ["Rachel", "Mcdoel", "Alvin", "John", "Elaine", "Carl"];

const PIN_MAP: Record<string, string> = {
  Rachel: "1111", Mcdoel: "2222", Alvin: "3333",
  John: "4444", Elaine: "5555", Carl: "6666",
};

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function toDbTask(t: Task) {
  return {
    id: t.id,
    task_id: t.taskId,
    project_id: t.projectId,
    title: t.title,
    description: t.description,
    developer: t.developer,
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
    branch_name: t.branch,
  };
}

function fromDbTask(r: any): Task {
  return {
    id: r.id,
    taskId: r.task_id,
    projectId: r.project_id,
    title: r.title,
    description: r.description || "",
    developer: r.developer || "",
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
    branch: r.branch_name || "",
  };
}

function fromDbProject(r: any): Project {
  return {
    id: r.id, name: r.name, prefix: r.prefix, createdAt: r.created_at,
    clientName: r.client_name || "",
    endUsers: r.end_users || [],
    modules: r.modules || [],
  };
}

const ProjectContext = createContext<ProjectContextType | null>(null);

function db() { return supabase as any; }

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [currentView, setCurrentView] = useState<AppView>("pm");
  const [currentDeveloper, setCurrentDeveloper] = useState("");
  const [developers, setDeveloperState] = useState<string[]>(DEFAULT_DEVELOPERS);
  const [qaUsers, setQaState] = useState<string[]>(["Sara", "Mike"]);
  const [loading, setLoading] = useState(true);

  // Load from Supabase on mount
  useEffect(() => {
    async function load() {
      try {
        const [projRes, taskRes, devRes, qaRes] = await Promise.all([
          db().from("projects").select("*"),
          db().from("tasks").select("*"),
          db().from("settings").select("value").eq("key", "developers").single(),
          db().from("settings").select("value").eq("key", "qa_users").single(),
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

  useEffect(() => {
    if (projects.length > 0) {
      if (!currentProject || !projects.find((p) => p.id === currentProject.id)) {
        setCurrentProjectState(projects[0]);
      }
    }
  }, [projects, currentProject]);

  function setCurrentProject(id: string) {
    const found = projects.find((p) => p.id === id);
    if (found) setCurrentProjectState(found);
  }

  function addProject(data: { name: string; clientName: string; endUsers: string[]; modules: string[] }) {
    const id = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const words = data.name.split(" ");
    const prefix = words.map(w => w[0]).join("").toUpperCase().slice(0, 4) || "PRJ";
    const p: Project = {
      id, name: data.name, prefix, createdAt: new Date().toISOString().slice(0, 10),
      clientName: data.clientName, endUsers: data.endUsers, modules: data.modules,
    };
    setProjects((prev) => [...prev, p]);
    setCurrentProjectState(p);
    db().from("projects").insert({
      id, name: data.name, prefix, created_at: p.createdAt,
      client_name: data.clientName, end_users: data.endUsers, modules: data.modules,
    }).then(() => {}).catch(() => {});
  }

  function removeProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    if (currentProject?.id === id) {
      const remaining = projects.filter((p) => p.id !== id);
      setCurrentProjectState(remaining[0] ?? null);
    }
    db().from("tasks").delete().eq("project_id", id).then(() => {}).catch(() => {});
    db().from("projects").delete().eq("id", id).then(() => {}).catch(() => {});
  }

  function addTask(t: Omit<Task, "id" | "taskId">) {
    const tid = nextTaskId(t.projectId);
    const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
    const branch = `feature/${tid.toLowerCase()}-${slug}`;
    const task: Task = { id: generateId(), taskId: tid, branch, endUser: "", module: "", ...t };
    setTasks((prev) => [...prev, task]);
    db().from("tasks").insert(toDbTask(task)).then(() => {}).catch(() => {});
  }

  function updateTask(id: string, updates: Partial<Task>) {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const updated = { ...t, ...updates };
      if (updates.status === "done" && !updated.completedAt) {
        updated.completedAt = new Date().toISOString().slice(0, 10);
      }
      return updated;
    }));
    const dbUpdates: Record<string, any> = {};
    for (const [k, v] of Object.entries(updates)) {
      if (k === "taskId") dbUpdates.task_id = v;
      else if (k === "projectId") dbUpdates.project_id = v;
      else if (k === "qaStatus") dbUpdates.qa_status = v;
      else if (k === "dueDate") dbUpdates.due_date = v;
      else if (k === "startDate") dbUpdates.start_date = v;
      else if (k === "completedAt") dbUpdates.completed_at = v;
      else if (k === "branch") dbUpdates.branch_name = v;
      else if (k === "endUser") dbUpdates.end_user = v;
      else if (k === "module") dbUpdates.module = v;
      else dbUpdates[k] = v;
    }
    db().from("tasks").update(dbUpdates).eq("id", id).then(() => {}).catch(() => {});
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    db().from("tasks").delete().eq("id", id).then(() => {}).catch(() => {});
  }

  function nextTaskId(projectId: string): string {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return "TASK-001";
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    const maxNum = projectTasks.reduce((max, t) => {
      const parts = t.taskId.split("-");
      const num = parseInt(parts[parts.length - 1], 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const next = (maxNum + 1).toString().padStart(3, "0");
    return `${proj.prefix}-${next}`;
  }

  function getProjectTasks(projectId: string): Task[] {
    return tasks.filter((t) => t.projectId === projectId);
  }

  function getDeveloperTasks(devName: string): Task[] {
    return tasks.filter((t) => t.developer === devName && t.status !== "done");
  }

  function getQaTasks(): Task[] {
    return tasks.filter((t) => t.status === "qa");
  }

  function getAnalytics(projectId: string): ProjectAnalytics {
    const pt = tasks.filter((t) => t.projectId === projectId);
    const total = pt.length;
    const done = pt.filter((t) => t.status === "done").length;
    const qa = pt.filter((t) => t.status === "qa").length;
    const doing = pt.filter((t) => t.status === "doing").length;
    const pending = pt.filter((t) => t.status === "pending").length;
    const overallProgress = total > 0 ? Math.round((done / total) * 100) : 0;
    const devMap = new Map<string, { done: number; total: number }>();
    pt.forEach((t) => {
      if (!t.developer) return;
      const entry = devMap.get(t.developer) ?? { done: 0, total: 0 };
      entry.total++;
      if (t.status === "done") entry.done++;
      devMap.set(t.developer, entry);
    });
    const devProgress = Array.from(devMap.entries()).map(([name, d]) => ({
      name, done: d.done, total: d.total, pct: d.total > 0 ? Math.round((d.done / d.total) * 100) : 0,
    })).sort((a, b) => b.pct - a.pct);
    const fieldMap = new Map<string, { done: number; total: number }>();
    pt.forEach((t) => {
      if (!t.field) return;
      const entry = fieldMap.get(t.field) ?? { done: 0, total: 0 };
      entry.total++;
      if (t.status === "done") entry.done++;
      fieldMap.set(t.field, entry);
    });
    const fieldProgress = Array.from(fieldMap.entries()).map(([name, d]) => ({
      name, done: d.done, total: d.total, pct: d.total > 0 ? Math.round((d.done / d.total) * 100) : 0,
    })).sort((a, b) => b.pct - a.pct);
    const qaPassed = pt.filter((t) => t.qaStatus === "passed").length;
    const qaFailed = pt.filter((t) => t.qaStatus === "failed").length;
    const qaWaiting = pt.filter((t) => t.status === "qa" || t.qaStatus === "waiting").length;
    return { total, done, qa, doing, pending, overallProgress, devProgress, fieldProgress, qaPassed, qaFailed, qaWaiting };
  }

  const addDeveloper = useCallback((name: string) => {
    if (!name.trim()) return;
    setDeveloperState((prev) => {
      if (prev.includes(name.trim())) return prev;
      const next = [...prev, name.trim()];
      db().from("settings").upsert({ key: "developers", value: next }).then(() => {}).catch(() => {});
      return next;
    });
  }, []);

  const removeDeveloper = useCallback((name: string) => {
    setDeveloperState((prev) => {
      const next = prev.filter((d) => d !== name);
      db().from("settings").upsert({ key: "developers", value: next }).then(() => {}).catch(() => {});
      return next;
    });
  }, []);

  const addQaUser = useCallback((name: string) => {
    if (!name.trim()) return;
    setQaState((prev) => {
      if (prev.includes(name.trim())) return prev;
      const next = [...prev, name.trim()];
      db().from("settings").upsert({ key: "qa_users", value: next }).then(() => {}).catch(() => {});
      return next;
    });
  }, []);

  const removeQaUser = useCallback((name: string) => {
    setQaState((prev) => {
      const next = prev.filter((d) => d !== name);
      db().from("settings").upsert({ key: "qa_users", value: next }).then(() => {}).catch(() => {});
      return next;
    });
  }, []);

  return (
    <ProjectContext.Provider value={{
      projects, tasks, currentProject, currentView, currentDeveloper,
      developers, qaUsers, loading,
      setCurrentProject, setCurrentView, setCurrentDeveloper,
      addProject, removeProject, addTask, updateTask, removeTask,
      nextTaskId, getProjectTasks, getDeveloperTasks, getQaTasks, getAnalytics,
      addDeveloper, removeDeveloper, addQaUser, removeQaUser,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
}

export { DEFAULT_DEVELOPERS, PIN_MAP };
