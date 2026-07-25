import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/console";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import {
  Calendar,
  Plus,
  MapPin,
  Loader2,
  Save,
  X,
  Trophy,
  ExternalLink,
  Github,
  Palette,
  Smartphone,
  FileText,
  Globe,
  LinkIcon,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Users,
  ClipboardList,
} from "lucide-react";

export const Route = createFileRoute("/hackathons")({
  head: () => ({
    meta: [
      { title: "Hackathons · Task Tracker" },
      { name: "description", content: "Track hackathons and submissions." },
    ],
  }),
  component: HackathonsPage,
});

type LinkType = "live_demo" | "github" | "figma" | "play_store" | "case_study" | "website";

const LINK_CONFIG: Record<LinkType, { icon: typeof ExternalLink; label: string }> = {
  live_demo: { icon: ExternalLink, label: "Live Demo" },
  github: { icon: Github, label: "GitHub" },
  figma: { icon: Palette, label: "Figma" },
  play_store: { icon: Smartphone, label: "Play Store" },
  case_study: { icon: FileText, label: "Case Study" },
  website: { icon: Globe, label: "Website" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Calendar }> = {
  upcoming: { label: "Upcoming", color: "text-info", bg: "bg-info/10 border-info/20", icon: Clock },
  active: { label: "Active", color: "text-success", bg: "bg-success/10 border-success/20", icon: Trophy },
  completed: { label: "Completed", color: "text-muted-foreground", bg: "bg-surface-2 border-border", icon: CheckCircle2 },
};

function db() {
  return supabase as any;
}

const hackathonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  theme: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  location: z.string().optional(),
  registration_url: z.string().optional(),
});

type HackathonForm = z.infer<typeof hackathonSchema>;

type HackathonData = {
  id: string;
  name: string;
  description: string | null;
  theme: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  registration_url: string | null;
  status: string | null;
  created_by: string;
  created_at: string;
  projects: {
    id: string;
    name: string;
    short_description: string | null;
    technologies: string[] | null;
    image_url: string | null;
    owner_name: string;
    links: { link_type: LinkType; url: string }[];
  }[];
};

const EMPTY_FORM: HackathonForm = {
  name: "",
  description: "",
  theme: "",
  start_date: "",
  end_date: "",
  location: "",
  registration_url: "",
};

