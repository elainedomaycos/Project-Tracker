import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/console";
import { useProject, type QaStatus } from "@/lib/project-context";
import { useAuth } from "@/lib/auth-context";
import { CheckCircle2, XCircle, AlertTriangle, User } from "lucide-react";

export const Route = createFileRoute("/qa")({
  head: () => ({
    meta: [
      { title: "QA Review · Task Tracker" },
      { name: "description", content: "QA review queue." },
    ],
  }),
  component: QaPage,
});

function QaPage() {
  const { tasks, updateTask } = useProject();
  const { isSuperAdmin, isQa, isDeveloper } = useAuth();
  const canReview = isSuperAdmin || isQa;
  const qaTasks = tasks.filter((t) => t.status === "qa" || t.qaStatus === "failed");
  const allAnalytics = { qaPassed: tasks.filter((t) => t.qaStatus === "passed").length, qaFailed: tasks.filter((t) => t.qaStatus === "failed").length, qaWaiting: tasks.filter((t) => t.status === "qa").length };

  function handlePass(taskId: string) {
    updateTask(taskId, { status: "done", qaStatus: "passed", completedAt: new Date().toISOString().slice(0, 10) });
  }

  function handleFail(taskId: string) {
    updateTask(taskId, { status: "doing", qaStatus: "failed" });
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Task Tracker" }, { label: "QA Review" }]}
        status={{ label: `${qaTasks.length} pending review`, tone: qaTasks.length > 0 ? "info" : "success" }}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* QA Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-card border border-border rounded-md text-center">
            <div className="text-2xl font-bold text-success">{allAnalytics.qaPassed}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase">Passed</div>
          </div>
          <div className="p-4 bg-card border border-border rounded-md text-center">
            <div className="text-2xl font-bold text-destructive">{allAnalytics.qaFailed}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase">Failed</div>
          </div>
          <div className="p-4 bg-card border border-border rounded-md text-center">
            <div className="text-2xl font-bold text-warning">{allAnalytics.qaWaiting}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase">Waiting</div>
          </div>
        </div>

        {/* QA Queue */}
        <div>
          <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">Waiting for QA</h2>
          {qaTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="size-10 text-success mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">All tasks are reviewed. Nothing waiting for QA.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {qaTasks.map((t) => (
                <div
                  key={t.id}
                  className="bg-card border border-border rounded-lg p-4 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] text-primary font-bold">{t.taskId}</span>
                      {t.qaStatus === "failed" && (
                        <span className="flex items-center gap-1 text-[9px] font-mono text-destructive bg-destructive/10 px-1.5 py-0.5 rounded shrink-0">
                          <AlertTriangle className="size-2.5" />
                          Rework
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-medium truncate">{t.title}</h3>

                  {t.description && (
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                  )}

                  <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <User className="size-2.5" />
                      {t.developer}
                    </span>
                    {t.field && <span>· {t.field}</span>}
                    {t.dueDate && <span>· Due: {t.dueDate}</span>}
                  </div>

                  {t.remarks && (
                    <div className="mt-2 p-2 bg-surface-2 border border-border rounded text-[10px] text-muted-foreground line-clamp-2">
                      {t.remarks}
                    </div>
                  )}

                  <div className="mt-auto pt-3 flex items-center gap-2">
                    {canReview ? (
                      <>
                        {t.qaStatus !== "failed" && (
                          <button
                            onClick={() => handleFail(t.id)}
                            className="px-3 py-1.5 bg-destructive/10 text-destructive text-[9px] font-bold rounded hover:bg-destructive/20 flex items-center gap-1"
                          >
                            <XCircle className="size-2.5" />
                            Fail
                          </button>
                        )}
                        <button
                          onClick={() => handlePass(t.id)}
                          className="px-3 py-1.5 bg-success/10 text-success text-[9px] font-bold rounded hover:bg-success/20 flex items-center gap-1"
                        >
                          <CheckCircle2 className="size-2.5" />
                          Pass
                        </button>
                      </>
                    ) : (
                      <span className="text-[9px] font-mono text-muted-foreground">
                        {t.qaStatus === "waiting" ? "Waiting for QA" : t.qaStatus === "passed" ? "Passed" : t.qaStatus === "failed" ? "Failed — Rework" : "—"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
