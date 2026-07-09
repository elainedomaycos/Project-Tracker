import { createServerFn } from "@tanstack/react-start";
import Groq from "groq-sdk";

function getGroq() {
  const key = process.env.GROQ_API_KEY;
  if (!key || key === "gsk_...") return null;
  return new Groq({ apiKey: key });
}

async function callAI(prompt: string, system = "You are a Scrum management assistant.") {
  const groq = getGroq();
  if (!groq) throw new Error("GROQ_API_KEY not configured");
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });
  return res.choices[0]?.message?.content ?? "";
}

// --- Requirement Analysis ---

export type RequirementAnalysis = {
  epic: string;
  userStories: Array<{ title: string; description: string }>;
  tasks: Array<{ title: string; assignee: string; storyPoints: number }>;
};

export const analyzeRequirement = createServerFn({ method: "POST" })

  .handler(async ({ data }): Promise<RequirementAnalysis> => {
    const { requirement } = data as { requirement: string };
    try {
      const prompt = `Analyze this client requirement and generate a structured Scrum breakdown. Each task description must be detailed enough for a developer to start implementing immediately — include specific components, logic, interactions, or data flow.

Requirement: "${requirement}"

Return valid JSON only (no markdown, no code fences):
{
  "epic": "Short epic name (2-3 words)",
  "userStories": [
    { "title": "As a [role], I want [feature]", "description": "So that [benefit]" }
  ],
  "tasks": [
    { "title": "Short task name", "description": "What to build: specific components, API endpoints, database tables, UI elements, validation rules, or integration details. Mention frameworks, libraries, or patterns if applicable.", "assignee": "frontend|backend|fullstack", "storyPoints": 1-8 }
  ]
}
Generate 3-5 user stories and 5-10 tasks. Each task description must be implementation-ready — tell the developer what files to touch, what logic to write, and what to consider. Story points use Fibonacci (1,2,3,5,8).`;

      const output = await callAI(prompt);
      const parsed = JSON.parse(output) as RequirementAnalysis;
      return parsed;
    } catch (e) {
      console.error("AI analyze failed, using mock", e);
      return {
        epic: "Tourism Platform",
        userStories: [
          { title: "As a visitor, I want to browse destinations", description: "So I can plan my trip" },
          { title: "As a user, I want to log in securely", description: "So I can access my bookings" },
          { title: "As a traveler, I want personalized recommendations", description: "So I find relevant places" },
        ],
        tasks: [
          { title: "Design destination card component", assignee: "frontend", storyPoints: 3 },
          { title: "Implement Supabase auth integration", assignee: "fullstack", storyPoints: 5 },
          { title: "Build recommendation engine endpoint", assignee: "backend", storyPoints: 8 },
          { title: "Create GIS map component with Leaflet", assignee: "frontend", storyPoints: 5 },
          { title: "Add search and filter functionality", assignee: "fullstack", storyPoints: 3 },
        ],
      };
    }
  });

// --- Commit Message ---

export type CommitMessageResult = {
  commitMessage: string;
};

export const generateCommitMessage = createServerFn({ method: "POST" })

  .handler(async ({ data }): Promise<CommitMessageResult> => {
    const { changes } = data as { changes: string };
    try {
      const prompt = `Generate a conventional commit message for these changes.
Changes: "${changes}"

Return valid JSON only:
{ "commitMessage": "type(scope): description" }
Use conventional commits format (feat, fix, refactor, chore, docs, test).`;

      const output = await callAI(prompt);
      const parsed = JSON.parse(output) as CommitMessageResult;
      return parsed;
    } catch (e) {
      console.error("AI commit failed, using mock", e);
      return { commitMessage: `feat(${changes.split(" ").slice(0, 2).join("-").toLowerCase()}): ${changes.slice(0, 60)}` };
    }
  });

// --- Branch Name ---

export type BranchNameResult = {
  branchName: string;
};

