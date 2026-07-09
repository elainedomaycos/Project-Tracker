import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/console";
import { useState } from "react";
import { useProject, type TaskStatus } from "@/lib/project-context";
import { CheckCircle2, Clock, ArrowRight, Users, Plus, X } from "lucide-react";

export const Route = createFileRoute("/developer")({
  head: () => ({
    meta: [
      { title: "Developer · Task Tracker" },
      { name: "description", content: "Developer workspace." },
    ],
  }),
  component: DeveloperPage,
});

function DeveloperPage() {
  const { tasks, currentProject, developers, qaUsers, updateTask, addDeveloper, removeDeveloper, addQaUser, removeQaUser } = useProject();
  const [filterDev, setFilterDev] = useState("all");
  const [showUsers, setShowUsers] = useState(false);
  const [newDev, setNewDev] = useState("");
  const [newQa, setNewQa] = useState("");

  const projectTasks = currentProject ? tasks.filter((t) => t.projectId === currentProject.id) : tasks;
  const filtered = filterDev === "all" ? projectTasks : projectTasks.filter((t) => t.developer === filterDev);
  const activeTasks = filtered.filter((t) => t.status !== "done");
  const doneTasks = filtered.filter((t) => t.status === "done");

  function handleStatusChange(taskId: string, status: TaskStatus) {
    updateTask(taskId, { status });
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Task Tracker" }, { label: "Developer" }]}
        status={{ label: `${activeTasks.length} active tasks`, tone: "info" }}
        actions={
          <button
            onClick={() => setShowUsers(true)}
            className="px-3 py-1.5 bg-surface-2 border border-border text-xs font-medium rounded hover:bg-surface-2/80 flex items-center gap-1.5"
          >
            <Users className="size-3.5" />
            Manage Users
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Filter Bar */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Filter by Developer</span>
          <select
            value={filterDev}
            onChange={(e) => setFilterDev(e.target.value)}
            className="px-3 py-1.5 rounded-md bg-surface-2 border border-border text-xs focus:outline-none focus:border-primary"
          >
            <option value="all">All Developers</option>
            {developers.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <span className="text-[10px] font-mono text-muted-foreground ml-auto">
            Showing {activeTasks.length} of {projectTasks.length} tasks
          </span>
        </div>

        {/* Active Tasks */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">Tasks</h2>
          {activeTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No tasks found.</p>
          ) : (
            <div className="space-y-2">
              {activeTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-4 p-3 bg-surface-2 border border-border rounded text-sm hover:border-primary/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-primary font-bold">{t.taskId}</span>
                      <span className="truncate font-medium">{t.title}</span>
                      <span className="text-[9px] font-mono text-muted-foreground ml-auto">{t.developer}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {t.category && `${t.category} · `}{t.field && `${t.field} · `}Due: {t.dueDate || "—"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {t.status === "pending" && (
                      <button
                        onClick={() => handleStatusChange(t.id, "doing")}
                        className="px-3 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded hover:brightness-110 flex items-center gap-1"
                      >
                        <Clock className="size-3" />
                        Start
                      </button>
                    )}
                    {t.status === "doing" && (
                      <button
                        onClick={() => handleStatusChange(t.id, "qa")}
                        className="px-3 py-1.5 bg-info text-white text-[10px] font-bold rounded hover:brightness-110 flex items-center gap-1"
                      >
                        <ArrowRight className="size-3" />
                        Move to QA
                      </button>
                    )}
                    {t.status === "qa" && (
                      <span className="px-2 py-1 text-[10px] font-mono text-info bg-info/10 rounded">In QA</span>
                    )}
                    {t.status === "done" && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-success">
                        <CheckCircle2 className="size-3" /> Done
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Done Tasks */}
        {doneTasks.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-5">
            <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">Recently Completed</h2>
            <div className="space-y-1.5">
              {doneTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-2.5 bg-surface-2 border border-border rounded text-sm">
                  <CheckCircle2 className="size-3.5 text-success shrink-0" />
                  <span className="font-mono text-[10px] text-muted-foreground">{t.taskId}</span>
                  <span className="flex-1 truncate text-muted-foreground">{t.title}</span>
                  <span className="text-[10px] text-muted-foreground">{t.developer}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manage Users Modal */}
      {showUsers && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={() => setShowUsers(false)}>
          <div className="w-full max-w-lg bg-card border border-border rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-sm font-semibold flex items-center gap-2"><Users className="size-4 text-primary" /> Manage Users</span>
              <button onClick={() => setShowUsers(false)} className="p-1 rounded hover:bg-surface-2 text-muted-foreground"><X className="size-4" /></button>
            </div>
            <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Developers */}
              <div>
                <h3 className="text-[10px] font-mono uppercase text-muted-foreground mb-3">Developers</h3>
                <div className="flex gap-2 mb-3">
                  <input value={newDev} onChange={(e) => setNewDev(e.target.value)} placeholder="Add developer..." className="flex-1 px-3 py-1.5 rounded-md bg-surface-2 border border-border text-xs focus:outline-none focus:border-primary" />
                  <button
                    onClick={() => { addDeveloper(newDev); setNewDev(""); }}
                    disabled={!newDev.trim()}
                    className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 disabled:opacity-50 flex items-center gap-1"
                  >
                    <Plus className="size-3" /> Add
                  </button>
                </div>
                <div className="space-y-1.5">
                  {developers.map((d) => (
                    <div key={d} className="flex items-center justify-between p-2.5 bg-surface-2 border border-border rounded text-sm">
                      <span>{d}</span>
                      <button onClick={() => removeDeveloper(d)} className="p-1 rounded hover:bg-surface-2 text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* QA Users */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-[10px] font-mono uppercase text-muted-foreground mb-3">QA Engineers</h3>
                <div className="flex gap-2 mb-3">
                  <input value={newQa} onChange={(e) => setNewQa(e.target.value)} placeholder="Add QA..." className="flex-1 px-3 py-1.5 rounded-md bg-surface-2 border border-border text-xs focus:outline-none focus:border-primary" />
                  <button
                    onClick={() => { addQaUser(newQa); setNewQa(""); }}
                    disabled={!newQa.trim()}
                    className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 disabled:opacity-50 flex items-center gap-1"
                  >
                    <Plus className="size-3" /> Add
                  </button>
                </div>
                <div className="space-y-1.5">
                  {qaUsers.map((q) => (
                    <div key={q} className="flex items-center justify-between p-2.5 bg-surface-2 border border-border rounded text-sm">
                      <span>{q}</span>
                      <button onClick={() => removeQaUser(q)} className="p-1 rounded hover:bg-surface-2 text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
