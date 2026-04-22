"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card, Skeleton } from "@/components/ui";
import { timeAgo, cn } from "@/lib/utils";
import {
  useCalls,
  useAppointments,
  useLeads,
  formatIntent,
  intentTone,
} from "@/lib/dashboard-data";

export default function DashboardHome() {
  const { user } = useAuth();
  if (!user) return <OverviewSkeleton />;
  return user.role === "admin" ? <AdminOverview /> : <ClientOverview />;
}

function AdminOverview() {
  const { users } = useAuth();
  const pending = useMemo(
    () => users.filter((u) => u.role === "client" && u.status === "pending"),
    [users]
  );
  const approved = useMemo(
    () => users.filter((u) => u.role === "client" && u.status === "approved"),
    [users]
  );
  const unapproved = useMemo(
    () => users.filter((u) => u.role === "client" && u.status === "unapproved"),
    [users]
  );

  const stats = [
    {
      label: "Pending requests",
      value: pending.length,
      tone: "amber" as const,
    },
    {
      label: "Active clients",
      value: approved.length,
      tone: "emerald" as const,
    },
    {
      label: "Revoked",
      value: unapproved.length,
      tone: "neutral" as const,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin overview
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Approve new workspaces and manage existing client access.
          </p>
        </div>
        <Link href="/dashboard/clients">
          <Button>Review requests</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-sm text-zinc-500">{s.label}</p>
            <div className="mt-2 flex items-end gap-2">
              <p className="text-3xl font-semibold tracking-tight">
                {s.value}
              </p>
              <Badge tone={s.tone}>
                {s.tone === "amber"
                  ? "needs review"
                  : s.tone === "emerald"
                    ? "live"
                    : "inactive"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Recent requests</h2>
            <p className="text-xs text-zinc-500">
              Newest signups awaiting your approval.
            </p>
          </div>
          <Link
            href="/dashboard/clients"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            View all →
          </Link>
        </div>
        {pending.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-zinc-500">
            No pending requests. You&rsquo;re all caught up.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {pending.slice(0, 5).map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{u.name}</p>
                  <p className="truncate text-xs text-zinc-500">
                    {u.company ? `${u.company} · ` : ""}
                    {u.email}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-zinc-500">
                  {timeAgo(u.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function ClientOverview() {
  const { user } = useAuth();
  const [range, setRange] = useState<"7d" | "30d" | "90d">("7d");
  const { data: calls, loading: callsLoading } = useCalls();
  const { data: appointments, loading: apptsLoading } = useAppointments();
  const { data: leads, loading: leadsLoading } = useLeads();

  const windowDays = range === "7d" ? 7 : range === "30d" ? 30 : 90;

  // Hold "now" in state so the sliding-window stats stay accurate while the
  // dashboard is open, without calling the impure `Date.now()` during render.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const stats = useMemo(() => {
    const windowMs = windowDays * 86_400_000;
    const callsInWindow = calls.filter((c) => {
      const t = new Date(c.started_at ?? c.created_at).getTime();
      return now - t <= windowMs;
    }).length;
    const apptsInWindow = appointments.filter((a) => {
      const t = new Date(a.scheduled_for).getTime();
      return Math.abs(t - now) <= windowMs;
    }).length;
    const hot = leads.filter((l) => l.score === "hot").length;
    const rangeLabel = range === "7d" ? "7 days" : range === "30d" ? "30 days" : "90 days";
    return [
      { label: `Calls · last ${rangeLabel}`, value: callsInWindow },
      { label: `Appointments · ${rangeLabel}`, value: apptsInWindow },
      { label: "Hot leads", value: hot },
    ];
  }, [calls, appointments, leads, range, windowDays, now]);

  const recent = useMemo(() => calls.slice(0, 4), [calls]);
  const loading = callsLoading || apptsLoading || leadsLoading;

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Every call, booking, and lead — one pane for all of it.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {s.label}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              {loading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <p className="text-3xl font-semibold tracking-tight text-white">
                  {s.value}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">Activity</h2>
          <div className="flex gap-1 rounded-md bg-white/5 p-0.5 text-[11px]">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "rounded px-2.5 py-1 transition-colors",
                  range === r ? "bg-white text-black" : "text-zinc-400 hover:text-zinc-100"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <CallActivityBars calls={calls} windowDays={windowDays} />
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">Recent activity</h2>
            <p className="text-xs text-zinc-500">
              Latest calls Operavo handled on your behalf.
            </p>
          </div>
          <Link
            href="/dashboard/calls"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-zinc-500">
            {callsLoading
              ? "Loading calls…"
              : "No calls yet. As Operavo takes calls they’ll show up here."}
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {recent.map((c) => {
              const tone = intentTone(c);
              const caller = c.caller_phone ?? c.caller_name ?? "Unknown";
              const when = c.started_at ?? c.created_at;
              return (
                <li
                  key={c.id}
                  className="flex flex-col gap-2 px-4 py-3.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                    <span className="truncate font-mono text-zinc-300">{caller}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <Badge tone={tone}>{formatIntent(c)}</Badge>
                    <span className="shrink-0 text-xs text-zinc-500">
                      {timeAgo(when)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

function CallActivityBars({
  calls,
  windowDays,
}: {
  calls: { started_at: string | null; created_at: string }[];
  windowDays: number;
}) {
  const buckets = useMemo(() => {
    const days = Array.from({ length: windowDays }, () => 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = today.getTime() - (windowDays - 1) * 86_400_000;
    for (const c of calls) {
      const t = new Date(c.started_at ?? c.created_at).getTime();
      if (t < start) continue;
      const idx = Math.floor((t - start) / 86_400_000);
      if (idx >= 0 && idx < windowDays) days[idx] += 1;
    }
    return days;
  }, [calls, windowDays]);

  const max = Math.max(1, ...buckets);
  return (
    <div className="flex h-28 items-end gap-1.5">
      {buckets.map((b, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-linear-to-t from-emerald-500/30 via-emerald-500 to-emerald-300"
          style={{ height: `${Math.max((b / max) * 100, 4)}%` }}
        />
      ))}
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-3 w-24" />
            <div className="mt-3 flex items-baseline gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-32 rounded-md" />
        </div>
        <div className="flex h-28 items-end gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
            <Skeleton key={i} className="flex-1 h-20" />
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-white/5 px-5 py-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-2 h-3 w-48" />
        </div>
        <div className="divide-y divide-white/5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