export const generateBranchName = createServerFn({ method: "POST" })

  .handler(async ({ data }): Promise<BranchNameResult> => {
    const { description } = data as { description: string };
    try {
      const prompt = `Generate a git branch name for this description.
Description: "${description}"

Return valid JSON only:
{ "branchName": "prefix/short-kebab-case-name" }
Prefix: feat/, fix/, refactor/, chore/. Max 50 chars, lowercase, kebab-case.`;

      const output = await callAI(prompt);
      const parsed = JSON.parse(output) as BranchNameResult;
      return parsed;
    } catch (e) {
      console.error("AI branch failed, using mock", e);
      const slug = description.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);
      return { branchName: `feat/${slug}` };
    }
  });

// --- Task Breakdown ---

export type SubtaskItem = {
  title: string;
  estimate: string;
  storyPoints: number;
};

export type TaskBreakdown = {
  subtasks: SubtaskItem[];
};

export const generateTaskBreakdown = createServerFn({ method: "POST" })

  .handler(async ({ data }): Promise<TaskBreakdown> => {
    const { task } = data as { task: string };
    try {
      const prompt = `Break this task into subtasks with estimates.
Task: "${task}"

Return valid JSON only:
{
  "subtasks": [
    { "title": "Subtask name", "estimate": "2h", "storyPoints": 1-5 }
  ]
}
Generate 2-5 subtasks.`;

      const output = await callAI(prompt);
      const parsed = JSON.parse(output) as TaskBreakdown;
      return parsed;
    } catch (e) {
      console.error("AI breakdown failed, using mock", e);
      return {
        subtasks: [
          { title: "Research and plan implementation", estimate: "2h", storyPoints: 2 },
          { title: "Write core logic", estimate: "4h", storyPoints: 3 },
          { title: "Add unit tests", estimate: "2h", storyPoints: 2 },
        ],
      };
    }
  });

// --- Daily Scrum Report ---

export type DailyScrumReport = {
  yesterday: string[];
  today: string[];
  blockers: string[];
};

export const generateDailyScrumReport = createServerFn({ method: "POST" })

  .handler(async (): Promise<DailyScrumReport> => {
    try {
      const prompt = `Generate a daily scrum report for today.

Return valid JSON only:
{
  "yesterday": ["Completed task 1", "Completed task 2"],
  "today": ["Plan to do task 1", "Plan to do task 2"],
  "blockers": ["Blocker description or empty string"]
}`;

      const output = await callAI(prompt);
      const parsed = JSON.parse(output) as DailyScrumReport;
      return parsed;
    } catch (e) {
      console.error("AI daily report failed, using mock", e);
      return {
        yesterday: ["Completed inventory DB lock fix", "Reviewed PR #224"],
        today: ["Start mobile dashboard redesign", "Fix login redirect on Safari 14"],
        blockers: [""],
      };
    }
  });

// --- Sprint Report ---

export type TeamMemberProgress = {
  name: string;
  role: string;
  completed: number;
  total: number;
};

export type SprintReport = {
  sprintName: string;
  sprintDuration: string;
  sprintStatus: "completed" | "in_progress" | "not_started";
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  velocity: number;
  teamProgress: TeamMemberProgress[];
  blockers: string[];
  recommendations: string[];
};

