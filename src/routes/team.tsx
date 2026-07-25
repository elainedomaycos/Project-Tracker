import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/console";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import {
  Users,
  Search,
  ExternalLink,
  Github,
  Globe,
  Palette,
  Smartphone,
  FileText,
  LinkIcon,
  Loader2,
  Briefcase,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team · Task Tracker" },
      { name: "description", content: "Meet our team and explore what they're building." },
    ],
  }),
  component: TeamPage,
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

const PROJECT_TYPE_LABELS: Record<string, string> = {
  personal: "Personal",
  hackathon: "Hackathon",
  freelance: "Freelance",
};

const STATUS_LABELS: Record<string, string> = {
  in_progress: "In Progress",
  completed: "Completed",
  archived: "Archived",
};

type TeamMember = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  role_title: string | null;
  team: string | null;
  skills: string[] | null;
  links: { type: LinkType; url: string }[] | null;
  projects: {
    id: string;
    name: string;
    short_description: string | null;
    project_type: string | null;
    role: string | null;
    technologies: string[] | null;
    image_url: string | null;
    status: string | null;
    links: { link_type: LinkType; url: string }[];
  }[];
};

function db() {
  return supabase as any;
}

async function fetchTeamMembers(): Promise<TeamMember[]> {
  const { data: profiles } = await db()
    .from("profiles")
    .select("id, display_name, avatar_url, bio, role_title, team, skills, links");

  if (!profiles?.length) return [];

  const memberIds = profiles.map((p: any) => p.id);

  const { data: memberProjects } = await db()
    .from("project_members")
    .select("member_id, project_id")
    .in("member_id", memberIds);

  const projectIds = [...new Set((memberProjects ?? []).map((mp: any) => mp.project_id))];

  let projectsData: any[] = [];
  let linksData: any[] = [];

  if (projectIds.length > 0) {
    const [projRes, linkRes] = await Promise.all([
      db().from("member_projects").select("*").in("id", projectIds),
      db().from("project_links").select("*").in("project_id", projectIds),
    ]);
    projectsData = projRes.data ?? [];
    linksData = linkRes.data ?? [];
  }

  const projectsByMember = new Map<string, typeof projectsData>();
  for (const mp of memberProjects ?? []) {
    const list = projectsByMember.get(mp.member_id) ?? [];
    const proj = projectsData.find((p) => p.id === mp.project_id);
    if (proj) list.push(proj);
    projectsByMember.set(mp.member_id, list);
  }

  const linksByProject = new Map<string, typeof linksData>();
  for (const link of linksData) {
    const list = linksByProject.get(link.project_id) ?? [];
    list.push(link);
    linksByProject.set(link.project_id, list);
  }

  return profiles.map((p: any) => ({
    id: p.id,
    display_name: p.display_name,
    avatar_url: p.avatar_url,
    bio: p.bio,
    role_title: p.role_title,
    team: p.team,
    skills: p.skills,
    links: p.links,
    projects: (projectsByMember.get(p.id) ?? []).map((proj: any) => ({
      id: proj.id,
      name: proj.name,
      short_description: proj.short_description,
      project_type: proj.project_type,
      role: proj.role,
      technologies: proj.technologies,
      image_url: proj.image_url,
      status: proj.status,
      links: linksByProject.get(proj.id) ?? [],
    })),
  }));
}

