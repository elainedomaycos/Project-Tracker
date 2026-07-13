import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/console";
import { useAuth } from "@/lib/auth-context";
import { useProject } from "@/lib/project-context";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Shield, Users, Code2, FlaskConical } from "lucide-react";
import type { UserRole } from "@/lib/auth-context";

type ManagedUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Task Tracker" },
      { name: "description", content: "User management." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { profile, isSuperAdmin } = useAuth();
  const { developers, qaUsers, addDeveloper, removeDeveloper, addQaUser, removeQaUser } = useProject();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDev, setNewDev] = useState("");
  const [newQa, setNewQa] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setUsers(data as ManagedUser[]);
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function updateRole(userId: string, newRole: UserRole) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (!error) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      if (newRole === "developer" && user.name) addDeveloper(user.name);
      if (newRole === "qa" && user.name) addQaUser(user.name);
    }
  }

  if (!isSuperAdmin) {
    return (
      <>
        <PageHeader crumbs={[{ label: "Admin" }]} />
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

  const roleIcon = (r: string) => {
    switch (r) {
      case "super_admin": return <Shield className="size-3.5" />;
      case "developer": return <Code2 className="size-3.5" />;
      case "qa": return <FlaskConical className="size-3.5" />;
      default: return null;
    }
  };

  return (
    <>
      <PageHeader crumbs={[{ label: "Admin" }]} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Users */}
          <section>
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Users className="size-4" />
              Registered Users
            </h2>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : users.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users found.</p>
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
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-2 font-medium">{u.name || "—"}</td>
                        <td className="px-4 py-2 text-muted-foreground">{u.email}</td>
                        <td className="px-4 py-2">
                          <select
                            value={u.role}
                            onChange={(e) => updateRole(u.id, e.target.value as UserRole)}
                            className="px-2 py-1 rounded bg-background border border-border text-xs font-medium focus:outline-none focus:border-primary"
                          >
                            <option value="super_admin">Super Admin</option>
                            <option value="developer">Developer</option>
                            <option value="qa">QA</option>
                          </select>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                            {roleIcon(u.role)}
                            {u.role.replace("_", " ")}
                          </span>
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
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Code2 className="size-4" />
              Developer Names
            </h2>
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
                <button onClick={() => { addDeveloper(newDev); setNewDev(""); }} disabled={!newDev.trim()} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 disabled:opacity-50 flex items-center gap-1">
                  <Plus className="size-3.5" />
                  Add
                </button>
              </div>
            </div>
          </section>

          {/* QA Users List */}
          <section>
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <FlaskConical className="size-4" />
              QA Names
            </h2>
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
                <button onClick={() => { addQaUser(newQa); setNewQa(""); }} disabled={!newQa.trim()} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 disabled:opacity-50 flex items-center gap-1">
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
