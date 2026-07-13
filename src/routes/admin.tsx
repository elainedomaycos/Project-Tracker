import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/console";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Send, UserPlus } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Task Tracker" },
      { name: "description", content: "User management and invitations." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { profile, isSuperAdmin } = useAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"developer" | "qa">("developer");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [invitations, setInvitations] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<string[]>([]);
  const [qaUsers, setQaUsers] = useState<string[]>([]);
  const [newDev, setNewDev] = useState("");
  const [newQa, setNewQa] = useState("");

  useEffect(() => {
    loadInvitations();
    loadSettings();
  }, []);

  async function loadInvitations() {
    try {
      const { data } = await supabase.from("invitations").select("*").order("created_at", { ascending: false });
      if (data) setInvitations(data);
    } catch { /* table may not exist yet */ }
  }

  async function loadSettings() {
    try {
      const { data } = await supabase.from("settings").select("*");
      if (!data) return;
      const devs = data.find((s) => s.key === "developers")?.value ?? [];
      const qas = data.find((s) => s.key === "qa_users")?.value ?? [];
      setDevelopers(devs);
      setQaUsers(qas);
    } catch { /* ignore */ }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    setSending(true);
    setMessage(null);

    const { error } = await supabase.from("invitations").insert({
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role,
      invited_by: profile?.id,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Invitation sent!");
      setEmail("");
      setName("");
      setRole("developer");
      loadInvitations();
    }
    setSending(false);
  }

  async function removeInvitation(id: string) {
    await supabase.from("invitations").delete().eq("id", id);
    loadInvitations();
  }

  async function updateSettings(key: string, value: string[]) {
    await supabase.from("settings").upsert({ key, value });
  }

  function addDeveloper() {
    if (!newDev.trim()) return;
    const updated = [...developers, newDev.trim()];
    setDevelopers(updated);
    updateSettings("developers", updated);
    setNewDev("");
  }

  function removeDeveloper(name: string) {
    const updated = developers.filter((d) => d !== name);
    setDevelopers(updated);
    updateSettings("developers", updated);
  }

  function addQaUser() {
    if (!newQa.trim()) return;
    const updated = [...qaUsers, newQa.trim()];
    setQaUsers(updated);
    updateSettings("qa_users", updated);
    setNewQa("");
  }

  function removeQaUser(name: string) {
    const updated = qaUsers.filter((d) => d !== name);
    setQaUsers(updated);
    updateSettings("qa_users", updated);
  }

  if (!isSuperAdmin) {
    return (
      <>
        <PageHeader
          crumbs={[{ label: "Admin" }]}
        />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">You don't have permission to manage users.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin" }]}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Invite User */}
          <section>
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Send className="size-4" />
              Invite User
            </h2>
            <form onSubmit={handleInvite} className="space-y-3 bg-surface-2 border border-border rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full mt-1 px-3 py-2 rounded-md bg-background border border-border text-sm focus:outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" className="w-full mt-1 px-3 py-2 rounded-md bg-background border border-border text-sm focus:outline-none focus:border-primary" required />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value as "developer" | "qa")} className="w-full mt-1 px-3 py-2 rounded-md bg-background border border-border text-sm focus:outline-none focus:border-primary">
                  <option value="developer">Developer</option>
                  <option value="qa">QA</option>
                </select>
              </div>
              <button type="submit" disabled={sending} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 disabled:opacity-50 flex items-center gap-2">
                <UserPlus className="size-3.5" />
                {sending ? "Sending..." : "Send Invitation"}
              </button>
              {message && <p className="text-xs text-muted-foreground">{message}</p>}
            </form>
          </section>

          {/* Pending Invitations */}
          <section>
            <h2 className="text-base font-semibold mb-3">Pending Invitations</h2>
            {invitations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending invitations.</p>
            ) : (
              <div className="bg-surface-2 border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-[10px] font-mono uppercase text-muted-foreground">
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Role</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map((inv) => (
                      <tr key={inv.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-2 font-medium">{inv.name}</td>
                        <td className="px-4 py-2 text-muted-foreground">{inv.email}</td>
                        <td className="px-4 py-2 capitalize">{inv.role}</td>
                        <td className="px-4 py-2 text-right">
                          <button onClick={() => removeInvitation(inv.id)} className="p-1 rounded text-destructive hover:bg-destructive/10">
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Developers List */}
          <section>
            <h2 className="text-base font-semibold mb-3">Developers</h2>
            <div className="bg-surface-2 border border-border rounded-lg p-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {developers.map((dev) => (
                  <span key={dev} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-border text-xs font-medium">
                    {dev}
                    <button onClick={() => removeDeveloper(dev)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newDev} onChange={(e) => setNewDev(e.target.value)} placeholder="Add developer name" className="flex-1 px-3 py-1.5 rounded-md bg-background border border-border text-sm focus:outline-none focus:border-primary" />
                <button onClick={addDeveloper} disabled={!newDev.trim()} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 disabled:opacity-50 flex items-center gap-1">
                  <Plus className="size-3.5" />
                  Add
                </button>
              </div>
            </div>
          </section>

          {/* QA Users List */}
          <section>
            <h2 className="text-base font-semibold mb-3">QA Users</h2>
            <div className="bg-surface-2 border border-border rounded-lg p-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {qaUsers.map((user) => (
                  <span key={user} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-border text-xs font-medium">
                    {user}
                    <button onClick={() => removeQaUser(user)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newQa} onChange={(e) => setNewQa(e.target.value)} placeholder="Add QA name" className="flex-1 px-3 py-1.5 rounded-md bg-background border border-border text-sm focus:outline-none focus:border-primary" />
                <button onClick={addQaUser} disabled={!newQa.trim()} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 disabled:opacity-50 flex items-center gap-1">
                  <Plus className="size-3.5" />
                  Add
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
