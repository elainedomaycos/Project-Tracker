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
import { parseEventFromText, type ParsedEvent } from "@/lib/groq";
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
  Briefcase,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Users,
  ClipboardList,
  Sparkles,
  PenLine,
  Tag,
  Pencil,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/hackathons")({
  head: () => ({
    meta: [
      { title: "Tracker · Task Tracker" },
      { name: "description", content: "Track events, hackathons, and submissions." },
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

const CATEGORIES = [
  { value: "hackathon", label: "Hackathon", color: "text-success", bg: "bg-success/10 border-success/20" },
  { value: "convention", label: "Convention", color: "text-info", bg: "bg-info/10 border-info/20" },
  { value: "conference", label: "Conference", color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  { value: "meetup", label: "Meetup", color: "text-warning", bg: "bg-warning/10 border-warning/20" },
  { value: "workshop", label: "Workshop", color: "text-accent", bg: "bg-accent/10 border-accent/20" },
  { value: "other", label: "Other", color: "text-muted-foreground", bg: "bg-surface-2 border-border" },
];

const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

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
  category: z.string().optional(),
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
  category: string | null;
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
  category: "hackathon",
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
  const [formMode, setFormMode] = useState<"ai" | "manual">("ai");
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);

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

  const { data: myRegistrations } = useQuery({
    queryKey: ["event-registrations", user?.id],
    queryFn: async (): Promise<Set<string>> => {
      if (!user?.id) return new Set();
      try {
        const { data } = await db()
          .from("event_registrations")
          .select("event_id")
          .eq("user_id", user.id);
        return new Set((data ?? []).map((r: any) => r.event_id));
      } catch {
        return new Set();
      }
    },
    enabled: !!user?.id,
    staleTime: 30_000,
  });

  const toggleRegistration = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user?.id) return;
      const isRegistered = myRegistrations?.has(eventId);
      if (isRegistered) {
        await db().from("event_registrations").delete().eq("event_id", eventId).eq("user_id", user.id);
      } else {
        await db().from("event_registrations").insert({ event_id: eventId, user_id: user.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-registrations"] });
    },
    onError: () => toast.error("Could not update registration"),
  });

  const createMutation = useMutation({
    mutationFn: async (data: HackathonForm) => {
      const { error } = await db().from("hackathons").insert({
        name: data.name,
        description: data.description ?? "",
        theme: data.theme ?? "",
        category: data.category ?? "hackathon",
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
      toast.success("Event created");
      setShowNew(false);
      form.reset(EMPTY_FORM);
      setAiText("");
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
    },
    onError: () => toast.error("Failed to create event"),
  });

  const linkProjectMutation = useMutation({
    mutationFn: async ({ hackathonId, projectId }: { hackathonId: string; projectId: string }) => {
      const { error } = await db()
        .from("hackathon_projects")
        .insert({ hackathon_id: hackathonId, project_id: projectId });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Project linked to event");
      setLinkProjectModal(null);
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
    },
    onError: () => toast.error("Failed to link project"),
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: HackathonForm }) => {
      const { error } = await db().from("hackathons").update({
        name: data.name,
        description: data.description ?? "",
        theme: data.theme ?? "",
        category: data.category ?? "hackathon",
        start_date: data.start_date,
        end_date: data.end_date,
        location: data.location ?? "",
        registration_url: data.registration_url ?? "",
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Event updated");
      setEditingEvent(null);
      form.reset(EMPTY_FORM);
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
    },
    onError: () => toast.error("Failed to update event"),
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      await db().from("hackathon_projects").delete().eq("hackathon_id", id);
      const { error } = await db().from("hackathons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Event deleted");
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
    },
    onError: () => toast.error("Failed to delete event"),
  });

  function startEditEvent(hack: HackathonData) {
    setEditingEvent(hack.id);
    setShowNew(false);
    setFormMode("manual");
    form.reset({
      name: hack.name,
      description: hack.description ?? "",
      theme: hack.theme ?? "",
      category: hack.category ?? "hackathon",
      start_date: hack.start_date.slice(0, 16),
      end_date: hack.end_date.slice(0, 16),
      location: hack.location ?? "",
      registration_url: hack.registration_url ?? "",
    });
  }

  async function handleAiParse() {
    if (!aiText.trim()) return;
    setAiLoading(true);
    try {
      const parsed = await parseEventFromText(aiText);
      form.setValue("name", parsed.name);
      form.setValue("description", parsed.description);
      form.setValue("theme", parsed.theme);
      form.setValue("category", parsed.category);
      form.setValue("start_date", parsed.start_date);
      form.setValue("end_date", parsed.end_date);
      form.setValue("location", parsed.location);
      form.setValue("registration_url", parsed.registration_url);
      setFormMode("manual");
      toast.success("Event info parsed — review and save");
    } catch (err: any) {
      toast.error(err.message || "Failed to parse event info");
    } finally {
      setAiLoading(false);
    }
  }

  const filtered = (hackathons ?? []).filter((h) => {
    if (filter === "all") return true;
    return h.status === filter;
  });

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Task Tracker" }, { label: "Tracker" }]}
        status={{ label: `${hackathons?.length ?? 0} events`, tone: "info" }}
        actions={
          !showNew && !editingEvent ? (
            <button
              onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-border hover:bg-surface-2 transition-colors"
            >
              <Plus className="size-3" />
              New Event
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

        {/* New/edit event form */}
        {(showNew || editingEvent) && (
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">{editingEvent ? "Edit Event" : "New Event"}</h3>
              {!editingEvent && (
                <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
                <button
                  onClick={() => setFormMode("ai")}
                  className={[
                    "flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded transition-colors",
                    formMode === "ai" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  <Sparkles className="size-3" />
                  AI Fill
                </button>
                <button
                  onClick={() => setFormMode("manual")}
                  className={[
                    "flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded transition-colors",
                    formMode === "manual" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  <PenLine className="size-3" />
                  Manual
                </button>
              </div>
              )}
            </div>

            {(formMode === "ai" && !editingEvent) ? (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Paste any event info — poster text, email, announcement — and AI will extract the details.
                </p>
                <textarea
                  value={aiText}
                  onChange={(e) => setAiText(e.target.value)}
                  rows={6}
                  placeholder={"Paste event info here...\n\nExample:\nDevConnect 2026 - Annual developer conference happening March 15-17 at SMX Convention Center, Manila. Register at https://devconnect.ph"}
                  className="w-full px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary resize-none font-mono"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowNew(false); setAiText(""); }}
                    className="px-3 py-1.5 text-xs font-medium rounded border border-border hover:bg-surface-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAiParse}
                    disabled={!aiText.trim() || aiLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Sparkles className="size-3" />
                    )}
                    Parse with AI
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={form.handleSubmit((data) => {
                  if (editingEvent) {
                    updateEventMutation.mutate({ id: editingEvent, data });
                  } else {
                    createMutation.mutate(data);
                  }
                })}
                className="space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Name *</label>
                    <input
                      {...form.register("name")}
                      placeholder="e.g. HackFest 2026"
                      className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                    />
                    {form.formState.errors.name && (
                      <p className="text-[10px] text-destructive mt-1">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Category</label>
                    <select
                      {...form.register("category")}
                      className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Theme</label>
                    <input
                      {...form.register("theme")}
                      placeholder="e.g. AI for Good"
                      className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Registration Form URL</label>
                    <input
                      {...form.register("registration_url")}
                      placeholder="https://..."
                      className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">Description</label>
                  <textarea
                    {...form.register("description")}
                    rows={2}
                    placeholder="What's this event about?"
                    className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Start Date *</label>
                    <input
                      type="datetime-local"
                      {...form.register("start_date")}
                      className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">End Date *</label>
                    <input
                      type="datetime-local"
                      {...form.register("end_date")}
                      className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Location</label>
                    <input
                      {...form.register("location")}
                      placeholder="e.g. Online"
                      className="w-full mt-1 px-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowNew(false); setEditingEvent(null); form.reset(EMPTY_FORM); }}
                    className="px-3 py-1.5 text-xs font-medium rounded border border-border hover:bg-surface-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateEventMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded hover:brightness-110 disabled:opacity-50"
                  >
                    {(createMutation.isPending || updateEventMutation.isPending) ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
                    {editingEvent ? "Save Changes" : "Create"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Event list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 text-muted-foreground animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="size-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {filter === "all"
                ? "No events yet. Create one to get started."
                : `No ${filter} events.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((hack) => {
              const st = STATUS_CONFIG[hack.status ?? "upcoming"] ?? STATUS_CONFIG.upcoming;
              const cat = CATEGORY_MAP[hack.category ?? "hackathon"] ?? CATEGORY_MAP.other;
              const StIcon = st.icon;
              const expanded = expandedId === hack.id;
              const startDate = new Date(hack.start_date);
              const endDate = new Date(hack.end_date);

              return (
                <div key={hack.id} className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
                  <div
                    className="p-4 cursor-pointer hover:bg-surface-2/50 transition-colors flex-1 flex flex-col"
                    onClick={() => setExpandedId(expanded ? null : hack.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold truncate">{hack.name}</h3>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          className={`px-1.5 py-0.5 text-[9px] font-mono uppercase border rounded ${st.color} ${st.bg}`}
                        >
                          {st.label}
                        </span>
                        {expanded ? (
                          <ChevronUp className="size-3.5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="size-3.5 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 w-fit px-1.5 py-0.5 text-[9px] font-mono uppercase border rounded mt-1.5 ${cat.color} ${cat.bg}`}
                    >
                      <Tag className="size-2.5" />
                      {cat.label}
                    </span>

                    {hack.theme && (
                      <p className="text-[11px] text-muted-foreground mt-2 truncate">
                        {hack.theme}
                      </p>
                    )}

                    {hack.description && (
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                        {hack.description}
                      </p>
                    )}

                    <div className="mt-auto pt-3 space-y-1.5 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3 shrink-0" />
                        <span className="truncate">{startDate.toLocaleDateString()} — {endDate.toLocaleDateString()}</span>
                      </div>
                      {hack.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="size-3 shrink-0" />
                          <span className="truncate">{hack.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Briefcase className="size-3 shrink-0" />
                        <span>{hack.projects.length} project{hack.projects.length !== 1 ? "s" : ""}</span>
                      </div>
                      {hack.registration_url && (
                        <a
                          href={hack.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <ClipboardList className="size-3 shrink-0" />
                          Registration Form
                        </a>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRegistration.mutate(hack.id);
                      }}
                      className={[
                        "mt-2 w-full flex items-center justify-between px-2.5 py-1.5 text-[10px] font-mono uppercase border rounded transition-colors",
                        myRegistrations?.has(hack.id)
                          ? "bg-success/10 text-success border-success/30"
                          : "bg-surface-2 text-muted-foreground border-border",
                      ].join(" ")}
                    >
                      <span>{myRegistrations?.has(hack.id) ? "Registered" : "Not Registered"}</span>
                      <span
                        className={[
                          "relative inline-flex h-4 w-7 shrink-0 rounded-full border transition-colors",
                          myRegistrations?.has(hack.id)
                            ? "bg-success border-success"
                            : "bg-surface-2 border-border",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "pointer-events-none inline-block size-3 rounded-full bg-white shadow-sm transition-transform mt-px",
                            myRegistrations?.has(hack.id)
                              ? "translate-x-3"
                              : "translate-x-0",
                          ].join(" ")}
                        />
                      </span>
                    </button>
                  </div>

                  {expanded && (
                    <div className="border-t border-border px-4 py-3">
                      {hack.projects.length > 0 ? (
                        <div className="space-y-2">
                          {hack.projects.map((proj) => (
                            <div
                              key={proj.id}
                              className="flex items-center gap-2 p-2 bg-surface-2 border border-border rounded"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium truncate">{proj.name}</div>
                                <div className="text-[9px] text-muted-foreground truncate">by {proj.owner_name}</div>
                              </div>
                              {proj.links.length > 0 && (
                                <div className="flex items-center gap-1 shrink-0">
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
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                      >
                                        <Icon className="size-3" />
                                      </a>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No projects linked yet.
                        </p>
                      )}

                      <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => setLinkProjectModal(hack.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase text-primary border border-primary/30 hover:bg-primary/5 transition-colors rounded"
                        >
                          <Plus className="size-3" />
                          Link Project
                        </button>
                        <button
                          onClick={() => startEditEvent(hack)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase text-info border border-info/30 hover:bg-info/5 transition-colors rounded"
                        >
                          <Pencil className="size-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this event? This cannot be undone.")) {
                              deleteEventMutation.mutate(hack.id);
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase text-destructive border border-destructive/30 hover:bg-destructive/5 transition-colors rounded"
                        >
                          <Trash2 className="size-3" />
                          Delete
                        </button>
                        </div>
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
          <span className="text-sm font-semibold">Link Project to Event</span>
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
