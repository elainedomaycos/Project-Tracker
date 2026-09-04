import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/console";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  X,
  Eye,
  EyeOff,
  Copy,
  Key,
  CheckCircle2,
  Globe,
  Database,
  Lock,
  Search,
  Upload,
  Download,
  FileCode,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProject } from "@/lib/project-context";

let realtimeSeq = 0;

export const Route = createFileRoute("/credentials")({
  head: () => ({
    meta: [
      { title: "Credentials · Scrum AI" },
      {
        name: "description",
        content: "Manage project credentials: API keys, logins, database URLs.",
      },
    ],
  }),
  component: Credentials,
});

type CredType = "api" | "login" | "database" | "other";

type Credential = {
  id: string;
  projectId: string | null;
  type: CredType;
  service: string;
  username?: string;
  key: string;
  value: string;
  url?: string;
  endUser: string;
  description: string;
  createdAt: string;
};

const TYPE_META: Record<CredType, { label: string; icon: typeof Key }> = {
  api: { label: "API Key", icon: Key },
  login: { label: "Login", icon: Lock },
  database: { label: "Database", icon: Database },
  other: { label: "Other", icon: Globe },
};

type CredRow = {
  id: string;
  project_id: string | null;
  type: CredType;
  service: string;
  username: string | null;
  key: string;
  value: string;
  url: string | null;
  end_user: string | null;
  description: string | null;
  created_at: string;
};

function generateId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

type ParsedEnvVar = { key: string; value: string; include: boolean };

function parseEnvFile(text: string): ParsedEnvVar[] {
  const out: ParsedEnvVar[] = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const withoutExport = line.startsWith("export ") ? line.slice(7) : line;
    const eq = withoutExport.indexOf("=");
    if (eq === -1) continue;
    const key = withoutExport.slice(0, eq).trim();
    if (!key || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    let value = withoutExport.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    // strip inline comments on unquoted values, e.g. FOO=bar # comment
    const hashIdx = value.indexOf(" #");
    if (hashIdx !== -1 && !value.startsWith('"') && !value.startsWith("'")) {
      value = value.slice(0, hashIdx).trim();
    }
    out.push({ key, value, include: true });
  }
  return out;
}

function envQuoteValue(value: string): string {
  if (value === "") return '""';
  if (/^[A-Za-z0-9_.\-/:@]+$/.test(value)) return value;
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
}

function toEnvLine(c: { key: string; value: string }): string {
  return `${c.key}=${envQuoteValue(c.value)}`;
}

function toEnvBlock(list: { key: string; value: string }[]): string {
  return list.map(toEnvLine).join("\n") + "\n";
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function fromDbCred(r: CredRow): Credential {
  return {
    id: r.id,
    projectId: r.project_id ?? null,
    type: r.type,
    service: r.service,
    username: r.username || undefined,
    key: r.key,
    value: r.value,
    url: r.url || undefined,
    endUser: r.end_user || "",
    description: r.description || "",
    createdAt: (r.created_at || "").slice(0, 10),
  };
}

async function fetchCreds(): Promise<Credential[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("credentials")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []).map(fromDbCred);
}

