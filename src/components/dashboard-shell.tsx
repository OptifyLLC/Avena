"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const clientNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: <IconHome /> },
  { label: "Call log", href: "/dashboard/calls", icon: <IconPhone /> },
  { label: "Appointments", href: "/dashboard/appointments", icon: <IconCalendar /> },
  { label: "Leads", href: "/dashboard/leads", icon: <IconSpark /> },
  { label: "Settings", href: "/dashboard/settings", icon: <IconGear /> },
];

const adminNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: <IconHome /> },
  { label: "Client requests", href: "/dashboard/clients", icon: <IconUsers /> },
  { label: "Settings", href: "/dashboard/settings", icon: <IconGear /> },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, hydrated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "admin" && user.status !== "approved") {
      router.replace("/pending");
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-[13px] text-zinc-500">
        <span className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.15em]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          Loading
        </span>
      </div>
    );
  }

  if (!user) return null;

  const nav = user.role === "admin" ? adminNav : clientNav;

  return (
    <div className="relative min-h-screen bg-[#050505] text-zinc-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[400px] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(16,185,129,0.06),transparent_75%)] mix-blend-screen"
      />

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/5 bg-[#070808]/90 backdrop-blur-xl md:flex">
        <SidebarBrand role={user.role} />
        <SidebarNav nav={nav} pathname={pathname} />
        <SidebarUser
          name={user.name}
          email={user.email}
          onLogout={() => {
            logout();
            router.replace("/login");
          }}
        />
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 bg-[#070808]/85 px-4 backdrop-blur-xl md:hidden">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/5"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M4 8h16" />
                <path d="M4 16h16" />
              </>
            )}
          </svg>
        </button>
        <Link
          href="/"
          className="text-[18px] font-semibold -tracking-[0.02em] text-white"
        >
          Operavo
        </Link>
        {user.role === "admin" && (
          <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
            Admin
          </span>
        )}
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-white/10 bg-[#070808]/95 backdrop-blur-xl">
            <SidebarBrand role={user.role} />
            <SidebarNav
              nav={nav}
              pathname={pathname}
              onNavigate={() => setMenuOpen(false)}
            />
            <SidebarUser
              name={user.name}
              email={user.email}
              onLogout={() => {
                logout();
                router.replace("/login");
              }}
            />
          </aside>
        </div>
      )}

      <main className="relative md:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 md:px-8 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarBrand({ role }: { role: "admin" | "client" }) {
  return (
    <div className="flex h-16 items-center gap-2 border-b border-white/5 px-5">
      <Link
        href="/"
        className="text-[20px] font-semibold -tracking-[0.02em] text-white transition-colors hover:text-white/80"
      >
        Operavo
      </Link>
      {role === "admin" && (
        <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
          Admin
        </span>
      )}
    </div>
  );
}

function SidebarNav({
  nav,
  pathname,
  onNavigate,
}: {
  nav: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
      {nav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-colors",
              active
                ? "bg-white/5 text-white"
                : "text-zinc-400 hover:bg-white/3 hover:text-zinc-100"
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center transition-colors",
                active
                  ? "text-emerald-400"
                  : "text-zinc-500 group-hover:text-zinc-300"
              )}
            >
              {item.icon}
            </span>
            <span className="-tracking-[0.005em]">{item.label}</span>
            {active && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarUser({
  name,
  email,
  onLogout,
}: {
  name: string;
  email: string;
  onLogout: () => void;
}) {
  return (
    <div className="border-t border-white/5 p-3">
      <div className="flex items-center gap-2 rounded-lg p-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-zinc-100">
            {name}
          </p>
          <p className="truncate text-[11px] text-zinc-500">{email}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          aria-label="Sign out"
          title="Sign out"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <IconLogout />
        </button>
      </div>
    </div>
  );
}

function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function IconSpark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
    </svg>
  );
}
function IconGear() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
