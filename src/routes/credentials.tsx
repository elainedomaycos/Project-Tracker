import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/console";
import { useState } from "react";
import { Plus, X, Eye, EyeOff, Copy, Key, CheckCircle2, Globe, Database, Mail, Lock } from "lucide-react";

export const Route = createFileRoute("/credentials")({
  head: () => ({
    meta: [
      { title: "Credentials · Scrum AI" },
      { name: "description", content: "Manage project credentials: API keys, logins, database URLs." },
    ],
  }),
  component: Credentials,
});

type CredType = "api" | "login" | "database" | "other";

type Credential = {
  id: string;
  type: CredType;
  service: string;
  username?: string;
  key: string;
  value: string;
  url?: string;
  description: string;
  createdAt: string;
};

const TYPE_META: Record<CredType, { label: string; icon: typeof Key }> = {
  api: { label: "API Key", icon: Key },
  login: { label: "Login", icon: Lock },
  database: { label: "Database", icon: Database },
  other: { label: "Other", icon: Globe },
};

function generateId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

const INITIAL_CREDS: Credential[] = [
  { id: generateId(), type: "api", service: "Groq", key: "GROQ_API_KEY", value: "gsk_••••••••••••••••", url: "https://console.groq.com", description: "Llama 3.3 70B for AI Scrum features", createdAt: "2026-06-20" },
  { id: generateId(), type: "database", service: "Supabase", key: "SUPABASE_URL", value: "https://jiiecdlxxzzskxcbfepi.supabase.co", description: "Project database and auth", createdAt: "2026-06-15" },
  { id: generateId(), type: "login", service: "SMTP Server", username: "noreply@sprint.app", key: "SMTP_PASSWORD", value: "••••••••••••", url: "https://mail.example.com", description: "Email sending for notifications", createdAt: "2026-06-18" },
  { id: generateId(), type: "api", service: "GitHub", key: "GITHUB_TOKEN", value: "ghp_••••••••••••••••", url: "https://github.com", description: "Repository access", createdAt: "2026-06-18" },
];

function Credentials() {
  const [creds, setCreds] = useState<Credential[]>(INITIAL_CREDS);
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [form, setForm] = useState({
    type: "api" as CredType,
    service: "",
    username: "",
    key: "",
    value: "",
    url: "",
    description: "",
  });

  const Icon = TYPE_META[form.type].icon;

  function handleAdd() {
    if (!form.service.trim() || !form.key.trim() || !form.value.trim()) return;
    const entry: Credential = {
      id: generateId(),
      type: form.type,
      service: form.service.trim(),
      username: form.username.trim() || undefined,
      key: form.key.trim(),
      value: form.value.trim(),
      url: form.url.trim() || undefined,
      description: form.description.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setCreds((prev) => [entry, ...prev]);
    setForm({ type: "api", service: "", username: "", key: "", value: "", url: "", description: "" });
    setShowModal(false);
  }

  function handleRemove(id: string) {
    setCreds((prev) => prev.filter((c) => c.id !== id));
  }

  function handleCopy(val: string, id: string) {
    navigator.clipboard.writeText(val).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }

  function maskValue(val: string) {
    if (val.length <= 8) return "•".repeat(val.length);
    return val.slice(0, 4) + "•".repeat(Math.min(val.length - 8, 24)) + val.slice(-4);
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Scrum AI" }, { label: "Credentials" }]}
        status={{ label: `${creds.length} stored`, tone: "info" }}
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 flex items-center gap-1.5"
          >
            <Plus className="size-3.5" />
            Add Credential
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {creds.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <Key className="size-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-muted-foreground">No credentials stored</p>
            <p className="text-xs text-muted-foreground mt-1">Add API keys, logins, database URLs, and other secrets for your project.</p>
          </div>
        ) : (
          <div className="space-y-2 max-w-3xl">
            {creds.map((c) => {
              const isVisible = visible[c.id];
              const TypeIcon = TYPE_META[c.type].icon;
              return (
                <div key={c.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-md">
                  <div className="size-10 rounded-md bg-surface-2 border border-border grid place-items-center shrink-0">
                    <TypeIcon className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{c.service}</span>
                      <span className="text-[9px] font-mono uppercase text-muted-foreground bg-surface-2 px-1 rounded">{TYPE_META[c.type].label}</span>
                      <span className="text-[10px] font-mono text-muted-foreground bg-surface-2 px-1.5 rounded">{c.key}</span>
                    </div>
                    {c.username && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="text-[10px] font-mono uppercase">Username:</span> {c.username}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs font-mono text-muted-foreground break-all">
                        {isVisible ? c.value : maskValue(c.value)}
                      </code>
                      <button onClick={() => setVisible((p) => ({ ...p, [c.id]: !isVisible }))} className="p-0.5 rounded hover:bg-surface-2 text-muted-foreground shrink-0" title={isVisible ? "Hide" : "Show"}>
                        {isVisible ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                      </button>
                      <button onClick={() => handleCopy(c.value, c.id)} className="p-0.5 rounded hover:bg-surface-2 text-muted-foreground shrink-0" title="Copy">
                        {copiedId === c.id ? <CheckCircle2 className="size-3 text-success" /> : <Copy className="size-3" />}
                      </button>
                    </div>
                    {c.description && <p className="text-[10px] text-muted-foreground mt-1">{c.description}</p>}
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline mt-0.5 inline-block">
                        {c.url}
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[9px] font-mono text-muted-foreground">{c.createdAt}</span>
                    <button onClick={() => handleRemove(c.id)} className="p-1 rounded hover:bg-surface-2 text-muted-foreground hover:text-destructive" title="Remove">
                      <X className="size-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-lg bg-card border border-border rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-sm font-semibold flex items-center gap-2"><Icon className="size-4 text-primary" /> Add Credential</span>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-surface-2 text-muted-foreground"><X className="size-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Type</label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {(["api", "login", "database", "other"] as const).map((t) => {
                    const m = TYPE_META[t];
                    const active = form.type === t;
                    return (
                      <button key={t} onClick={() => setForm((p) => ({ ...p, type: t }))}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-md border text-xs transition-colors ${active ? "bg-primary/10 border-primary text-primary" : "bg-surface-2 border-border text-muted-foreground hover:border-primary/40"}`}
                      >
                        <m.icon className="size-4" />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">Service *</label>
                  <input value={form.service} onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))} placeholder="e.g. OpenAI, AWS, Gmail" className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary" autoFocus />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">Key Name *</label>
                  <input value={form.key} onChange={(e) => setForm((p) => ({ ...p, key: e.target.value }))} placeholder={form.type === "login" ? "SMTP_PASSWORD" : form.type === "database" ? "DB_URL" : "API_KEY"} className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              {form.type === "login" && (
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">Username / Email</label>
                  <input value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} placeholder="user@example.com" className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary" />
                </div>
              )}
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Secret Value *</label>
                <textarea value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} placeholder={form.type === "login" ? "Enter password here" : form.type === "database" ? "postgresql://user:pass@host:5432/db" : "Paste the token or key here"} className="w-full mt-1 h-20 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary resize-none font-mono" />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Service URL</label>
                <input value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} placeholder="https://..." className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Description</label>
                <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="What is this credential used for?" className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-medium rounded border border-border hover:bg-surface-2">Cancel</button>
              <button onClick={handleAdd} disabled={!form.service.trim() || !form.key.trim() || !form.value.trim()} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 disabled:opacity-50">Save Credential</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}