function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-[10px] font-mono uppercase text-muted-foreground px-3 py-3 whitespace-nowrap ${className ?? ""}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-3 ${className ?? ""}`}>{children}</td>;
}

function Credentials() {
  const { currentProject, projects, archivedProjects } = useProject();
  const [creds, setCreds] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [envCopiedId, setEnvCopiedId] = useState<string | null>(null);
  const [copiedAllEnv, setCopiedAllEnv] = useState(false);
  const [search, setSearch] = useState("");
  const [sortEndUser, setSortEndUser] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importVars, setImportVars] = useState<ParsedEnvVar[]>([]);
  const [importFileName, setImportFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [importForm, setImportForm] = useState({
    projectId: "",
    service: "",
    endUser: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pid = currentProject?.id ?? null;
  const visibleCreds = pid ? creds.filter((c) => c.projectId === pid) : creds;
  const allProjects = [...projects, ...archivedProjects];

  const sortUserOptions = pid
    ? (currentProject?.endUsers ?? [])
    : [...new Set(visibleCreds.map((c) => c.endUser).filter(Boolean))].sort();

  const filteredCreds = visibleCreds
    .filter((c) => {
      if (sortEndUser && c.endUser !== sortEndUser) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const hay = [
        c.service,
        c.key,
        c.username ?? "",
        c.endUser,
        c.description,
        allProjects.find((p) => p.id === c.projectId)?.name ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    })
    .sort((a, b) => (a.endUser || "zzz").localeCompare(b.endUser || "zzz"));

  const [form, setForm] = useState({
    projectId: pid ?? "",
    type: "api" as CredType,
    service: "",
    username: "",
    key: "",
    value: "",
    url: "",
    endUser: "",
    description: "",
  });

  const formProject = allProjects.find((p) => p.id === form.projectId);
  const endUserOptions = formProject?.endUsers ?? [];
  const Icon = TYPE_META[form.type].icon;

  useEffect(() => {
    let mounted = true;
    fetchCreds()
      .then((list) => {
        if (!mounted) return;
        setCreds(list);
        setLoading(false);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Live-sync credentials so adds/removes by other users appear instantly
  useEffect(() => {
    const channel = supabase
      .channel(`credentials-changes:${++realtimeSeq}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "credentials" }, () => {
        fetchCreds()
          .then(setCreds)
          .catch(() => {});
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function openModal() {
    setForm((p) => ({ ...p, projectId: pid ?? "" }));
    setShowModal(true);
  }

  function handleAdd() {
    if (!form.projectId || !form.service.trim() || !form.key.trim() || !form.value.trim()) return;
    const entry: Credential = {
      id: generateId(),
      projectId: form.projectId,
      type: form.type,
      service: form.service.trim(),
      username: form.username.trim() || undefined,
      key: form.key.trim(),
      value: form.value.trim(),
      url: form.url.trim() || undefined,
      endUser: form.endUser,
      description: form.description.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setCreds((prev) => [entry, ...prev]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("credentials")
      .insert({
        id: entry.id,
        project_id: entry.projectId,
        type: entry.type,
        service: entry.service,
        username: entry.username ?? null,
        key: entry.key,
        value: entry.value,
        url: entry.url ?? null,
        end_user: entry.endUser || null,
        description: entry.description,
        created_at: new Date().toISOString(),
      })
      .then(() => toast.success("Credential added"))
      .catch(() => toast.error("Failed to add credential"));
    setForm({
      projectId: pid ?? "",
      type: "api",
      service: "",
      username: "",
      key: "",
      value: "",
      url: "",
      endUser: "",
      description: "",
    });
    setShowModal(false);
  }

  function openImportModal() {
    setImportForm({ projectId: pid ?? "", service: "", endUser: "" });
    setImportVars([]);
    setImportFileName("");
    setShowImportModal(true);
  }

  function handleEnvFile(file: File) {
    file.text().then((text) => {
      const parsed = parseEnvFile(text);
      setImportVars(parsed);
      setImportFileName(file.name);
      if (parsed.length === 0) toast.error("No KEY=VALUE pairs found in that file");
    });
  }

  function toggleImportVar(key: string) {
    setImportVars((prev) =>
      prev.map((v) => (v.key === key ? { ...v, include: !v.include } : v)),
    );
  }

  function handleImportSave() {
    const selected = importVars.filter((v) => v.include && v.value);
    if (!importForm.projectId || selected.length === 0) return;
    const now = new Date().toISOString();
    const entries: Credential[] = selected.map((v) => ({
      id: generateId(),
      projectId: importForm.projectId,
      type: "api",
      service: importForm.service.trim() || importFileName.replace(/\.env.*$/i, "") || "Imported",
      key: v.key,
      value: v.value,
      endUser: importForm.endUser,
      description: "",
      createdAt: now.slice(0, 10),
    }));
    setCreds((prev) => [...entries, ...prev]);
    setImporting(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("credentials")
      .insert(
        entries.map((entry) => ({
          id: entry.id,
          project_id: entry.projectId,
          type: entry.type,
          service: entry.service,
          username: null,
          key: entry.key,
          value: entry.value,
          url: null,
          end_user: entry.endUser || null,
          description: entry.description,
          created_at: now,
        })),
      )
      .then(() => toast.success(`Imported ${entries.length} credential${entries.length === 1 ? "" : "s"}`))
      .catch(() => toast.error("Failed to import credentials"))
      .finally(() => setImporting(false));
    setShowImportModal(false);
  }

  function handleRemove(id: string) {
    setCreds((prev) => prev.filter((c) => c.id !== id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("credentials")
      .delete()
      .eq("id", id)
      .then(() => toast.success("Credential removed"))
      .catch(() => toast.error("Failed to remove credential"));
  }

  function handleUpdateEndUser(id: string, endUser: string) {
    setCreds((prev) => prev.map((c) => (c.id === id ? { ...c, endUser } : c)));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("credentials")
      .update({ end_user: endUser || null })
      .eq("id", id)
      .then(() => toast.success("Credential updated"))
      .catch(() => toast.error("Failed to update credential"));
  }

  function handleCopy(val: string, id: string) {
    navigator.clipboard.writeText(val).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }

  function handleCopyEnvLine(c: Credential) {
    navigator.clipboard.writeText(toEnvLine(c)).then(() => {
      setEnvCopiedId(c.id);
      toast.success(`Copied ${c.key}=... `);
      setTimeout(() => setEnvCopiedId(null), 1500);
    });
  }

  function handleCopyAllEnv() {
    if (filteredCreds.length === 0) return;
    navigator.clipboard.writeText(toEnvBlock(filteredCreds)).then(() => {
      setCopiedAllEnv(true);
      toast.success(`Copied ${filteredCreds.length} vars as .env`);
      setTimeout(() => setCopiedAllEnv(false), 1500);
    });
  }

  function handleDownloadEnv() {
    if (filteredCreds.length === 0) return;
    downloadTextFile(".env", toEnvBlock(filteredCreds));
  }

  function maskValue(val: string) {
    if (val.length <= 8) return "•".repeat(val.length);
    return val.slice(0, 4) + "•".repeat(Math.min(val.length - 8, 24)) + val.slice(-4);
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Scrum AI" }, { label: "Credentials" }]}
        status={{ label: `${visibleCreds.length} stored`, tone: "info" }}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={openImportModal}
              className="px-3 py-1.5 bg-surface-2 border border-border text-xs font-bold rounded hover:border-primary/40 flex items-center gap-1.5"
            >
              <Upload className="size-3.5" />
              Import .env
            </button>
            <button
              onClick={openModal}
              className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 flex items-center gap-1.5"
            >
              <Plus className="size-3.5" />
              Add Credential
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <Key className="size-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-muted-foreground">Loading credentials…</p>
          </div>
        ) : visibleCreds.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <Key className="size-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-muted-foreground">
              {pid ? "No credentials for this project" : "No credentials stored"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {pid
                ? "Add a project login or API key and it will show up here."
                : "Select a project or add a credential to get started."}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="size-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search credentials..."
                  className="w-48 pl-7 pr-3 py-1.5 rounded-md bg-surface-2 border border-border text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono uppercase text-muted-foreground px-2">
                  End User
                </span>
                <select
                  value={sortEndUser}
                  onChange={(e) => setSortEndUser(e.target.value)}
                  className="px-2 py-1.5 rounded-md bg-surface-2 border border-border text-xs focus:outline-none focus:border-primary"
                >
                  <option value="">All End Users</option>
                  {sortUserOptions.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={handleCopyAllEnv}
                  disabled={filteredCreds.length === 0}
                  title="Copy all shown credentials as a .env block"
                  className="px-2.5 py-1.5 rounded-md bg-surface-2 border border-border text-xs flex items-center gap-1.5 hover:border-primary/40 disabled:opacity-50"
                >
                  {copiedAllEnv ? (
                    <CheckCircle2 className="size-3 text-success" />
                  ) : (
                    <FileCode className="size-3" />
                  )}
                  Copy .env
                </button>
                <button
                  onClick={handleDownloadEnv}
                  disabled={filteredCreds.length === 0}
                  title="Download shown credentials as a .env file"
                  className="px-2.5 py-1.5 rounded-md bg-surface-2 border border-border text-xs flex items-center gap-1.5 hover:border-primary/40 disabled:opacity-50"
                >
                  <Download className="size-3" />
                  Download
                </button>
              </div>
            </div>

            {filteredCreds.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <Search className="size-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium text-muted-foreground">No credentials match</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-surface-2 border-b border-border">
                      {!pid && <Th>Project</Th>}
                      <Th>Type</Th>
                      <Th className="min-w-[160px]">Service</Th>
                      <Th>Key</Th>
                      <Th>End User</Th>
                      <Th className="min-w-[200px]">Value</Th>
                      <Th>URL</Th>
                      <Th>Created</Th>
                      <Th></Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCreds.map((c) => {
                      const isVisible = visible[c.id];
                      const TypeIcon = TYPE_META[c.type].icon;
                      const project = allProjects.find((p) => p.id === c.projectId);
                      const userOptions = project?.endUsers ?? [];
                      return (
                        <tr
                          key={c.id}
                          className="border-b border-border/50 hover:bg-surface-2/50 align-middle"
                        >
                          {!pid && (
                            <Td>
                              <span className="text-xs font-medium">{project?.name ?? "—"}</span>
                            </Td>
                          )}
                          <Td>
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase text-muted-foreground bg-surface-2 px-1.5 py-0.5 rounded">
                              <TypeIcon className="size-3 text-primary" />
                              {TYPE_META[c.type].label}
                            </span>
                          </Td>
                          <Td>
                            <div className="text-xs font-semibold">{c.service}</div>
                            {c.username && (
                              <div className="text-[10px] text-muted-foreground">{c.username}</div>
                            )}
                            {c.description && (
                              <div className="text-[10px] text-muted-foreground">
                                {c.description}
                              </div>
                            )}
                          </Td>
                          <Td>
                            <code className="text-[11px] font-mono text-muted-foreground">
                              {c.key}
                            </code>
                          </Td>
                          <Td>
                            {userOptions.length ? (
                              <select
                                value={c.endUser}
                                onChange={(e) => handleUpdateEndUser(c.id, e.target.value)}
                                className="w-full min-w-[110px] px-2 py-1 rounded-md bg-surface-2 border border-border text-xs focus:outline-none focus:border-primary"
                              >
                                <option value="">—</option>
                                {userOptions.map((u) => (
                                  <option key={u} value={u}>
                                    {u}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {c.endUser || "—"}
                              </span>
                            )}
                          </Td>
                          <Td>
                            <div className="flex items-center gap-1.5">
                              <code className="text-[11px] font-mono text-muted-foreground break-all">
                                {isVisible ? c.value : maskValue(c.value)}
                              </code>
                              <button
                                onClick={() => setVisible((p) => ({ ...p, [c.id]: !isVisible }))}
                                className="p-0.5 rounded hover:bg-surface-2 text-muted-foreground shrink-0"
                                title={isVisible ? "Hide" : "Show"}
                              >
                                {isVisible ? (
                                  <EyeOff className="size-3" />
                                ) : (
                                  <Eye className="size-3" />
                                )}
                              </button>
                              <button
                                onClick={() => handleCopy(c.value, c.id)}
                                className="p-0.5 rounded hover:bg-surface-2 text-muted-foreground shrink-0"
                                title="Copy value"
                              >
                                {copiedId === c.id ? (
                                  <CheckCircle2 className="size-3 text-success" />
                                ) : (
                                  <Copy className="size-3" />
                                )}
                              </button>
                              <button
                                onClick={() => handleCopyEnvLine(c)}
                                className="p-0.5 rounded hover:bg-surface-2 text-muted-foreground shrink-0"
                                title={`Copy as ${c.key}=...`}
                              >
                                {envCopiedId === c.id ? (
                                  <CheckCircle2 className="size-3 text-success" />
                                ) : (
                                  <FileCode className="size-3" />
                                )}
                              </button>
                            </div>
                          </Td>
                          <Td>
                            {c.url ? (
                              <a
                                href={c.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-primary hover:underline whitespace-nowrap"
                              >
                                {c.url}
                              </a>
                            ) : (
                              <span className="text-[10px] text-muted-foreground">—</span>
                            )}
                          </Td>
                          <Td>
                            <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                              {c.createdAt}
                            </span>
                          </Td>
                          <Td>
                            <button
                              onClick={() => handleRemove(c.id)}
                              className="p-1 rounded hover:bg-surface-2 text-muted-foreground hover:text-destructive"
                              title="Remove"
                            >
                              <X className="size-3" />
                            </button>
                          </Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-lg bg-card border border-border rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-sm font-semibold flex items-center gap-2">
                <Icon className="size-4 text-primary" /> Add Credential
              </span>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded hover:bg-surface-2 text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {!pid && (
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">
                    Project *
                  </label>
                  <select
                    value={form.projectId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, projectId: e.target.value, endUser: "" }))
                    }
                    className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="">Select project…</option>
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">
                  Type
                </label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {(["api", "login", "database", "other"] as const).map((t) => {
                    const m = TYPE_META[t];
                    const active = form.type === t;
                    return (
                      <button
                        key={t}
                        onClick={() => setForm((p) => ({ ...p, type: t }))}
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
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">
                    Service *
                  </label>
                  <input
                    value={form.service}
                    onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))}
                    placeholder="e.g. Gmail, OpenAI, AWS"
                    className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">
                    Key Name *
                  </label>
                  <input
                    value={form.key}
                    onChange={(e) => setForm((p) => ({ ...p, key: e.target.value }))}
                    placeholder={
                      form.type === "login"
                        ? "SMTP_PASSWORD"
                        : form.type === "database"
                          ? "DB_URL"
                          : "API_KEY"
                    }
                    className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              {form.type === "login" && (
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">
                    Username / Email
                  </label>
                  <input
                    value={form.username}
                    onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                    placeholder="user@example.com"
                    className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              )}
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">
                  End User
                </label>
                <select
                  value={form.endUser}
                  onChange={(e) => setForm((p) => ({ ...p, endUser: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">—</option>
                  {endUserOptions.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">
                  Secret Value *
                </label>
                <textarea
                  value={form.value}
                  onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
                  placeholder={
                    form.type === "login"
                      ? "Enter password here"
                      : form.type === "database"
                        ? "postgresql://user:pass@host:5432/db"
                        : "Paste the token or key here"
                  }
                  className="w-full mt-1 h-20 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary resize-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">
                  Service URL
                </label>
                <input
                  value={form.url}
                  onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">
                  Description
                </label>
                <input
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="What is this credential used for?"
                  className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-medium rounded border border-border hover:bg-surface-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={
                  !form.projectId || !form.service.trim() || !form.key.trim() || !form.value.trim()
                }
                className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 disabled:opacity-50"
              >
                Save Credential
              </button>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40"
          onClick={() => setShowImportModal(false)}
        >
          <div
            className="w-full max-w-xl bg-card border border-border rounded-lg shadow-xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <span className="text-sm font-semibold flex items-center gap-2">
                <Upload className="size-4 text-primary" /> Import .env File
              </span>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded hover:bg-surface-2 text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept=".env,.env.*,text/plain"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleEnvFile(file);
                  e.target.value = "";
                }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleEnvFile(file);
                }}
                className="border border-dashed border-border rounded-md px-4 py-6 text-center cursor-pointer hover:border-primary/40 bg-surface-2/50"
              >
                <Upload className="size-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  {importFileName || "Click to select or drag & drop a .env file"}
                </p>
              </div>

              {importVars.length > 0 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {!pid && (
                      <div>
                        <label className="text-[10px] font-mono uppercase text-muted-foreground">
                          Project *
                        </label>
                        <select
                          value={importForm.projectId}
                          onChange={(e) =>
                            setImportForm((p) => ({
                              ...p,
                              projectId: e.target.value,
                              endUser: "",
                            }))
                          }
                          className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                        >
                          <option value="">Select project…</option>
                          {projects.map((proj) => (
                            <option key={proj.id} value={proj.id}>
                              {proj.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="text-[10px] font-mono uppercase text-muted-foreground">
                        Service
                      </label>
                      <input
                        value={importForm.service}
                        onChange={(e) =>
                          setImportForm((p) => ({ ...p, service: e.target.value }))
                        }
                        placeholder={importFileName.replace(/\.env.*$/i, "") || "e.g. Production"}
                        className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-muted-foreground">
                        End User
                      </label>
                      <select
                        value={importForm.endUser}
                        onChange={(e) =>
                          setImportForm((p) => ({ ...p, endUser: e.target.value }))
                        }
                        className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="">—</option>
                        {(allProjects.find((p) => p.id === importForm.projectId)?.endUsers ?? []).map(
                          (u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono uppercase text-muted-foreground">
                        Parsed Variables ({importVars.filter((v) => v.include).length}/
                        {importVars.length})
                      </label>
                      <button
                        onClick={() =>
                          setImportVars((prev) =>
                            prev.map((v) => ({
                              ...v,
                              include: !prev.every((x) => x.include),
                            })),
                          )
                        }
                        className="text-[10px] text-primary hover:underline"
                      >
                        Toggle all
                      </button>
                    </div>
                    <div className="border border-border rounded-md divide-y divide-border/60 max-h-56 overflow-y-auto">
                      {importVars.map((v) => (
                        <label
                          key={v.key}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-surface-2/50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={v.include}
                            onChange={() => toggleImportVar(v.key)}
                            className="shrink-0"
                          />
                          <code className="font-mono font-semibold shrink-0">{v.key}</code>
                          <code className="font-mono text-muted-foreground truncate">
                            {v.value ? maskValue(v.value) : "(empty)"}
                          </code>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-border shrink-0">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-medium rounded border border-border hover:bg-surface-2"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSave}
                disabled={
                  importing ||
                  !importForm.projectId ||
                  importVars.filter((v) => v.include && v.value).length === 0
                }
                className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 disabled:opacity-50"
              >
                Import {importVars.filter((v) => v.include && v.value).length || ""} Credential
                {importVars.filter((v) => v.include && v.value).length === 1 ? "" : "s"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
