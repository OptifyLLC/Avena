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
  formatDuration,
  type AppointmentRow,
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
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Admin overview
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Approve new workspaces and manage existing client access.
          </p>
        </div>
        <Link href="/dashboard/clients">
          <Button>Review requests</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="p-6 transition-colors duration-200 hover:border-white/15 hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                {s.label}
              </p>
              <Badge tone={s.tone}>
                {s.tone === "amber"
                  ? "needs review"
                  : s.tone === "emerald"
                    ? "live"
                    : "inactive"}
              </Badge>
            </div>
            <p className="mt-3 text-[32px] font-semibold leading-none tracking-tight text-white tabular-nums">
              {s.value}
            </p>
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
  const rangeLabel =
    range === "7d" ? "7 days" : range === "30d" ? "30 days" : "90 days";

  // Hold "now" in state so the sliding-window stats stay accurate while the
  // dashboard is open, without calling the impure `Date.now()` during render.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const stats = useMemo(() => {
    const windowMs = windowDays * 86_400_000;
    const cutoff = now - windowMs;
    const prevCutoff = now - windowMs * 2;

    const callsInWindow = calls.filter((c) => {
      const t = new Date(c.started_at ?? c.created_at).getTime();
      return t >= cutoff && t <= now;
    }).length;
    const callsPrev = calls.filter((c) => {
      const t = new Date(c.started_at ?? c.created_at).getTime();
      return t >= prevCutoff && t < cutoff;
    }).length;

    const apptsInWindow = appointments.filter((a) => {
      const t = new Date(a.scheduled_for).getTime();
      return t >= cutoff && t <= now + windowMs;
    }).length;
    const upcomingAppts = appointments.filter(
      (a) => new Date(a.scheduled_for).getTime() >= now
    ).length;

    const hot = leads.filter((l) => l.score === "hot").length;
    const warm = leads.filter((l) => l.score === "warm").length;

    return [
      {
        label: `Calls · last ${rangeLabel}`,
        value: callsInWindow,
        delta: callsInWindow - callsPrev,
        sub:
          callsPrev === 0
            ? callsInWindow > 0
              ? "first in this window"
              : "no calls yet"
            : `vs ${callsPrev} prior`,
        href: "/dashboard/calls",
      },
      {
        label: `Appointments · ${rangeLabel}`,
        value: apptsInWindow,
        delta: null,
        sub:
          upcomingAppts > 0
            ? `${upcomingAppts} upcoming`
            : "none upcoming",
        href: "/dashboard/appointments",
      },
      {
        label: "Hot leads",
        value: hot,
        delta: null,
        sub: warm > 0 ? `${warm} warm` : "no warm leads",
        href: "/dashboard/leads",
      },
    ];
  }, [calls, appointments, leads, rangeLabel, windowDays, now]);

  const upNext = useMemo(() => {
    return appointments
      .filter((a) => new Date(a.scheduled_for).getTime() >= now)
      .sort(
        (a, b) =>
          new Date(a.scheduled_for).getTime() -
          new Date(b.scheduled_for).getTime()
      )
      .slice(0, 3);
  }, [appointments, now]);

  const recent = useMemo(() => calls.slice(0, 5), [calls]);
  const loading = callsLoading || apptsLoading || leadsLoading;

  const totalCallsInWindow = useMemo(() => {
    const cutoff = now - windowDays * 86_400_000;
    return calls.filter((c) => {
      const t = new Date(c.started_at ?? c.created_at).getTime();
      return t >= cutoff;
    }).length;
  }, [calls, windowDays, now]);

  if (!user) return null;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          Every call, booking, and lead — one pane for all of it.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
          >
            <Card className="p-6 transition-colors duration-200 group-hover:border-white/15 group-hover:bg-white/[0.04]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                {s.label}
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                {loading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <>
                    <p className="text-[32px] font-semibold leading-none tracking-tight text-white tabular-nums">
                      {s.value}
                    </p>
                    {s.delta !== null && s.delta !== 0 && (
                      <DeltaBadge delta={s.delta} />
                    )}
                  </>
                )}
              </div>
              <p className="mt-3 text-xs text-zinc-500">{s.sub}</p>
            </Card>
          </Link>
        ))}
      </div>

      {!loading && upNext.length > 0 && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-white">Up next</h2>
              <p className="text-xs text-zinc-500">
                Your next {upNext.length === 1 ? "appointment" : `${upNext.length} appointments`}.
              </p>
            </div>
            <Link
              href="/dashboard/appointments"
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              View all →
            </Link>
          </div>
          <ul className="divide-y divide-white/5">
            {upNext.map((a) => (
              <UpNextRow key={a.id} appt={a} now={now} />
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium text-white">Activity</h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              {loading
                ? "Loading…"
                : `${totalCallsInWindow} ${totalCallsInWindow === 1 ? "call" : "calls"} over the last ${rangeLabel}`}
            </p>
          </div>
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
              const name = c.caller_name?.trim() || "Unknown caller";
              const phone = c.caller_phone ?? null;
              const when = c.started_at ?? c.created_at;
              const duration = formatDuration(c.duration_seconds);
              return (
                <li
                  key={c.id}
                  className="flex flex-col gap-2 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-zinc-100">{name}</p>
                      <p className="truncate text-xs text-zinc-500">
                        {phone && (
                          <>
                            <span className="font-mono">{phone}</span>
                            <span className="mx-1.5 text-zinc-600">·</span>
                          </>
                        )}
                        <span>{duration}</span>
                        <span className="mx-1.5 text-zinc-600">·</span>
                        <span>{timeAgo(when)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {c.lead_score && <ScoreDot score={c.lead_score} />}
                    <Badge tone={tone}>{formatIntent(c)}</Badge>
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

function DeltaBadge({ delta }: { delta: number }) {
  const positive = delta > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
        positive
          ? "bg-emerald-500/15 text-emerald-300"
          : "bg-rose-500/15 text-rose-300"
      )}
      title={positive ? "Increase vs prior window" : "Decrease vs prior window"}
    >
      <span aria-hidden>{positive ? "▲" : "▼"}</span>
      <span>{Math.abs(delta)}</span>
    </span>
  );
}

function ScoreDot({ score }: { score: "hot" | "warm" | "cold" }) {
  const map: Record<typeof score, { tone: string; label: string }> = {
    hot: { tone: "bg-rose-400", label: "Hot lead" },
    warm: { tone: "bg-amber-400", label: "Warm lead" },
    cold: { tone: "bg-zinc-500", label: "Cold lead" },
  };
  const { tone, label } = map[score];
  return (
    <span
      className={cn("h-1.5 w-1.5 shrink-0 rounded-full", tone)}
      title={label}
      aria-label={label}
    />
  );
}

function UpNextRow({ appt, now }: { appt: AppointmentRow; now: number }) {
  const start = new Date(appt.scheduled_for);
  const minutesAway = Math.round((start.getTime() - now) / 60_000);
  const relative =
    minutesAway < 60
      ? `in ${Math.max(minutesAway, 1)} min`
      : minutesAway < 24 * 60
        ? `in ${Math.round(minutesAway / 60)}h`
        : start.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
  const time = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const name = appt.attendee_name?.trim() || appt.title || "Untitled appointment";
  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-12 shrink-0 flex-col items-center justify-center rounded-md border border-white/10 bg-black/30">
          <span className="font-mono text-[11px] text-white">{time}</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-100">{name}</p>
          <p className="truncate text-xs text-zinc-500">
            {appt.service ?? appt.title ?? "Appointment"}
          </p>
        </div>
      </div>
      <span className="shrink-0 text-xs text-zinc-400">{relative}</span>
    </li>
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
    const days: Array<{ count: number; date: Date }> = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < windowDays; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - (windowDays - 1 - i));
      days.push({ count: 0, date: d });
    }
    const start = today.getTime() - (windowDays - 1) * 86_400_000;
    for (const c of calls) {
      const t = new Date(c.started_at ?? c.created_at).getTime();
      if (t < start) continue;
      const idx = Math.floor((t - start) / 86_400_000);
      if (idx >= 0 && idx < windowDays) days[idx].count += 1;
    }
    return days;
  }, [calls, windowDays]);

  const max = Math.max(1, ...buckets.map((b) => b.count));
  // Pick which days to label on the x-axis so long windows stay readable.
  const labelEvery = windowDays <= 7 ? 1 : windowDays <= 30 ? 5 : 14;

  return (
    <div>
      <div className="flex h-28 items-end gap-1.5">
        {buckets.map((b, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-linear-to-t from-emerald-500/30 via-emerald-500 to-emerald-300"
            style={{ height: `${Math.max((b.count / max) * 100, 4)}%` }}
            title={`${b.date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })} · ${b.count} ${b.count === 1 ? "call" : "calls"}`}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-1.5 text-[10px] text-zinc-500">
        {buckets.map((b, i) => (
          <div key={i} className="flex-1 text-center">
            {i % labelEvery === 0 || i === buckets.length - 1
              ? b.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : ""}
          </div>
        ))}
      </div>
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
