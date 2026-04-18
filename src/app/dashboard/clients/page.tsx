"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import type { User, UserStatus } from "@/lib/auth";
import { Badge, Button, Card } from "@/components/ui";
import { timeAgo, cn } from "@/lib/utils";

type Filter = "pending" | "approved" | "unapproved" | "all";

export default function ClientsPage() {
  const { user, users, setStatus } = useAuth();
  const [filter, setFilter] = useState<Filter>("pending");
  const [search, setSearch] = useState("");

  const clients = useMemo(
    () => users.filter((u) => u.role === "client"),
    [users]
  );

  const counts = useMemo(
    () => ({
      pending: clients.filter((u) => u.status === "pending").length,
      approved: clients.filter((u) => u.status === "approved").length,
      unapproved: clients.filter((u) => u.status === "unapproved").length,
      all: clients.length,
    }),
    [clients]
  );

  const visible = useMemo(() => {
    const byFilter = clients.filter((u) =>
      filter === "all" ? true : u.status === filter
    );
    const q = search.trim().toLowerCase();
    return q
      ? byFilter.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            (u.company?.toLowerCase().includes(q) ?? false)
        )
      : byFilter;
  }, [clients, filter, search]);

  if (!user) return null;

  if (user.role !== "admin") {
    return (
      <Card className="p-10 text-center">
        <h1 className="text-lg font-semibold">Admins only</h1>
        <p className="mt-2 text-sm text-zinc-500">
          You don&rsquo;t have permission to view this page.
        </p>
      </Card>
    );
  }

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "approved", label: "Approved", count: counts.approved },
    { key: "unapproved", label: "Unapproved", count: counts.unapproved },
    { key: "all", label: "All", count: counts.all },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Client requests
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Approve new workspaces or revoke access from existing clients.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
          <div className="flex flex-wrap gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  filter === t.key
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-100"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "ml-2 rounded-full px-1.5 py-0.5 text-xs",
                    filter === t.key
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  )}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, company"
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:border-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-zinc-500">
            No clients match that filter.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wider text-zinc-500 dark:border-zinc-800">
                    <th className="px-5 py-3 font-medium">Client</th>
                    <th className="px-5 py-3 font-medium">Company</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Requested</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                              {u.name}
                            </p>
                            <p className="truncate text-xs text-zinc-500">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">
                        {u.company || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={u.status} />
                      </td>
                      <td className="px-5 py-4 text-zinc-500">
                        {timeAgo(u.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <ActionButtons user={u} onChange={setStatus} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-zinc-100 md:hidden dark:divide-zinc-900">
              {visible.map((u) => (
                <li key={u.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={u.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{u.name}</p>
                        <StatusBadge status={u.status} />
                      </div>
                      <p className="truncate text-xs text-zinc-500">
                        {u.email}
                      </p>
                      {u.company && (
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {u.company}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-zinc-400">
                        {timeAgo(u.createdAt)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <ActionButtons user={u} onChange={setStatus} />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </div>
  );
}

function ActionButtons({
  user,
  onChange,
}: {
  user: User;
  onChange: (id: string, status: UserStatus) => void;
}) {
  if (user.status === "pending") {
    return (
      <>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onChange(user.id, "rejected")}
        >
          Reject
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onChange(user.id, "approved")}
        >
          Approve
        </Button>
      </>
    );
  }
  if (user.status === "approved") {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => onChange(user.id, "unapproved")}
      >
        Revoke access
      </Button>
    );
  }
  if (user.status === "unapproved" || user.status === "rejected") {
    return (
      <Button
        size="sm"
        variant="secondary"
        onClick={() => onChange(user.id, "approved")}
      >
        Approve
      </Button>
    );
  }
  return null;
}

function StatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, { tone: "amber" | "emerald" | "neutral" | "rose"; label: string }> = {
    pending: { tone: "amber", label: "Pending" },
    approved: { tone: "emerald", label: "Approved" },
    unapproved: { tone: "neutral", label: "Unapproved" },
    rejected: { tone: "rose", label: "Rejected" },
  };
  const s = map[status];
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
      {initials}
    </div>
  );
}
