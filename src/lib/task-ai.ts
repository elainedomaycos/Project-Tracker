import { z } from "zod";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";

const FIELD_OPTIONS = ["Full Stack", "Front End", "Back End", "Database", "UI/UX", "Testing"];

const aiTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  field: z.string(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  endUser: z.string(),
  module: z.string(),
  developer: z.string(),
  startDate: z.string(),
  dueDate: z.string(),
});

export type AiParsedTask = z.infer<typeof aiTaskSchema>;

export type TaskAiInput = {
  description: string;
  endUsers: string[];
  modules: string[];
  developers: string[];
};

function extractJson(content: string): unknown {
  const trimmed = content.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through to brace matching
  }
  const start = trimmed.indexOf("{");
  if (start === -1) throw new Error("AI did not return a JSON object");
  let depth = 0;
  for (let i = start; i < trimmed.length; i++) {
    if (trimmed[i] === "{") depth++;
    else if (trimmed[i] === "}") {
      depth--;
      if (depth === 0) return JSON.parse(trimmed.slice(start, i + 1));
    }
  }
  throw new Error("AI returned unparseable JSON");
}

function normalizeResult(raw: unknown): AiParsedTask {
  const parsed = aiTaskSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `AI returned an invalid task: ${parsed.error.issues.map((i) => i.message).join("; ")}`,
    );
  }
  const field = parsed.data.field;
  if (field && !FIELD_OPTIONS.includes(field)) parsed.data.field = "";
  return parsed.data;
}

export async function generateTaskFromDescription(input: TaskAiInput): Promise<AiParsedTask> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("Groq API key not configured");

  const today = new Date().toISOString().slice(0, 10);

  const validEndUsers = input.endUsers.length ? input.endUsers.join(", ") : "none";
  const validModules = input.modules.length ? input.modules.join(", ") : "none";
  const validDevelopers = input.developers.length ? input.developers.join(", ") : "none";

  const system =
    "You are an expert Scrum task creator. Given a user's natural-language description of a problem or " +
    "ticket, you create ONE well-structured task and auto-classify it. Return ONLY a valid JSON object with " +
    "exactly these fields:\n" +
    "- title: a concise, action-oriented task title (imperative, e.g. 'Fix login redirect')\n" +
    "- description: a clear summary of the task that captures the problem and what needs to be done\n" +
    "- field: one of " +
    JSON.stringify(FIELD_OPTIONS) +
    " — pick the closest matching category, or empty string if none fit\n" +
    "- priority: one of 'low', 'medium', 'high', 'critical' — base it on the severity/impact described\n" +
    "- endUser: one of the provided end users that is most relevant, or empty string\n" +
    "- module: one of the provided modules that is most relevant, or empty string\n" +
    "- developer: one of the provided developers best suited to this task, or empty string\n" +
    "- startDate: 'YYYY-MM-DD' (use " +
    today +
    " by default)\n" +
    "- dueDate: 'YYYY-MM-DD' a reasonable deadline considering priority and complexity\n" +
    "Rules: only use endUser/module/developer values that were provided. If nothing matches, use empty string. " +
    "Every date must be in YYYY-MM-DD format. Return ONLY the JSON object, no extra text.";

  const user =
    `Today is ${today}.\n` +
    `Available end users: ${validEndUsers}\n` +
    `Available modules: ${validModules}\n` +
    `Available developers: ${validDevelopers}\n\n` +
    `Problem / ticket description:\n"${input.description}"`;

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.1,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const data = await res.json();
  const content: string = data.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("AI returned an empty response");
  return normalizeResult(extractJson(content));
}