function TeamPage() {
  const { profile } = useAuth();
  const [search, setSearch] = useState("");

  const { data: members, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: fetchTeamMembers,
    staleTime: 30_000,
  });

  const filtered = (members ?? []).filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.display_name.toLowerCase().includes(q) ||
      m.role_title?.toLowerCase().includes(q) ||
      m.team?.toLowerCase().includes(q) ||
      m.bio?.toLowerCase().includes(q) ||
      m.skills?.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Task Tracker" }, { label: "Team" }]}
        status={{ label: `${members?.length ?? 0} members`, tone: "info" }}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Meet our team and explore what they're building.
          </p>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, role, skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-md bg-surface-2 border border-border text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 text-muted-foreground animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users className="size-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {search ? "No team members match your search." : "No team members yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                isOwnProfile={member.id === profile?.id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function MemberCard({
  member,
  isOwnProfile,
}: {
  member: TeamMember;
  isOwnProfile: boolean;
}) {
  const initials = member.display_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-3">
          {member.avatar_url ? (
            <img
              src={member.avatar_url}
              alt={member.display_name}
              className="size-10 rounded-full object-cover border border-border shrink-0"
            />
          ) : (
            <div className="size-10 rounded-full bg-primary/10 border border-primary/20 grid place-items-center text-sm font-bold text-primary shrink-0">
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold truncate">{member.display_name}</h3>
              {isOwnProfile && (
                <span className="px-1 py-0.5 text-[8px] font-mono uppercase bg-primary/10 text-primary border border-primary/20 rounded">
                  You
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {member.role_title && (
                <span className="text-[10px] text-muted-foreground truncate">{member.role_title}</span>
              )}
              {member.role_title && member.team && (
                <span className="text-muted-foreground/40">·</span>
              )}
              {member.team && (
                <span className="text-[10px] text-muted-foreground truncate">{member.team}</span>
              )}
            </div>
          </div>
        </div>

        {member.bio && (
          <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2">{member.bio}</p>
        )}

        {member.skills && member.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {member.skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="px-1.5 py-0.5 text-[9px] font-mono bg-surface-2 border border-border rounded"
              >
                {skill}
              </span>
            ))}
            {member.skills.length > 6 && (
              <span className="text-[9px] text-muted-foreground">+{member.skills.length - 6}</span>
            )}
          </div>
        )}

        {member.links && member.links.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {member.links.map((link) => {
              const cfg = LINK_CONFIG[link.type];
              if (!cfg) return null;
              const Icon = cfg.icon;
              return (
                <a
                  key={link.type}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title={cfg.label}
                >
                  <Icon className="size-3" />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {member.projects.length > 0 && (
        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Briefcase className="size-3 text-muted-foreground" />
            <span className="text-[9px] font-mono uppercase text-muted-foreground">
              {member.projects.length} project{member.projects.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-1.5">
            {member.projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center gap-2 text-[10px]">
                <span className="font-medium truncate">{project.name}</span>
                {project.status && project.status !== "completed" && (
                  <span className="px-1 py-0.5 text-[8px] font-mono uppercase bg-warning/10 text-warning border border-warning/20 rounded shrink-0">
                    {STATUS_LABELS[project.status] ?? project.status}
                  </span>
                )}
              </div>
            ))}
            {member.projects.length > 3 && (
              <span className="text-[9px] text-muted-foreground">+{member.projects.length - 3} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: TeamMember["projects"][number];
}) {
  return (
    <div className="bg-surface-2 border border-border rounded-lg overflow-hidden group">
      {project.image_url ? (
        <div className="h-28 overflow-hidden">
          <img
            src={project.image_url}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-28 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary/30">
            {project.name.charAt(0)}
          </span>
        </div>
      )}

      <div className="p-3 space-y-2">
        <div>
          <h4 className="text-sm font-medium truncate">{project.name}</h4>
          {project.short_description && (
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
              {project.short_description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {project.project_type && (
            <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-primary/10 text-primary border border-primary/20 rounded">
              {PROJECT_TYPE_LABELS[project.project_type] ?? project.project_type}
            </span>
          )}
          {project.status && project.status !== "completed" && (
            <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-warning/10 text-warning border border-warning/20 rounded">
              {STATUS_LABELS[project.status] ?? project.status}
            </span>
          )}
        </div>

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground bg-background border border-border rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {project.links.length > 0 && (
          <div className="flex items-center gap-1 pt-1">
            {project.links.map((link) => {
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
                  title={cfg.label}
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
  );
}