function HackathonsPage() {
  const { user, isSuperAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "upcoming" | "active" | "completed">("all");
  const [showNew, setShowNew] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [linkProjectModal, setLinkProjectModal] = useState<string | null>(null);

  const form = useForm<HackathonForm>({
    resolver: zodResolver(hackathonSchema),
    defaultValues: EMPTY_FORM,
  });

  const { data: hackathons, isLoading } = useQuery({
    queryKey: ["hackathons"],
    queryFn: async (): Promise<HackathonData[]> => {
      const { data: hacks } = await db()
        .from("hackathons")
        .select("*")
        .order("start_date", { ascending: false });

      if (!hacks?.length) return [];

      const hackIds = hacks.map((h: any) => h.id);

      const { data: hackProjects } = await db()
        .from("hackathon_projects")
        .select("hackathon_id, project_id")
        .in("hackathon_id", hackIds);

      const projectIds = [...new Set((hackProjects ?? []).map((hp: any) => hp.project_id))];

      let projectsData: any[] = [];
      let linksData: any[] = [];
      let profilesData: any[] = [];

      if (projectIds.length > 0) {
        const [projRes, linkRes, projMembers] = await Promise.all([
          db().from("member_projects").select("*").in("id", projectIds),
          db().from("project_links").select("*").in("project_id", projectIds),
          db().from("project_members").select("project_id, member_id").in("project_id", projectIds),
        ]);
        projectsData = projRes.data ?? [];
        linksData = linkRes.data ?? [];

        const memberIds = [...new Set((projMembers.data ?? []).map((pm: any) => pm.member_id))];
        if (memberIds.length > 0) {
          const { data: profiles } = await db()
            .from("profiles")
            .select("id, display_name")
            .in("id", memberIds);
          profilesData = profiles ?? [];
        }
      }

      const linksByProject = new Map<string, any[]>();
      for (const link of linksData) {
        const list = linksByProject.get(link.project_id) ?? [];
        list.push(link);
        linksByProject.set(link.project_id, list);
      }

      const profileMap = new Map(profilesData.map((p: any) => [p.id, p.display_name]));

      const projectsByHack = new Map<string, any[]>();
      for (const hp of hackProjects ?? []) {
        const list = projectsByHack.get(hp.hackathon_id) ?? [];
        const proj = projectsData.find((p) => p.id === hp.project_id);
        if (proj) {
          list.push({
            ...proj,
            owner_name: profileMap.get(proj.owner_id) ?? "Unknown",
            links: linksByProject.get(proj.id) ?? [],
          });
        }
        projectsByHack.set(hp.hackathon_id, list);
      }

      return hacks.map((h: any) => ({
        ...h,
        projects: projectsByHack.get(h.id) ?? [],
      }));
    },
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: HackathonForm) => {
      const { error } = await db().from("hackathons").insert({
        name: data.name,
        description: data.description ?? "",
        theme: data.theme ?? "",
        start_date: data.start_date,
        end_date: data.end_date,
        location: data.location ?? "",
        registration_url: data.registration_url ?? "",
        status: new Date(data.start_date) > new Date() ? "upcoming" : "active",
        created_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Hackathon created");
      setShowNew(false);
      form.reset(EMPTY_FORM);
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
    },
    onError: () => toast.error("Failed to create hackathon"),
  });

  const linkProjectMutation = useMutation({
    mutationFn: async ({ hackathonId, projectId }: { hackathonId: string; projectId: string }) => {
      const { error } = await db()
        .from("hackathon_projects")
        .insert({ hackathon_id: hackathonId, project_id: projectId });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Project linked to hackathon");
      setLinkProjectModal(null);
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
    },
    onError: () => toast.error("Failed to link project"),
  });

  const filtered = (hackathons ?? []).filter((h) => {
    if (filter === "all") return true;
    return h.status === filter;
  });

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Task Tracker" }, { label: "Hackathons" }]}
        status={{ label: `${hackathons?.length ?? 0} hackathons`, tone: "info" }}
        actions={
          isSuperAdmin && !showNew ? (
            <button
              onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-border hover:bg-surface-2 transition-colors"
            >
              <Plus className="size-3" />
              New Hackathon
            </button>
          ) : undefined
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 border border-border rounded-lg p-1 w-fit">
          {(["all", "upcoming", "active", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                "px-3 py-1.5 text-xs font-medium rounded transition-colors capitalize",
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {f}
            </button>
          ))}
        </div>

        {/* New hackathon form */}
        {showNew && (
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold mb-4">New Hackathon</h3>
            <form
              onSubmit={form.handleSubmit((data) => createMutation.mutate(data))}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">
                    Name *
                  </label>
                  <input
                    {...form.register("name")}
                    placeholder="e.g. HackFest 2026"
                    className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                  />
                  {form.formState.errors.name && (
                    <p className="text-[10px] text-destructive mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">
                    Theme
                  </label>
                  <input
                    {...form.register("theme")}
                    placeholder="e.g. AI for Good"
                    className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">
                  Description
                </label>
                <textarea
                  {...form.register("description")}
                  rows={2}
                  placeholder="What's this hackathon about?"
                  className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("start_date")}
                    className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    {...form.register("end_date")}
                    className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">
                    Location
                  </label>
                  <input
                    {...form.register("location")}
                    placeholder="e.g. Online"
                    className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground">
                  Registration Form URL
                </label>
                <input
                  {...form.register("registration_url")}
                  placeholder="https://..."
                  className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowNew(false);
                    form.reset(EMPTY_FORM);
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded border border-border hover:bg-surface-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 disabled:opacity-50"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Save className="size-3" />
                  )}
                  Create
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Hackathon list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 text-muted-foreground animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="size-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {filter === "all"
                ? "No hackathons yet. Create one to get started."
                : `No ${filter} hackathons.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((hack) => {
              const st = STATUS_CONFIG[hack.status ?? "upcoming"] ?? STATUS_CONFIG.upcoming;
              const StIcon = st.icon;
              const expanded = expandedId === hack.id;
              const startDate = new Date(hack.start_date);
              const endDate = new Date(hack.end_date);

              return (
                <div key={hack.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  <div
                    className="p-5 cursor-pointer hover:bg-surface-2/50 transition-colors"
                    onClick={() => setExpandedId(expanded ? null : hack.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold">{hack.name}</h3>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono uppercase border rounded ${st.color} ${st.bg}`}
                          >
                            {st.label}
                          </span>
                        </div>

                        {hack.theme && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Theme: {hack.theme}
                          </p>
                        )}

                        {hack.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {hack.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="size-3" />
                            {startDate.toLocaleDateString()} — {endDate.toLocaleDateString()}
                          </span>
                          {hack.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="size-3" />
                              {hack.location}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Briefcase className="size-3" />
                            {hack.projects.length} project{hack.projects.length !== 1 ? "s" : ""}
                          </span>
                          {hack.registration_url && (
                            <a
                              href={hack.registration_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <ClipboardList className="size-3" />
                              Registration Form
                            </a>
                          )}
                        </div>
                      </div>

                      {expanded ? (
                        <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                      )}
                    </div>
                  </div>

                  {expanded && (
                    <div className="border-t border-border px-5 py-4">
                      {hack.projects.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {hack.projects.map((proj) => (
                            <div
                              key={proj.id}
                              className="bg-surface-2 border border-border rounded-lg overflow-hidden"
                            >
                              {proj.image_url ? (
                                <div className="h-20 overflow-hidden">
                                  <img
                                    src={proj.image_url}
                                    alt={proj.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-20 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                  <span className="text-xl font-bold text-primary/30">
                                    {proj.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                              <div className="p-3 space-y-1.5">
                                <div>
                                  <h4 className="text-sm font-medium truncate">{proj.name}</h4>
                                  <p className="text-[10px] text-muted-foreground">
                                    by {proj.owner_name}
                                  </p>
                                </div>
                                {proj.short_description && (
                                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                                    {proj.short_description}
                                  </p>
                                )}
                                {proj.technologies && proj.technologies.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {proj.technologies.map((tech) => (
                                      <span
                                        key={tech}
                                        className="px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground bg-background border border-border rounded"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {proj.links.length > 0 && (
                                  <div className="flex items-center gap-1 pt-1">
                                    {proj.links.map((link) => {
                                      const cfg = LINK_CONFIG[link.link_type];
                                      if (!cfg) return null;
                                      const Icon = cfg.icon;
                                      return (
                                        <a
                                          key={link.link_type}
                                          href={link.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                          <Icon className="size-3" />
                                          {cfg.label}
                                        </a>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No projects linked yet.
                        </p>
                      )}

                      {isSuperAdmin && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <button
                            onClick={() => setLinkProjectModal(hack.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase text-primary border border-primary/30 hover:bg-primary/5 transition-colors rounded"
                          >
                            <Plus className="size-3" />
                            Link Project
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Link project modal */}
        {linkProjectModal && (
          <LinkProjectModal
            hackathonId={linkProjectModal}
            onClose={() => setLinkProjectModal(null)}
            onLink={(projectId) =>
              linkProjectMutation.mutate({ hackathonId: linkProjectModal, projectId })
            }
            isPending={linkProjectMutation.isPending}
          />
        )}
      </div>
    </>
  );
}

function LinkProjectModal({
  hackathonId,
  onClose,
  onLink,
  isPending,
}: {
  hackathonId: string;
  onClose: () => void;
  onLink: (projectId: string) => void;
  isPending: boolean;
}) {
  const [search, setSearch] = useState("");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["all-member-projects"],
    queryFn: async (): Promise<{ id: string; name: string; short_description: string | null; owner_name: string }[]> => {
      const { data: memberProjects } = await db()
        .from("member_projects")
        .select("id, name, short_description, owner_id");

      if (!memberProjects?.length) return [];

      const ownerIds = [...new Set(memberProjects.map((p: any) => p.owner_id))];
      const { data: profiles } = await db()
        .from("profiles")
        .select("id, display_name")
        .in("id", ownerIds);

      const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p.display_name]));

      return memberProjects.map((p: any) => ({
        id: p.id,
        name: p.name,
        short_description: p.short_description,
        owner_name: profileMap.get(p.owner_id) ?? "Unknown",
      }));
    },
  });

  const { data: linkedIds } = useQuery({
    queryKey: ["hackathon-links", hackathonId],
    queryFn: async () => {
      const { data } = await db()
        .from("hackathon_projects")
        .select("project_id")
        .eq("hackathon_id", hackathonId);
      return new Set((data ?? []).map((r: any) => r.project_id));
    },
  });

  const filtered = (projects ?? []).filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.owner_name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-md bg-card border border-border rounded-lg shadow-xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold">Link Project to Hackathon</span>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface-2 text-muted-foreground">
            <X className="size-4" />
          </button>
        </div>

        <div className="px-4 pt-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-5 text-muted-foreground animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              No projects found.
            </p>
          ) : (
            filtered.map((proj) => {
              const alreadyLinked = linkedIds?.has(proj.id);
              return (
                <div
                  key={proj.id}
                  className="flex items-center justify-between p-3 bg-surface-2 border border-border rounded-lg"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{proj.name}</div>
                    <div className="text-[10px] text-muted-foreground">by {proj.owner_name}</div>
                  </div>
                  <button
                    onClick={() => onLink(proj.id)}
                    disabled={alreadyLinked || isPending}
                    className="px-2 py-1 text-[10px] font-mono uppercase rounded border border-primary/30 text-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ml-2"
                  >
                    {alreadyLinked ? "Linked" : "Link"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
