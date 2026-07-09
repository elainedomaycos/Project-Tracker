import { createServerFn } from "@tanstack/react-start";

export type DemoAccount = {
  email: string;
  password: string;
  display_name: string;
  role: "pm" | "developer" | "qa";
  team: string;
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: "pm@scrum.demo", password: "demo1234!", display_name: "Elaine Thorne", role: "pm", team: "Delivery" },
  { email: "dev@scrum.demo", password: "demo1234!", display_name: "John Alvarez", role: "developer", team: "Engineering" },
  { email: "qa@scrum.demo", password: "demo1234!", display_name: "Sara Petrov", role: "qa", team: "Quality" },
];

export const ensureDemoAccounts = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  for (const acct of DEMO_ACCOUNTS) {
    const { data: existing } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    let user = existing?.users.find((u) => u.email?.toLowerCase() === acct.email.toLowerCase());

    if (!user) {
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email: acct.email,
        password: acct.password,
        email_confirm: true,
        user_metadata: { display_name: acct.display_name },
      });
      if (error) {
        console.error("createUser failed", acct.email, error);
        continue;
      }
      user = created.user!;
    }

    await supabaseAdmin.from("profiles").upsert(
      { id: user.id, display_name: acct.display_name, team: acct.team },
      { onConflict: "id" },
    );

    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: user.id, role: acct.role }, { onConflict: "user_id,role" });
  }

  return { ok: true, accounts: DEMO_ACCOUNTS.map(({ password: _pw, ...rest }) => rest) };
});