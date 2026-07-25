export type ParsedEvent = {
  name: string;
  description: string;
  theme: string;
  category: "hackathon" | "convention" | "conference" | "meetup" | "workshop" | "other";
  start_date: string;
  end_date: string;
  location: string;
  registration_url: string;
};

export async function parseEventFromText(rawText: string): Promise<ParsedEvent> {
  const res = await fetch("/api/parse-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawText }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(err.message || `Server error: ${res.status}`);
  }

  return res.json();
}
