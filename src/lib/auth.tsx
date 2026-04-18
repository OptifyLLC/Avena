"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type UserRole = "admin" | "client";
export type UserStatus = "pending" | "approved" | "unapproved" | "rejected";

export type User = {
  id: string;
  email: string;
  name: string;
  company?: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

type Session = { userId: string } | null;

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
  ) => { ok: true; user: User } | { ok: false; error: string };
  signup: (input: SignupInput) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  setStatus: (userId: string, status: UserStatus) => void;
};

const USERS_KEY = "avena.users.v1";
const SESSION_KEY = "avena.session.v1";

const SEED_USERS: User[] = [
  {
    id: "u_admin",
    email: "admin@avena.ai",
    name: "Avena Admin",
    password: "admin123",
    role: "admin",
    status: "approved",
    createdAt: new Date(Date.now() - 30 * 86_400_000).toISOString(),
  },
  {
    id: "u_demo_client",
    email: "client@avena.ai",
    name: "Demo Client",
    company: "Acme Health",
    password: "client123",
    role: "client",
    status: "approved",
    createdAt: new Date(Date.now() - 14 * 86_400_000).toISOString(),
  },
  {
    id: "u_pending_1",
    email: "sarah@northwellclinic.com",
    name: "Sarah Nguyen",
    company: "Northwell Clinic",
    password: "password1",
    role: "client",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
  {
    id: "u_pending_2",
    email: "mike@autohausnyc.com",
    name: "Mike Ramirez",
    company: "Autohaus NYC",
    password: "password1",
    role: "client",
    status: "pending",
    createdAt: new Date(Date.now() - 6 * 3_600_000).toISOString(),
  },
  {
    id: "u_pending_3",
    email: "priya@legaledgeca.com",
    name: "Priya Shah",
    company: "LegalEdge CA",
    password: "password1",
    role: "client",
    status: "pending",
    createdAt: new Date(Date.now() - 45 * 60_000).toISOString(),
  },
  {
    id: "u_unapproved_1",
    email: "james@oldclient.io",
    name: "James Park",
    company: "OldClient Inc",
    password: "password1",
    role: "client",
    status: "unapproved",
    createdAt: new Date(Date.now() - 40 * 86_400_000).toISOString(),
  },
];

const AuthContext = createContext<AuthContextValue | null>(null);

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [session, setSession] = useState<Session>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = safeRead<User[] | null>(USERS_KEY, null);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsers(stored);
    } else {
      safeWrite(USERS_KEY, SEED_USERS);
    }
    const s = safeRead<Session>(SESSION_KEY, null);
    setSession(s);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) safeWrite(USERS_KEY, users);
  }, [users, hydrated]);

  useEffect(() => {
    if (hydrated) safeWrite(SESSION_KEY, session);
  }, [session, hydrated]);

  const user = useMemo(
    () => (session ? users.find((u) => u.id === session.userId) ?? null : null),
    [session, users]
  );

  const login = useCallback<AuthContextValue["login"]>(
    (email, password) => {
      const normalized = email.trim().toLowerCase();
      const found = users.find((u) => u.email.toLowerCase() === normalized);
      if (!found) return { ok: false, error: "No account found for that email." };
      if (found.password !== password) {
        return { ok: false, error: "Incorrect password." };
      }
      if (found.role === "client" && found.status !== "approved") {
        const msg =
          found.status === "pending"
            ? "Your account is awaiting admin approval."
            : found.status === "unapproved"
              ? "Your access has been revoked. Contact your administrator."
              : "This account has been rejected.";
        return { ok: false, error: msg };
      }
      setSession({ userId: found.id });
      return { ok: true, user: found };
    },
    [users]
  );

  const signup = useCallback<AuthContextValue["signup"]>(
    ({ name, email, company, password }) => {
      const normalized = email.trim().toLowerCase();
      if (users.some((u) => u.email.toLowerCase() === normalized)) {
        return { ok: false, error: "An account with that email already exists." };
      }
      const newUser: User = {
        id: `u_${Math.random().toString(36).slice(2, 10)}`,
        name: name.trim(),
        email: normalized,
        company: company?.trim() || undefined,
        password,
        role: "client",
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [newUser, ...prev]);
      return { ok: true };
    },
    [users]
  );

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const setStatus = useCallback<AuthContextValue["setStatus"]>(
    (userId, status) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status } : u))
      );
      setSession((prev) => {
        if (!prev || prev.userId !== userId) return prev;
        return status === "approved" ? prev : null;
      });
    },
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({ hydrated, user, users, login, signup, logout, setStatus }),
    [hydrated, user, users, login, signup, logout, setStatus]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
