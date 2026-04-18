"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card } from "@/components/ui";
import { timeAgo } from "@/lib/utils";

export default function DashboardHome() {
  const { user } = useAuth();
  if (!user) return null;
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
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-semibold">Recent requests</h2>
            <p className="text-xs text-zinc-500">
              Newest signups awaiting your approval.
            </p>
          </div>
          <Link
            href="/dashboard/clients"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            View all →
          </Link>
        </div>
        {pending.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-zinc-500">
            No pending requests. You&rsquo;re all caught up.
          </div>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {pending.slice(0, 5).map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{u.name}</p>
                  <p className="truncate text-xs text-zinc-500">
                    {u.company ? `${u.company} · ` : ""}
                    {u.email}
                  </p>
                </div>
                <span className="text-xs text-zinc-500">
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
  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Avena is running for your workspace. Full analytics coming soon.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Calls today", value: "—" },
          { label: "Appointments", value: "—" },
          { label: "Avg. response", value: "—" },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-sm text-zinc-500">{s.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-400">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-zinc-500">Available once live.</p>
          </Card>
        ))}
      </div>

      <Card className="p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-900">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-semibold">Your dashboard is coming</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
          We&rsquo;re finalizing Avena&rsquo;s call log, calendar sync, and
          lead view for your workspace. You&rsquo;ll get an email the moment
          everything is live.
        </p>
      </Card>
    </div>
  );
}
