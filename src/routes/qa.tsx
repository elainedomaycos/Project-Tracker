import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/console";
import { useProject, type QaStatus } from "@/lib/project-context";
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
  const { tasks, updateTask, getAnalytics } = useProject();
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
        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">Waiting for QA</h2>
          {qaTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="size-10 text-success mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">All tasks are reviewed. Nothing waiting for QA.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {qaTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-4 bg-surface-2 border border-border rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-primary font-bold">{t.taskId}</span>
                        <span className="text-sm font-medium">{t.title}</span>
                      </div>
                      {t.description && (
                        <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                      )}
                    </div>
                    {t.qaStatus === "failed" && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-destructive bg-destructive/10 px-2 py-0.5 rounded shrink-0">
                        <AlertTriangle className="size-3" />
                        Rework
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1.5">
                      <User className="size-3" />
                      {t.developer}
                    </div>
                    <span>{t.category}</span>
                    <span>{t.field}</span>
                    {t.dueDate && <span>Due: {t.dueDate}</span>}
                  </div>

                  {t.remarks && (
                    <div className="mb-3 p-2 bg-card border border-border rounded text-xs text-muted-foreground">
                      {t.remarks}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {t.qaStatus !== "failed" && (
                      <button
                        onClick={() => handleFail(t.id)}
                        className="px-4 py-2 bg-destructive/10 text-destructive text-xs font-bold rounded hover:bg-destructive/20 flex items-center gap-1.5"
                      >
                        <XCircle className="size-3.5" />
                        Fail — Back to Dev
                      </button>
                    )}
                    <button
                      onClick={() => handlePass(t.id)}
                      className="px-4 py-2 bg-success/10 text-success text-xs font-bold rounded hover:bg-success/20 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="size-3.5" />
                      Pass — Done
                    </button>
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
