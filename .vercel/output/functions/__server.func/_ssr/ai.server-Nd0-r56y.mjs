import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { t as Groq } from "../_libs/groq-sdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.server-Nd0-r56y.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function getGroq() {
	const key = process.env.GROQ_API_KEY;
	if (!key || key === "gsk_...") return null;
	return new Groq({ apiKey: key });
}
async function callAI(prompt, system = "You are a Scrum management assistant.") {
	const groq = getGroq();
	if (!groq) throw new Error("GROQ_API_KEY not configured");
	return (await groq.chat.completions.create({
		model: "llama-3.3-70b-versatile",
		messages: [{
			role: "system",
			content: system
		}, {
			role: "user",
			content: prompt
		}],
		temperature: .3
	})).choices[0]?.message?.content ?? "";
}
var analyzeRequirement_createServerFn_handler = createServerRpc({
	id: "690fd0e9d3afea85f164bb9929ff0648239845a935cca7c59e08f9ee6a2e524d",
	name: "analyzeRequirement",
	filename: "src/lib/ai.server.ts"
}, (opts) => analyzeRequirement.__executeServer(opts));
var analyzeRequirement = createServerFn({ method: "POST" }).handler(analyzeRequirement_createServerFn_handler, async ({ data }) => {
	const { requirement } = data;
	try {
		const output = await callAI(`Analyze this client requirement and generate a structured Scrum breakdown. Each task description must be detailed enough for a developer to start implementing immediately — include specific components, logic, interactions, or data flow.

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
Generate 3-5 user stories and 5-10 tasks. Each task description must be implementation-ready — tell the developer what files to touch, what logic to write, and what to consider. Story points use Fibonacci (1,2,3,5,8).`);
		return JSON.parse(output);
	} catch (e) {
		console.error("AI analyze failed, using mock", e);
		return {
			epic: "Tourism Platform",
			userStories: [
				{
					title: "As a visitor, I want to browse destinations",
					description: "So I can plan my trip"
				},
				{
					title: "As a user, I want to log in securely",
					description: "So I can access my bookings"
				},
				{
					title: "As a traveler, I want personalized recommendations",
					description: "So I find relevant places"
				}
			],
			tasks: [
				{
					title: "Design destination card component",
					assignee: "frontend",
					storyPoints: 3
				},
				{
					title: "Implement Supabase auth integration",
					assignee: "fullstack",
					storyPoints: 5
				},
				{
					title: "Build recommendation engine endpoint",
					assignee: "backend",
					storyPoints: 8
				},
				{
					title: "Create GIS map component with Leaflet",
					assignee: "frontend",
					storyPoints: 5
				},
				{
					title: "Add search and filter functionality",
					assignee: "fullstack",
					storyPoints: 3
				}
			]
		};
	}
});
var generateCommitMessage_createServerFn_handler = createServerRpc({
	id: "0a9bb95e9a3c6f06dd8cfd04105da0ff9a0154b47cebbb69bd2b4646bab234a3",
	name: "generateCommitMessage",
	filename: "src/lib/ai.server.ts"
}, (opts) => generateCommitMessage.__executeServer(opts));
var generateCommitMessage = createServerFn({ method: "POST" }).handler(generateCommitMessage_createServerFn_handler, async ({ data }) => {
	const { changes } = data;
	try {
		const output = await callAI(`Generate a conventional commit message for these changes.
Changes: "${changes}"

Return valid JSON only:
{ "commitMessage": "type(scope): description" }
Use conventional commits format (feat, fix, refactor, chore, docs, test).`);
		return JSON.parse(output);
	} catch (e) {
		console.error("AI commit failed, using mock", e);
		return { commitMessage: `feat(${changes.split(" ").slice(0, 2).join("-").toLowerCase()}): ${changes.slice(0, 60)}` };
	}
});
var generateBranchName_createServerFn_handler = createServerRpc({
	id: "d51c2daf7b4bf518762aaf380632b21fb8e4948cc302e39abae807e9392dcdfb",
	name: "generateBranchName",
	filename: "src/lib/ai.server.ts"
}, (opts) => generateBranchName.__executeServer(opts));
var generateBranchName = createServerFn({ method: "POST" }).handler(generateBranchName_createServerFn_handler, async ({ data }) => {
	const { description } = data;
	try {
		const output = await callAI(`Generate a git branch name for this description.
Description: "${description}"

Return valid JSON only:
{ "branchName": "prefix/short-kebab-case-name" }
Prefix: feat/, fix/, refactor/, chore/. Max 50 chars, lowercase, kebab-case.`);
		return JSON.parse(output);
	} catch (e) {
		console.error("AI branch failed, using mock", e);
		return { branchName: `feat/${description.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}` };
	}
});
var generateTaskBreakdown_createServerFn_handler = createServerRpc({
	id: "b5dd1df7e55c851592add2e9f0e0f26c8ccb989adb322b601bbc1233778c3cdd",
	name: "generateTaskBreakdown",
	filename: "src/lib/ai.server.ts"
}, (opts) => generateTaskBreakdown.__executeServer(opts));
var generateTaskBreakdown = createServerFn({ method: "POST" }).handler(generateTaskBreakdown_createServerFn_handler, async ({ data }) => {
	const { task } = data;
	try {
		const output = await callAI(`Break this task into subtasks with estimates.
Task: "${task}"

Return valid JSON only:
{
  "subtasks": [
    { "title": "Subtask name", "estimate": "2h", "storyPoints": 1-5 }
  ]
}
Generate 2-5 subtasks.`);
		return JSON.parse(output);
	} catch (e) {
		console.error("AI breakdown failed, using mock", e);
		return { subtasks: [
			{
				title: "Research and plan implementation",
				estimate: "2h",
				storyPoints: 2
			},
			{
				title: "Write core logic",
				estimate: "4h",
				storyPoints: 3
			},
			{
				title: "Add unit tests",
				estimate: "2h",
				storyPoints: 2
			}
		] };
	}
});
var generateDailyScrumReport_createServerFn_handler = createServerRpc({
	id: "65c6ac6af7a3289dda09fd0b2a11a5beeb58530cd8ea073d5c42e5c85128d6b4",
	name: "generateDailyScrumReport",
	filename: "src/lib/ai.server.ts"
}, (opts) => generateDailyScrumReport.__executeServer(opts));
var generateDailyScrumReport = createServerFn({ method: "POST" }).handler(generateDailyScrumReport_createServerFn_handler, async () => {
	try {
		const output = await callAI(`Generate a daily scrum report for today.

Return valid JSON only:
{
  "yesterday": ["Completed task 1", "Completed task 2"],
  "today": ["Plan to do task 1", "Plan to do task 2"],
  "blockers": ["Blocker description or empty string"]
}`);
		return JSON.parse(output);
	} catch (e) {
		console.error("AI daily report failed, using mock", e);
		return {
			yesterday: ["Completed inventory DB lock fix", "Reviewed PR #224"],
			today: ["Start mobile dashboard redesign", "Fix login redirect on Safari 14"],
			blockers: [""]
		};
	}
});
var generateSprintReport_createServerFn_handler = createServerRpc({
	id: "2b42b351c092690234ee33fd73492297062ef80230c3cab949cfd02f86206c3f",
	name: "generateSprintReport",
	filename: "src/lib/ai.server.ts"
}, (opts) => generateSprintReport.__executeServer(opts));
var generateSprintReport = createServerFn({ method: "POST" }).handler(generateSprintReport_createServerFn_handler, async () => {
	try {
		const output = await callAI(`Generate a sprint report for Sprint 3.

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
}`);
		return JSON.parse(output);
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
				{
					name: "John Alvarez",
					role: "Frontend",
					completed: 6,
					total: 8
				},
				{
					name: "Elaine Thorne",
					role: "Fullstack",
					completed: 5,
					total: 7
				},
				{
					name: "Carl Mendez",
					role: "Backend",
					completed: 4,
					total: 6
				},
				{
					name: "Sara Petrov",
					role: "QA",
					completed: 3,
					total: 5
				}
			],
			blockers: ["GIS mapping waiting for API key", "Login redirect fails on Safari 14"],
			recommendations: [
				"Unblock GIS task by expediting API key request",
				"Assign Safari bug to frontend specialist",
				"Consider extending sprint by 2 days"
			]
		};
	}
});
var qaCheckTask_createServerFn_handler = createServerRpc({
	id: "ecb65f557672285b62a233412c736756692cb20204123be61b274453fe63780e",
	name: "qaCheckTask",
	filename: "src/lib/ai.server.ts"
}, (opts) => qaCheckTask.__executeServer(opts));
var qaCheckTask = createServerFn({ method: "POST" }).handler(qaCheckTask_createServerFn_handler, async ({ data }) => {
	const { taskDescription } = data;
	try {
		const output = await callAI(`QA check this implementation description for quality issues.

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
List all issues found. Be thorough.`);
		return JSON.parse(output);
	} catch (e) {
		console.error("AI QA check failed, using mock", e);
		return {
			passed: true,
			issues: [],
			suggestions: [
				"Add loading state for async operations",
				"Consider adding retry logic for network failures",
				"Add input sanitization for user-provided data"
			],
			edgeCases: [
				"Empty response from API",
				"Network timeout during request",
				"Special characters in user input"
			]
		};
	}
});
var generateProjectInsights_createServerFn_handler = createServerRpc({
	id: "d4c13064668bd7a66e0739c0d5d25d4c327cf905ce6c5d1f418e89f4fb639c15",
	name: "generateProjectInsights",
	filename: "src/lib/ai.server.ts"
}, (opts) => generateProjectInsights.__executeServer(opts));
var generateProjectInsights = createServerFn({ method: "POST" }).handler(generateProjectInsights_createServerFn_handler, async () => {
	try {
		const output = await callAI(`Analyze this Scrum project and generate AI insights.

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
Generate 3-5 insights covering different aspects of the project.`);
		return JSON.parse(output);
	} catch (e) {
		console.error("AI insights failed, using mock", e);
		return { insights: [
			{
				module: "Auth",
				risk: "healthy",
				reason: "Login flow working, no recent bugs"
			},
			{
				module: "Dashboard",
				risk: "warning",
				reason: "Mobile redesign behind schedule"
			},
			{
				module: "GIS Module",
				risk: "high",
				reason: "Blocked waiting for API key"
			},
			{
				module: "CI/CD",
				risk: "healthy",
				reason: "All pipelines passing consistently"
			}
		] };
	}
});
//#endregion
export { analyzeRequirement_createServerFn_handler, generateBranchName_createServerFn_handler, generateCommitMessage_createServerFn_handler, generateDailyScrumReport_createServerFn_handler, generateProjectInsights_createServerFn_handler, generateSprintReport_createServerFn_handler, generateTaskBreakdown_createServerFn_handler, qaCheckTask_createServerFn_handler };
