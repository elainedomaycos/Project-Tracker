import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type UserRole = "super_admin" | "developer" | "qa";

export type Profile = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

const SUPER_ADMIN_EMAILS = ["edomaycos@gmail.com", "abellajoshua18@gmail.com", "allenmartillan715@gmail.com"];

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  recoveryMode: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, name: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<string | null>;
  isSuperAdmin: boolean;
  isDeveloper: boolean;
  isQa: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let settled = false;

    function finishLoading() {
      if (!cancelled && !settled) {
        settled = true;
        setLoading(false);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        return loadProfile(u.id, u.email ?? "").catch(() => {});
      }
    }).then(finishLoading).catch(finishLoading);

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
      }
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        try { await loadProfile(u.id, u.email ?? ""); } catch {}
      } else {
        setProfile(null);
      }
      finishLoading();
    });

    return () => { cancelled = true; listener?.subscription.unsubscribe(); finishLoading(); };
  }, []);

  async function loadProfile(userId: string, email: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const isSuper = SUPER_ADMIN_EMAILS.includes(email.toLowerCase());

    if (data) {
      if (isSuper && data.role !== "super_admin") {
        const updated = { ...data, role: "super_admin" as const };
        await supabase.from("profiles").upsert(updated);
        setProfile(updated as Profile);
      } else {
        setProfile(data as Profile);
      }
    } else {
      let role: UserRole = isSuper ? "super_admin" : "developer";
      let inviteName = "";
      if (!isSuper) {
        const { data: invite } = await supabase
          .from("invitations")
          .select("role, name")
          .eq("email", email.toLowerCase())
          .maybeSingle();
        if (invite) {
          role = invite.role as UserRole;
          inviteName = invite.name;
        }
      }
      const newProfile: Profile = { id: userId, email, name: inviteName, role };
      await supabase.from("profiles").insert(newProfile);
      setProfile(newProfile);
    }
  }

  async function signIn(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }

  async function signUp(email: string, password: string, name: string): Promise<string | null> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    if (data.user) {
      const isSuper = SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
      let role: UserRole = isSuper ? "super_admin" : "developer";
      let profileName = name;
      if (!isSuper) {
        const { data: invite } = await supabase
          .from("invitations")
          .select("role, name")
          .eq("email", email.toLowerCase())
          .maybeSingle();
        if (invite) {
          role = invite.role as UserRole;
          profileName = invite.name;
        }
      }
      const newProfile: Profile = { id: data.user.id, email, name: profileName, role };
      await supabase.from("profiles").upsert(newProfile);
      try {
        if (role === "developer" || role === "qa") {
          const key = role === "developer" ? "developers" : "qa_users";
          const { data: existing } = await supabase.from("settings").select("value").eq("key", key).maybeSingle();
          const list: string[] = existing?.value ?? [];
          if (!list.includes(profileName)) {
            await supabase.from("settings").upsert({ key, value: [...list, profileName] });
          }
        }
      } catch { /* settings may not exist yet */ }
      setProfile(newProfile);
    }
    return null;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  async function resetPassword(email: string): Promise<string | null> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    return error?.message ?? null;
  }

  const value: AuthContextType = {
    user, profile, loading, recoveryMode,
    signIn, signUp, signOut, resetPassword,
    isSuperAdmin: profile?.role === "super_admin",
    isDeveloper: profile?.role === "developer",
    isQa: profile?.role === "qa",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
