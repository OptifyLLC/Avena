"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type UserRole = "admin" | "client";
export type UserStatus = "pending" | "approved" | "unapproved" | "rejected";

export type CalendarHealth =
  | "not_connected"
  | "healthy"
  | "access_expired"
  | "reconnect_needed";

export type CalendarInfo = {
  connected: boolean;
  email: string | null;
  scope: string | null;
  expiresAt: string | null;
  updatedAt: string | null;
  hasRefreshToken: boolean;
  health: CalendarHealth;
};

export type User = {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  tenantId: string;
  vapiAssistantId?: string | null;
  twilioPhoneNumber?: string | null;
  sheetTabName?: string | null;
  calendar: CalendarInfo;
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
  usersLoading: boolean;
  refreshUsers: () => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: true; user: User } | { ok: false; error: string }>;
  signup: (
    input: SignupInput
  ) => Promise<{ ok: true; needsEmailConfirm: boolean } | { ok: false; error: string }>;
  logout: () => Promise<void>;
  setStatus: (
    userId: string,
    status: UserStatus
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  resetPassword: (
    email: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  updatePassword: (
    newPassword: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type ProfileRow = {
  id: string;
  tenant_id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  status: string;
  created_at: string;
};
type TenantRow = {
  name: string | null;
  vapi_assistant_id: string | null;
  twilio_phone_number: string | null;
  sheet_tab_name: string | null;
};
type ProfileWithTenant = ProfileRow & { tenants: TenantRow | TenantRow[] | null };

type GoogleTokenPublicRow = {
  tenant_id: string;
  google_email: string | null;
  scope: string | null;
  expires_at: string | null;
  updated_at: string | null;
  has_refresh_token: boolean;
};

const EMPTY_CALENDAR: CalendarInfo = {
  connected: false,
  email: null,
  scope: null,
  expiresAt: null,
  updatedAt: null,
  hasRefreshToken: false,
  health: "not_connected",
};

function rowToCalendar(row: GoogleTokenPublicRow | null | undefined): CalendarInfo {
  if (!row) return EMPTY_CALENDAR;
  const expiresMs = row.expires_at ? new Date(row.expires_at).getTime() : 0;
  const expired = !expiresMs || expiresMs < Date.now();
  const health: CalendarHealth = !row.has_refresh_token
    ? "reconnect_needed"
    : expired
      ? "access_expired"
      : "healthy";
  return {
    connected: true,
    email: row.google_email,
    scope: row.scope,
    expiresAt: row.expires_at,
    updatedAt: row.updated_at,
    hasRefreshToken: row.has_refresh_token,
    health,
  };
}

function normalizeRole(role: string): UserRole {
  return role === "admin" ? "admin" : "client";
}

function normalizeStatus(status: string): UserStatus {
  if (status === "approved") return "approved";
  if (status === "rejected") return "rejected";
  if (status === "unapproved") return "unapproved";
  return "pending";
}

function rowToUser(
  row: ProfileWithTenant,
  fallbackEmail = "",
  calendar: CalendarInfo = EMPTY_CALENDAR
): User {
  const tenant = Array.isArray(row.tenants) ? row.tenants[0] : row.tenants;
  return {
    id: row.id,
    email: row.email ?? fallbackEmail,
    name: row.full_name ?? "",
    company: tenant?.name ?? undefined,
    role: normalizeRole(row.role),
    status: normalizeStatus(row.status),
    createdAt: row.created_at,
    tenantId: row.tenant_id,
    vapiAssistantId: tenant?.vapi_assistant_id ?? null,
    twilioPhoneNumber: tenant?.twilio_phone_number ?? null,
    sheetTabName: tenant?.sheet_tab_name ?? null,
    calendar,
  };
}

async function loadCalendarMap(
  supabase: SupabaseClient
): Promise<Map<string, CalendarInfo>> {
  const { data, error } = await supabase
    .from("google_tokens_public")
    .select("tenant_id, google_email, scope, expires_at, updated_at, has_refresh_token");
  if (error || !data) return new Map();
  const map = new Map<string, CalendarInfo>();
  (data as GoogleTokenPublicRow[]).forEach((row) => {
    map.set(row.tenant_id, rowToCalendar(row));
  });
  return map;
}

async function loadUser(
  supabase: SupabaseClient,
  session: Session | null
): Promise<User | null> {
  if (!session) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, tenant_id, full_name, email, role, status, created_at, tenants(name, vapi_assistant_id, twilio_phone_number, sheet_tab_name)")
    .eq("id", session.user.id)
    .maybeSingle<ProfileWithTenant>();
  if (!data) return null;

  const { data: tokenRow } = await supabase
    .from("google_tokens_public")
    .select("tenant_id, google_email, scope, expires_at, updated_at, has_refresh_token")
    .eq("tenant_id", data.tenant_id)
    .maybeSingle<GoogleTokenPublicRow>();

  return rowToUser(data, session.user.email ?? "", rowToCalendar(tokenRow));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const usersLoadedForAdmin = useRef<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setAuthReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!authReady) return;
    let cancelled = false;
    loadUser(supabase, session).then((u) => {
      if (cancelled) return;
      setUser(u);
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [supabase, session, authReady]);

  const refreshUsers = useCallback(async () => {
    if (!user || user.role !== "admin") {
      return;
    }
    setUsersLoading(true);
    const [{ data, error }, calendarMap] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, tenant_id, full_name, email, role, status, created_at, tenants(name, vapi_assistant_id, twilio_phone_number, sheet_tab_name)")
        .order("created_at", { ascending: false }),
      loadCalendarMap(supabase),
    ]);
    if (!error && data) {
      setUsers(
        (data as ProfileWithTenant[]).map((row) =>
          rowToUser(row, "", calendarMap.get(row.tenant_id) ?? EMPTY_CALENDAR)
        )
      );
    }
    setUsersLoading(false);
  }, [supabase, user]);

  // Load users once when an admin logs in.
  useEffect(() => {
    if (!user || user.role !== "admin") {
      usersLoadedForAdmin.current = null;
      return;
    }
    if (usersLoadedForAdmin.current === user.id) return;
    usersLoadedForAdmin.current = user.id;
    void refreshUsers();
  }, [user, refreshUsers]);

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
      const siteUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: siteUrl
            ? `${siteUrl}/auth/callback?next=/dashboard`
            : undefined,
          data: {
            full_name: name.trim(),
            company: company?.trim() || name.trim(),
          },
        },
      });
      if (error) return { ok: false, error: error.message };
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
    setUsers([]);
  }, [supabase]);

  const refreshUser = useCallback<AuthContextValue["refreshUser"]>(async () => {
    const { data } = await supabase.auth.getSession();
    const u = await loadUser(supabase, data.session);
    setUser(u);
  }, [supabase]);

  const resetPassword = useCallback<AuthContextValue["resetPassword"]>(
    async (email) => {
      const siteUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const redirectTo = siteUrl
        ? `${siteUrl}/auth/callback?next=/reset-password`
        : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        redirectTo ? { redirectTo } : undefined
      );
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    [supabase]
  );

  const updatePassword = useCallback<AuthContextValue["updatePassword"]>(
    async (newPassword) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    [supabase]
  );

  const setStatus = useCallback<AuthContextValue["setStatus"]>(
    async (userId, status) => {
      const res = await fetch("/api/admin/approve-client", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, status }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !payload.ok) {
        return { ok: false, error: payload.error ?? `HTTP ${res.status}` };
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status } : u))
      );
      return { ok: true };
    },
    []
  );

  const value = useMemo<AuthContextValue>(
    () => {
      const visibleUsers = user?.role === "admin" ? users : [];

      return {
      hydrated,
      user,
      users: visibleUsers,
      usersLoading,
      refreshUsers,
      login,
      signup,
      logout,
      setStatus,
      resetPassword,
      updatePassword,
      refreshUser,
      };
    },
    [
      hydrated,
      user,
      users,
      usersLoading,
      refreshUsers,
      login,
      signup,
      logout,
      setStatus,
      resetPassword,
      updatePassword,
      refreshUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
