import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/console";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useProject } from "@/lib/project-context";
import {
  analyzeRequirement,
  generateCommitMessage,
  generateBranchName,
  generateTaskBreakdown,
  generateDailyScrumReport,
  generateSprintReport,
  qaCheckTask,
  generateProjectInsights,
  type RequirementAnalysis,
  type TaskBreakdown,
  type DailyScrumReport,
  type SprintReport,
  type QACheckResult,
  type ProjectInsight,
} from "@/lib/ai.server";
import {
  Sparkles,
  Loader2,
  ChevronDown,
  FileText,
  GitCommit,
  GitBranch,
  Bug,
  Brain,
  BarChart3,
  Copy,
  CheckSquare,
  Square,
} from "lucide-react";

type ToolName =
  | "analyze"
  | "commit"
  | "branch"
  | "breakdown"
  | "daily"
  | "sprint"
  | "qa"
  | "insights";

const tools: { key: ToolName; label: string; icon: React.ReactNode; description: string }[] = [
  { key: "analyze", label: "Analyze Requirement", icon: <FileText className="size-3.5" />, description: "Generate epics, user stories, and tasks from a client requirement." },
  { key: "breakdown", label: "Task Breakdown", icon: <Brain className="size-3.5" />, description: "Break a task into subtasks with estimates." },
  { key: "commit", label: "Commit Message", icon: <GitCommit className="size-3.5" />, description: "Generate a conventional commit message." },
  { key: "branch", label: "Branch Name", icon: <GitBranch className="size-3.5" />, description: "Generate a standardized git branch name." },
  { key: "qa", label: "QA Checker", icon: <Bug className="size-3.5" />, description: "Check implementation for issues, edge cases, and improvements." },
  { key: "daily", label: "Daily Scrum Report", icon: <FileText className="size-3.5" />, description: "Generate yesterday/today/blockers report." },
  { key: "sprint", label: "Sprint Report", icon: <BarChart3 className="size-3.5" />, description: "Full sprint summary with velocity and recommendations." },
  { key: "insights", label: "Project Insights", icon: <Brain className="size-3.5" />, description: "Get AI-driven project health insights." },
];

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "AI Assistant · Scrum AI" },
      { name: "description", content: "AI-powered Scrum assistant hub with all tools." },
    ],
  }),
  component: AIHub,
});

