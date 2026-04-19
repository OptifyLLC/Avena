"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type UserRole = "admin" | "client";
export type UserStatus = "pending" | "approved" | "unapproved" | "rejected";

export type User = {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  tenantId: string;
};

type SignupInput = {
  name: string;
  email: string;
  company?: string;
  password: string;
};

type AuthContextValue = {
  hydrated: boolean;
  user: User | null;
  users: User[];
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: true; user: User } | { ok: false; error: string }>;
  signup: (
    input: SignupInput
  ) => Promise<{ ok: true; needsEmailConfirm: boolean } | { ok: false; error: string }>;
  logout: () => Promise<void>;
  setStatus: (userId: string, status: UserStatus) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type ProfileRow = {
  id: string;
  tenant_id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  created_at: string;
};
type TenantRow = { name: string };

async function loadUser(
  supabase: SupabaseClient,
  session: Session | null
): Promise<User | null> {
  if (!session) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, tenant_id, full_name, email, role, created_at")
    .eq("id", session.user.id)
    .maybeSingle<ProfileRow>();

  if (!profile) return null;

  const { data: tenant } = await supabase
    .from("tenants")
    .select("name")
    .eq("id", profile.tenant_id)
    .maybeSingle<TenantRow>();

  return {
    id: profile.id,
    email: profile.email ?? session.user.email ?? "",
    name: profile.full_name ?? "",
    company: tenant?.name,
    role: (profile.role === "admin" ? "admin" : "client"),
    status: "approved",
    createdAt: profile.created_at,
    tenantId: profile.tenant_id,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Subscribe to auth changes only. Do NOT call other Supabase APIs here — it
  // deadlocks supabase-js internal auth lock.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  // Derive user from session in a separate effect so queries run outside the
  // auth callback.
  useEffect(() => {
    let cancelled = false;
    loadUser(supabase, session).then((u) => {
      if (cancelled) return;
      setUser(u);
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [supabase, session]);

  const login = useCallback<AuthContextValue["login"]>(
    async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) return { ok: false, error: error.message };
      const u = await loadUser(supabase, data.session);
      if (!u) return { ok: false, error: "Profile not found. Contact support." };
      setUser(u);
      return { ok: true, user: u };
    },
    [supabase]
  );

  const signup = useCallback<AuthContextValue["signup"]>(
    async ({ name, email, company, password }) => {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: name.trim(),
            company: company?.trim() || name.trim(),
          },
        },
      });
      if (error) return { ok: false, error: error.message };
      // If email confirmation is disabled, session is live and user is logged in.
      // If enabled, session is null and user must confirm via email first.
      const needsEmailConfirm = !data.session;
      if (data.session) {
        const u = await loadUser(supabase, data.session);
        setUser(u);
      }
      return { ok: true, needsEmailConfirm };
    },
    [supabase]
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  const setStatus = useCallback<AuthContextValue["setStatus"]>(() => {
    // Admin approval flow not wired yet — will land with the clients admin page.
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ hydrated, user, users: [], login, signup, logout, setStatus }),
    [hydrated, user, login, signup, logout, setStatus]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