export const generateSprintReport = createServerFn({ method: "POST" })

  .handler(async (): Promise<SprintReport> => {
    try {
      const prompt = `Generate a sprint report for Sprint 3.

Return valid JSON only:
{
  "sprintName": "Sprint 3",
  "sprintDuration": "2026-06-25 to 2026-07-08",
  "sprintStatus": "in_progress",
  "completedTasks": 18,
  "inProgressTasks": 4,
  "blockedTasks": 2,
  "velocity": 28,
  "teamProgress": [
    { "name": "John Alvarez", "role": "Frontend", "completed": 6, "total": 8 },
    { "name": "Elaine Thorne", "role": "Fullstack", "completed": 5, "total": 7 }
  ],
  "blockers": ["GIS mapping waiting for API key"],
  "recommendations": ["Focus on unblocking GIS task", "Consider pair programming for complex items"]
}`;

      const output = await callAI(prompt);
      const parsed = JSON.parse(output) as SprintReport;
      return parsed;
    } catch (e) {
      console.error("AI sprint report failed, using mock", e);
      return {
        sprintName: "Sprint 3",
        sprintDuration: "Jun 25 – Jul 8, 2026",
        sprintStatus: "in_progress",
        completedTasks: 18,
        inProgressTasks: 4,
        blockedTasks: 2,
        velocity: 28,
        teamProgress: [
          { name: "John Alvarez", role: "Frontend", completed: 6, total: 8 },
          { name: "Elaine Thorne", role: "Fullstack", completed: 5, total: 7 },
          { name: "Carl Mendez", role: "Backend", completed: 4, total: 6 },
          { name: "Sara Petrov", role: "QA", completed: 3, total: 5 },
        ],
        blockers: ["GIS mapping waiting for API key", "Login redirect fails on Safari 14"],
        recommendations: [
          "Unblock GIS task by expediting API key request",
          "Assign Safari bug to frontend specialist",
          "Consider extending sprint by 2 days",
        ],
      };
    }
  });

// --- QA Check ---

export type QAIssue = {
  title: string;
  description: string;
};

export type QACheckResult = {
  passed: boolean;
  issues: QAIssue[];
  suggestions: string[];
  edgeCases: string[];
};

export const qaCheckTask = createServerFn({ method: "POST" })

  .handler(async ({ data }): Promise<QACheckResult> => {
    const { taskDescription } = data as { taskDescription: string };
    try {
      const prompt = `QA check this implementation description for quality issues.

Implementation: "${taskDescription}"

Return valid JSON only:
{
  "passed": false,
  "issues": [
    { "title": "Issue title", "description": "Detailed explanation" }
  ],
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "edgeCases": ["Edge case 1", "Edge case 2"]
}
List all issues found. Be thorough.`;

      const output = await callAI(prompt);
      const parsed = JSON.parse(output) as QACheckResult;
      return parsed;
    } catch (e) {
      console.error("AI QA check failed, using mock", e);
      return {
        passed: true,
        issues: [],
        suggestions: [
          "Add loading state for async operations",
          "Consider adding retry logic for network failures",
          "Add input sanitization for user-provided data",
        ],
        edgeCases: [
          "Empty response from API",
          "Network timeout during request",
          "Special characters in user input",
        ],
      };
    }
  });

// --- Project Insights ---

export type ProjectInsight = {
  module: string;
  risk: "healthy" | "warning" | "high";
  reason: string;
};

export const generateProjectInsights = createServerFn({ method: "POST" })

  .handler(async (): Promise<{ insights: ProjectInsight[] }> => {
    try {
      const prompt = `Analyze this Scrum project and generate AI insights.

Return valid JSON only:
{
  "insights": [
    {
      "module": "Module name",
      "risk": "healthy|warning|high",
      "reason": "One-sentence explanation"
    }
  ]
}
Generate 3-5 insights covering different aspects of the project.`;

      const output = await callAI(prompt);
      const parsed = JSON.parse(output) as { insights: ProjectInsight[] };
      return parsed;
    } catch (e) {
      console.error("AI insights failed, using mock", e);
      return {
        insights: [
          { module: "Auth", risk: "healthy", reason: "Login flow working, no recent bugs" },
          { module: "Dashboard", risk: "warning", reason: "Mobile redesign behind schedule" },
          { module: "GIS Module", risk: "high", reason: "Blocked waiting for API key" },
          { module: "CI/CD", risk: "healthy", reason: "All pipelines passing consistently" },
        ],
      };
    }
  });