function AIHub() {
  const { currentProject, addTask, nextTaskId } = useProject();
  const [activeTool, setActiveTool] = useState<ToolName | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [createdCount, setCreatedCount] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const analyzeFn = useServerFn(analyzeRequirement);
  const commitFn = useServerFn(generateCommitMessage);
  const branchFn = useServerFn(generateBranchName);
  const breakdownFn = useServerFn(generateTaskBreakdown);
  const dailyFn = useServerFn(generateDailyScrumReport);
  const sprintFn = useServerFn(generateSprintReport);
  const qaFn = useServerFn(qaCheckTask);
  const insightsFn = useServerFn(generateProjectInsights);

  const [inputs, setInputs] = useState<Record<string, string>>({});

  function setInput(key: string, value: string) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  async function handleRun(tool: ToolName) {
    setActiveTool(tool);
    setLoading(true);
    setResult(null);
    setCreatedCount(null);
    setSelected(new Set());
    try {
      switch (tool) {
        case "analyze": {
          const r = await (analyzeFn as any)({ data: { requirement: inputs.analyze || "" } });
          setResult(r);
          break;
        }
        case "commit": {
          const r = await (commitFn as any)({ data: { changes: inputs.commit || "" } });
          setResult(r);
          break;
        }
        case "branch": {
          const r = await (branchFn as any)({ data: { description: inputs.branch || "" } });
          setResult(r);
          break;
        }
        case "breakdown": {
          const r = await (breakdownFn as any)({ data: { task: inputs.breakdown || "" } });
          setResult(r);
          break;
        }
        case "daily": {
          const r = await (dailyFn as any)({ data: {} });
          setResult(r);
          break;
        }
        case "sprint": {
          const r = await (sprintFn as any)({ data: {} });
          setResult(r);
          break;
        }
        case "qa": {
          const r = await (qaFn as any)({ data: { taskDescription: inputs.qa || "" } });
          setResult(r);
          break;
        }
        case "insights": {
          const r = await (insightsFn as any)({ data: {} });
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

  function toggle(idx: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  function renderResult() {
    if (!result) return null;
    const r = result as any;

    if (r.commitMessage) {
      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Commit Message</span>
            <button onClick={() => copy(r.commitMessage, "commit")} className="flex items-center gap-1 text-[10px] text-primary hover:underline">
              <Copy className="size-3" />{copied === "commit" ? "Copied!" : "Copy"}
            </button>
          </div>
          <code className="block p-3 bg-surface-2 border border-border rounded text-xs font-mono break-all">{r.commitMessage}</code>
        </div>
      );
    }

    if (r.branchName) {
      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Branch Name</span>
            <button onClick={() => copy(r.branchName, "branch")} className="flex items-center gap-1 text-[10px] text-primary hover:underline">
              <Copy className="size-3" />{copied === "branch" ? "Copied!" : "Copy"}
            </button>
          </div>
          <code className="block p-3 bg-surface-2 border border-border rounded text-xs font-mono text-primary break-all">{r.branchName}</code>
        </div>
      );
    }

    function Checkbox({ idx }: { idx: number }) {
      return (
        <button onClick={() => toggle(idx)} className="size-4 shrink-0 grid place-items-center">
          {selected.has(idx) ? <CheckSquare className="size-4 text-primary" /> : <Square className="size-4 text-muted-foreground hover:text-foreground" />}
        </button>
      );
    }

    function createTasksFrom(items: { title: string; description?: string; priority?: string }[], aiField: string) {
      if (!currentProject) return;
      items.forEach((item) => {
        addTask({
          projectId: currentProject.id,
          title: item.title,
          description: item.description || `From AI: ${aiField}`,
          developer: currentProject.id === "tourism" ? "Rachel" : "John",
          field: aiField,
          status: "pending",
          qaStatus: "waiting",
          commit: "",
          remarks: "",
          dueDate: "",
          startDate: new Date().toISOString().slice(0, 10),
          completedAt: "",
          priority: (item.priority || "medium") as any,
        });
      });
      setCreatedCount(items.length);
    }

    if (r.insights) {
      const items = r.insights.filter((_: any, i: number) => selected.has(i));
      return (
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Project Insights</span>
          {r.insights.map((insight: ProjectInsight, i: number) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-surface-2 border border-border rounded text-sm">
              <Checkbox idx={i} />
              <div className={`size-2 rounded-full shrink-0 mt-1.5 ${insight.risk === "healthy" ? "bg-success" : insight.risk === "warning" ? "bg-warning" : "bg-destructive"}`} />
              <div className="flex-1">
                <div className="text-xs font-medium">{insight.module}</div>
                <div className="text-[10px] text-muted-foreground">{insight.reason}</div>
              </div>
            </div>
          ))}
          {currentProject && items.length > 0 && (
            <button onClick={() => createTasksFrom(items.map((i: ProjectInsight) => ({ title: `[${i.module}] ${i.reason}`, priority: i.risk === "high" ? "high" : "medium" })), "AI Insight")} className="w-full px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110">
              Create {items.length} Task{items.length > 1 ? "s" : ""} from Selected
            </button>
          )}
        </div>
      );
    }

    if (r.passed !== undefined) {
      const issues = r.issues || [];
      const allSuggestions = (r.suggestions || []).map((s: string) => ({ title: s, priority: "low" }));
      const items = [...issues, ...allSuggestions].filter((_: any, i: number) => selected.has(i));
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Verdict: </span>
            <span className={`text-xs font-bold ${r.passed ? "text-success" : "text-destructive"}`}>
              {r.passed ? "PASSED" : "FAILED"}
            </span>
          </div>
          {issues.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-muted-foreground mb-1">Issues</div>
              {issues.map((issue: any, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs p-2 bg-destructive/5 border border-destructive/20 rounded mb-1">
                  <Checkbox idx={i} />
                  <span>{issue.title} — {issue.description}</span>
                </div>
              ))}
            </div>
          )}
          {(r.suggestions?.length > 0) && (
            <div>
              <div className="text-[10px] font-mono text-muted-foreground mb-1">Suggestions</div>
              {r.suggestions.map((s: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs p-2 bg-info/5 border border-info/20 rounded mb-1">
                  <Checkbox idx={issues.length + i} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
          {r.edgeCases?.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-muted-foreground mb-1">Edge Cases</div>
              {r.edgeCases.map((ec: string, i: number) => (
                <div key={i} className="text-xs p-2 bg-surface-2 border border-border rounded mb-1">{ec}</div>
              ))}
            </div>
          )}
          {currentProject && items.length > 0 && (
            <button onClick={() => createTasksFrom(items, "QA Check")} className="w-full px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110">
              Create {items.length} Task{items.length > 1 ? "s" : ""} from Selected
            </button>
          )}
        </div>
      );
    }

    if (r.subtasks) {
      const items = r.subtasks.filter((_: any, i: number) => selected.has(i));
      return (
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Subtasks ({r.subtasks.length})</span>
          {r.subtasks.map((st: any, i: number) => (
            <div key={i} className="flex items-center gap-2 p-2.5 bg-surface-2 border border-border rounded text-sm">
              <Checkbox idx={i} />
              <span className="flex-1 text-xs">{st.title}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{st.estimate}</span>
              <span className="text-[10px] font-mono text-primary font-bold">{st.storyPoints} pts</span>
            </div>
          ))}
          {currentProject && items.length > 0 && (
            <button onClick={() => createTasksFrom(items.map((st: any) => ({ title: st.title, priority: st.storyPoints >= 5 ? "high" : "medium" })), "Task Breakdown")} className="w-full px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110">
              Create {items.length} Task{items.length > 1 ? "s" : ""} from Selected
            </button>
          )}
        </div>
      );
    }

    if (r.yesterday) {
      const blockers = (r.blockers || []).filter(Boolean);
      const items = blockers.filter((_: string, i: number) => selected.has(i));
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2">Yesterday</div>
              {r.yesterday.map((item: string, i: number) => (
                <div key={i} className="text-xs flex items-center gap-1.5 mb-1"><CheckIcon className="size-3 text-success" /> {item}</div>
              ))}
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2">Today</div>
              {r.today.map((item: string, i: number) => (
                <div key={i} className="text-xs flex items-center gap-1.5 mb-1"><ArrowIcon className="size-3 text-primary" /> {item}</div>
              ))}
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2">Blockers</div>
              {blockers.map((item: string, i: number) => (
                <div key={i} className="text-xs flex items-start gap-1.5 mb-1">
                  <Checkbox idx={i} />
                  <AlertIcon className="size-3 text-destructive shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
              {blockers.length === 0 && <div className="text-xs text-muted-foreground">None</div>}
            </div>
          </div>
          {currentProject && items.length > 0 && (
            <button onClick={() => createTasksFrom(items.map((b: string) => ({ title: `BLOCKER: ${b}`, priority: "high" })), "Daily Scrum")} className="w-full px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110">
              Create {items.length} Task{items.length > 1 ? "s" : ""} from Blockers
            </button>
          )}
        </div>
      );
    }

    if (r.sprintName) {
      const recs = r.recommendations || [];
      const items = recs.filter((_: string, i: number) => selected.has(i));
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">{r.sprintName}</span>
            <span className="text-[10px] font-mono text-muted-foreground">{r.sprintDuration}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-surface-2 border border-border rounded text-center">
              <div className="text-[10px] text-muted-foreground">Done</div>
              <div className="text-lg font-bold text-success">{r.completedTasks}</div>
            </div>
            <div className="p-2 bg-surface-2 border border-border rounded text-center">
              <div className="text-[10px] text-muted-foreground">Velocity</div>
              <div className="text-lg font-bold text-primary">{r.velocity} pts</div>
            </div>
          </div>
          {recs.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-muted-foreground mb-1">Recommendations</div>
              {recs.map((rec: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs p-2 bg-primary/5 border border-primary/20 rounded mb-1">
                  <Checkbox idx={i} />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
          {currentProject && items.length > 0 && (
            <button onClick={() => createTasksFrom(items.map((r: string) => ({ title: r, priority: "medium" })), "Sprint Report")} className="w-full px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110">
              Create {items.length} Task{items.length > 1 ? "s" : ""} from Recommendations
            </button>
          )}
        </div>
      );
    }

    if (r.epic) {
      const tasks = r.tasks || [];
      const selectedTasks = tasks.filter((_: any, i: number) => selected.has(i));
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Epic</span>
            <span className="text-sm font-bold">{r.epic}</span>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1">User Stories ({r.userStories?.length})</div>
            {r.userStories?.map((s: any, i: number) => (
              <div key={i} className="p-2 bg-surface-2 border border-border rounded mb-1 text-xs">
                <div className="font-medium">{s.title}</div>
                {s.description && <div className="text-muted-foreground">{s.description}</div>}
              </div>
            ))}
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1">Tasks ({tasks.length})</div>
            {tasks.map((t: any, i: number) => (
              <div key={i} className="p-2 bg-surface-2 border border-border rounded mb-1 text-xs">
                <div className="flex items-center gap-2">
                  <Checkbox idx={i} />
                  <span className="flex-1 font-medium">{t.title}</span>
                  <span className="text-muted-foreground">{t.assignee}</span>
                  <span className="text-primary font-bold">{t.storyPoints}pts</span>
                </div>
                {t.description && <div className="text-[10px] text-muted-foreground mt-1 ml-6">{t.description}</div>}
              </div>
            ))}
          </div>
          {currentProject && selectedTasks.length > 0 && (
            <button
              onClick={() => {
                selectedTasks.forEach((t: any) => {
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
                    startDate: new Date().toISOString().slice(0, 10),
                    completedAt: "",
                    priority: t.storyPoints >= 5 ? "high" : t.storyPoints >= 3 ? "medium" : "low",
                  });
                });
                setCreatedCount(selectedTasks.length);
              }}
              className="w-full px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 transition-all"
            >
              Create {selectedTasks.length} Selected Task{selectedTasks.length > 1 ? "s" : ""} in "{currentProject.name}"
            </button>
          )}
          {!currentProject && (
            <p className="text-[10px] text-muted-foreground text-center">Select a project first to create tasks.</p>
          )}
        </div>
      );
    }

    return null;
  }

  useEffect(() => {
    if (createdCount !== null) {
      const t = setTimeout(() => setCreatedCount(null), 4000);
      return () => clearTimeout(t);
    }
  }, [createdCount]);

  function needsInput(key: ToolName): boolean {
    return !["daily", "sprint", "insights"].includes(key);
  }

  function getPlaceholder(key: ToolName): string {
    switch (key) {
      case "analyze": return 'e.g. "Tourism website with login, recommendations, GIS map"';
      case "commit": return "Describe your changes…";
      case "branch": return "Describe the feature/fix…";
      case "breakdown": return 'e.g. "Implement user login with OAuth2"';
      case "qa": return "Describe the implementation…";
      default: return "";
    }
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Scrum AI" }, { label: "AI Assistant" }]}
        status={{ label: "8 tools available", tone: "info" }}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Tool Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tools.map((tool) => (
            <button
              key={tool.key}
              onClick={() => {
                setActiveTool(tool.key);
                setResult(null);
              }}
              className={`p-4 bg-card border rounded-lg text-left hover:border-primary/50 transition-colors ${
                activeTool === tool.key ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={activeTool === tool.key ? "text-primary" : "text-muted-foreground"}>{tool.icon}</span>
                <span className="text-xs font-medium">{tool.label}</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-snug">{tool.description}</p>
            </button>
          ))}
        </div>

        {/* Active Tool Panel */}
        {activeTool && (
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">
                {tools.find((t) => t.key === activeTool)?.label}
              </span>
            </div>

            {needsInput(activeTool) && (
              <textarea
                value={inputs[activeTool] || ""}
                onChange={(e) => setInput(activeTool, e.target.value)}
                placeholder={getPlaceholder(activeTool)}
                className="w-full h-24 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary resize-none mb-3"
              />
            )}

            <div className="flex justify-end">
              <button
                onClick={() => handleRun(activeTool)}
                disabled={loading || (needsInput(activeTool) && !(inputs[activeTool] || "").trim())}
                className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                {loading ? "Running…" : "Run"}
              </button>
            </div>

            {/* Result */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-5 text-primary animate-spin" />
              </div>
            )}
            {!loading && result && (
              <div className="mt-5 pt-5 border-t border-border">
                {renderResult()}
                {createdCount !== null && (
                  <div className="mt-3 px-4 py-3 bg-success/10 border border-success/30 rounded-lg text-center">
                    <p className="text-xs font-semibold text-success">
                      {createdCount} task{createdCount > 1 ? "s" : ""} created successfully!
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Go to the Tasks page to view and manage them.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Welcome when no tool selected */}
        {!activeTool && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Sparkles className="size-10 text-primary mb-4" />
            <p className="text-sm font-semibold">AI Assistant Hub</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-md">
              Select an AI tool above to analyze requirements, generate commits, branches, scrum reports, run QA checks, and more.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}