import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const parseEventServerFn = createServerFn({ method: "POST" })
  .validator((data: { rawText: string }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API key not configured");

    const today = new Date().toISOString().split("T")[0];

    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content: `You are an event information extractor. Given raw text about an event, extract structured fields and return ONLY valid JSON.

Return a JSON object with these fields:
- name: string (event name/title)
- description: string (brief description, 1-2 sentences)
- theme: string (main theme or topic, empty string if not found)
- category: one of "hackathon", "convention", "conference", "meetup", "workshop", "other" — classify based on the event content
- start_date: string in "YYYY-MM-DDTHH:mm" format (convert to ISO local datetime, use ${today} as reference year if year is missing)
- end_date: string in "YYYY-MM-DDTHH:mm" format
- location: string (city, venue, or "Online" if virtual, empty string if not found)
- registration_url: string (URL if found, empty string if not found)

Rules:
- If only a date is given without time, use 09:00 for start and 17:00 for end
- If only one date is given, set both start and end to that date
- Be smart about classification: hackathon = coding competition, convention = fan/expo event, conference = professional talks, meetup = informal gathering, workshop = hands-on learning
- Return ONLY the JSON, no explanation`,
          },
          {
            role: "user",
            content: data.rawText,
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Groq API error: ${err}`);
    }

    const result = await res.json();
    const content = result.choices?.[0]?.message?.content ?? "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON");

    const parsed = JSON.parse(jsonMatch[0]);

    const validCategories = ["hackathon", "convention", "conference", "meetup", "workshop", "other"];
    if (!validCategories.includes(parsed.category)) parsed.category = "other";

    return parsed;
  });

export const Route = createFileRoute("/api/parse-event")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();
        const result = await parseEventServerFn({ data: { rawText: body.rawText } });
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
