import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/console";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateSprintReport, type SprintReport } from "@/lib/ai.server";
import {
  Sparkles,
  Loader2,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports · Scrum AI" },
      { name: "description", content: "AI-generated sprint reports and project insights." },
    ],
  }),
  component: Reports,
});

function Reports() {
  const reportFn = useServerFn(generateSprintReport);
  const [report, setReport] = useState<SprintReport | null>(null);
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    setReport(null);
    try {
      const result = await reportFn({ data: {} });
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Scrum AI" }, { label: "Reports" }]}
        status={{ label: "Sprint 3", tone: "info" }}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 flex items-center gap-2 disabled:opacity-50"
            >
              {generating ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
              {generating ? "Generating…" : "Generate Sprint Report"}
            </button>
            {report && (
              <button className="px-3 py-1.5 bg-surface-2 border border-border text-xs font-medium rounded hover:bg-surface-2/80 flex items-center gap-1.5">
                <Download className="size-3.5" />
                Export
              </button>
            )}
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!report && !generating && (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <FileText className="size-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-muted-foreground">
              Generate sprint 3 report with AI
            </p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Get a full sprint summary: completed, in-progress, team velocity, blockers, and recommendations.
            </p>
          </div>
        )}

        {generating && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="size-8 text-primary animate-spin mb-4" />
            <p className="text-sm font-medium text-muted-foreground">AI is analyzing sprint data…</p>
          </div>
        )}

        {report && (
          <>
            {/* Sprint Overview */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm font-semibold">{report.sprintName}</span>
                  <span className="text-xs text-muted-foreground ml-3">
                    {report.sprintDuration}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    report.sprintStatus === "completed"
                      ? "bg-success/10 text-success"
                      : report.sprintStatus === "in_progress"
                      ? "bg-info/10 text-info"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  {report.sprintStatus === "completed"
                    ? "Completed"
                    : report.sprintStatus === "in_progress"
                    ? "In Progress"
                    : "Not Started"}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-surface-2 border border-border rounded">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <CheckCircle2 className="size-3" /> Completed
                  </div>
                  <span className="text-2xl font-bold text-success">{report.completedTasks}</span>
                </div>
                <div className="p-3 bg-surface-2 border border-border rounded">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Clock className="size-3" /> In Progress
                  </div>
                  <span className="text-2xl font-bold text-warning">{report.inProgressTasks}</span>
                </div>
                <div className="p-3 bg-surface-2 border border-border rounded">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <XCircle className="size-3" /> Blocked
                  </div>
                  <span className="text-2xl font-bold text-destructive">{report.blockedTasks}</span>
                </div>
                <div className="p-3 bg-surface-2 border border-border rounded">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <TrendingUp className="size-3" /> Velocity
                  </div>
                  <span className="text-2xl font-bold text-primary">{report.velocity} pts</span>
                </div>
              </div>
            </div>

            {/* Team Progress */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="size-4 text-primary" />
                <span className="text-sm font-semibold">Team Progress</span>
              </div>
              <div className="space-y-4">
                {report.teamProgress.map((member, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{member.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{member.role}</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {member.completed} / {member.total} tasks
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${member.total > 0 ? (member.completed / member.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockers + Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="size-4 text-destructive" />
                  <span className="text-sm font-semibold">Blockers</span>
                </div>
                {report.blockers.length > 0 ? (
                  <div className="space-y-2">
                    {report.blockers.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 bg-surface-2 border border-border rounded text-sm">
                        <AlertTriangleIcon className="size-3.5 text-destructive shrink-0 mt-0.5" />
                        <span className="text-xs">{b}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No blockers reported.</p>
                )}
              </div>
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="size-4 text-primary" />
                  <span className="text-sm font-semibold">AI Recommendations</span>
                </div>
                {report.recommendations.length > 0 ? (
                  <div className="space-y-2">
                    {report.recommendations.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 bg-surface-2 border border-border rounded text-sm">
                        <Sparkles className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="text-xs">{r}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No recommendations available.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function AlertTriangleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}