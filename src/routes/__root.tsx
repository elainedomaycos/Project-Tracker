import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  ListChecks,
  Code2,
  FlaskConical,
  ExternalLink,
  Sparkles,
  Key,
  BarChart3,
  ChevronDown,
  X,
  Shield,
  LogOut,
  User as UserIcon,
} from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ProjectProvider, useProject, type AppView } from "@/lib/project-context";
import { AuthProvider, useAuth } from "@/lib/auth-context";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Task Tracker — Simple Project & Task Management" },
      { name: "description", content: "Lightweight task tracking for small teams. No Scrum jargon, just get work done." },
      { property: "og:title", content: "Task Tracker" },
      { property: "og:description", content: "Simple project and task management for small teams." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/logo.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: string[];
};

const NAV_ITEMS: readonly NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["super_admin", "developer", "qa"] },
  { to: "/tasks", label: "Tasks", icon: ListChecks, roles: ["super_admin", "developer", "qa"] },
  { to: "/developer", label: "Developer", icon: Code2, roles: ["super_admin", "developer"] },
  { to: "/qa", label: "QA Review", icon: FlaskConical, roles: ["super_admin", "qa"] },
  { to: "/client", label: "Client Portal", icon: ExternalLink, roles: ["super_admin"] },
];

const EXTRA_NAV: readonly NavItem[] = [
  { to: "/reports", label: "Reports", icon: BarChart3, roles: ["super_admin"] },
  { to: "/ai", label: "AI Tools", icon: Sparkles, roles: ["super_admin", "developer", "qa"] },
  { to: "/credentials", label: "Credentials", icon: Key, roles: ["super_admin", "developer", "qa"] },
  { to: "/admin", label: "Admin", icon: Shield, roles: ["super_admin"] },
];

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthPage = pathname === "/auth";

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProjectProvider>
          <AuthGate>
            {isAuthPage ? <Outlet /> : <AppShell pathname={pathname} queryClient={queryClient} />}
          </AuthGate>
        </ProjectProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthPage = pathname === "/auth";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user && !isAuthPage) {
    router.navigate({ to: "/auth" });
    return null;
  }

  if (user && isAuthPage) {
    router.navigate({ to: "/" });
    return null;
  }

  return <>{children}</>;
}

function AppShell({ pathname, queryClient }: { pathname: string; queryClient: QueryClient }) {
  const { profile, signOut, isSuperAdmin } = useAuth();
  const role = profile?.role ?? "developer";

  function canSee(item: NavItem) {
    return item.roles.includes(role);
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <nav className="w-56 shrink-0 flex flex-col border-r border-border bg-sidebar">
        <div className="h-14 flex items-center gap-3 px-5 border-b border-border">
          <div className="size-7 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold italic text-sm">
            TT
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight">Task Tracker</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase">
              v0.2 · console
            </div>
          </div>
        </div>

        {isSuperAdmin && (
          <div className="px-3 pt-3 pb-1">
            <ProjectSelector />
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1 no-scrollbar">
          {NAV_ITEMS.filter(canSee).map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={[
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
                ].join(" ")}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}

          {EXTRA_NAV.filter(canSee).length > 0 && (
            <div className="pt-4 mt-4 border-t border-border">
              <div className="px-3 pb-2 text-[9px] font-mono uppercase text-muted-foreground tracking-wider">
                Advanced
              </div>
              {EXTRA_NAV.filter(canSee).map((item) => {
                const active = pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={[
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      active
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
                    ].join(" ")}
                  >
                    <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-border space-y-2">
          {profile && (
            <div className="flex items-center gap-2 px-2">
              <div className="size-7 rounded-full bg-surface-2 border border-border grid place-items-center text-[9px] font-bold shrink-0">
                {profile.name?.slice(0, 2).toUpperCase() || profile.email?.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium truncate">{profile.name || "User"}</div>
                <div className="text-[9px] font-mono text-muted-foreground capitalize truncate">{profile.role.replace("_", " ")}</div>
              </div>
            </div>
          )}
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="size-3.5" />
            Sign Out
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

function ProjectSelector() {
  const { projects, currentProject, setCurrentProject, addProject, removeProject } = useProject();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", clientName: "", endUsers: "", modules: "" });

  function handleCreate() {
    if (!form.name.trim()) return;
    addProject({
      name: form.name.trim(),
      clientName: form.clientName.trim(),
      endUsers: form.endUsers.split(",").map((s) => s.trim()).filter(Boolean),
      modules: form.modules.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setForm({ name: "", clientName: "", endUsers: "", modules: "" });
    setShowModal(false);
  }

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <select
          value={currentProject?.id ?? ""}
          onChange={(e) => setCurrentProject(e.target.value)}
          className="w-full appearance-none px-3 py-1.5 rounded-md bg-surface-2 border border-border text-xs font-medium focus:outline-none focus:border-primary cursor-pointer"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => setShowModal(true)}
          className="flex-1 px-2 py-1 rounded text-[10px] font-mono uppercase text-primary border border-primary/30 hover:bg-primary/5 transition-colors"
        >
          + New Project
        </button>
        {projects.length > 1 && currentProject && (
          <button
            onClick={() => removeProject(currentProject.id)}
            className="px-2 py-1 rounded text-[10px] font-mono uppercase text-destructive border border-destructive/30 hover:bg-destructive/5 transition-colors"
          >
            Delete
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-sm bg-card border border-border rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-semibold">New Project</span>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-surface-2 text-muted-foreground">
                <X className="size-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Project Name *</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Tourism Website" className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary" autoFocus />
                <p className="text-[10px] text-muted-foreground mt-1">Task IDs will be auto-generated from the project name (e.g. TS-001)</p>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Client Name</label>
                <input value={form.clientName} onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))} placeholder="e.g. Acme Corp" className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">End Users</label>
                <input value={form.endUsers} onChange={(e) => setForm((p) => ({ ...p, endUsers: e.target.value }))} placeholder="Comma-separated (e.g. Admin, Manager, Staff)" className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Modules</label>
                <input value={form.modules} onChange={(e) => setForm((p) => ({ ...p, modules: e.target.value }))} placeholder="Comma-separated (e.g. Dashboard, Reports, Auth)" className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-border">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 text-xs font-medium rounded border border-border hover:bg-surface-2">Cancel</button>
              <button onClick={handleCreate} disabled={!form.name.trim()} className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 disabled:opacity-50">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
