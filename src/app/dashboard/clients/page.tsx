"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import type { User, UserStatus } from "@/lib/auth";
import { Badge, Button, Card } from "@/components/ui";
import { ConfigureVapiModal } from "@/components/configure-vapi-modal";
import { timeAgo, cn } from "@/lib/utils";

type Filter = "pending" | "approved" | "unapproved" | "all";

type ChangeStatusFn = (id: string, status: UserStatus) => void;

export default function ClientsPage() {
  const { user, users, usersLoading, refreshUsers, setStatus } = useAuth();
  const [filter, setFilter] = useState<Filter>("pending");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [configureUser, setConfigureUser] = useState<User | null>(null);

  const clients = useMemo(
    () => users.filter((u) => u.role === "client"),
    [users]
  );

  const counts = useMemo(
    () => ({
      pending: clients.filter((u) => u.status === "pending").length,
      approved: clients.filter((u) => u.status === "approved").length,
      unapproved: clients.filter(
        (u) => u.status === "unapproved" || u.status === "rejected"
      ).length,
      all: clients.length,
    }),
    [clients]
  );

  const visible = useMemo(() => {
    const byFilter = clients.filter((u) => {
      if (filter === "all") return true;
      if (filter === "unapproved") {
        return u.status === "unapproved" || u.status === "rejected";
      }
      return u.status === filter;
    });
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

  async function handleChange(id: string, status: UserStatus) {
    setErrorMsg(null);
    setBusyId(id);
    const res = await setStatus(id, status);
    setBusyId(null);
    if (!res.ok) {
      setErrorMsg(res.error);
      return;
    }
    await refreshUsers();
    if (status === "approved") {
      const approved = users.find((u) => u.id === id);
      if (approved) setConfigureUser({ ...approved, status: "approved" });
    }
  }

  function handleConfigure(u: User) {
    setConfigureUser(u);
  }

  async function handleConfigureSaved() {
    await refreshUsers();
  }

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
          Approve new workspaces, pair them with a Vapi assistant, or revoke access.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-[13px] text-rose-200">
          {errorMsg}
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-white/5 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1 rounded-lg bg-white/5 p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  filter === t.key
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "ml-2 rounded-full px-1.5 py-0.5 text-xs",
                    filter === t.key
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-zinc-400"
                  )}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
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
              className="h-10 w-full rounded-lg border border-white/10 bg-black/40 pl-9 pr-3 text-sm text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
            />
          </div>
        </div>

        {usersLoading && visible.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-zinc-500">
            Loading clients…
          </div>
        ) : visible.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-zinc-500">
            No clients match that filter.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-zinc-500">
                    <th className="px-5 py-3 font-medium">Client</th>
                    <th className="px-5 py-3 font-medium">Company</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Voice agent</th>
                    <th className="px-5 py-3 font-medium">Requested</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-zinc-100">
                              {u.name || "(no name)"}
                            </p>
                            <p className="truncate text-xs text-zinc-500">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-zinc-400">
                        {u.company || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={u.status} />
                      </td>
                      <td className="px-5 py-4">
                        <VapiStatus user={u} />
                      </td>
                      <td className="px-5 py-4 text-zinc-500">
                        {timeAgo(u.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <ActionButtons
                            user={u}
                            onChange={handleChange}
                            onConfigure={handleConfigure}
                            busy={busyId === u.id}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-white/5 md:hidden">
              {visible.map((u) => (
                <li key={u.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={u.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">
                          {u.name || "(no name)"}
                        </p>
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
                      <div className="mt-2">
                        <VapiStatus user={u} />
                      </div>
                      <p className="mt-1 text-xs text-zinc-600">
                        {timeAgo(u.createdAt)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <ActionButtons
                          user={u}
                          onChange={handleChange}
                          onConfigure={handleConfigure}
                          busy={busyId === u.id}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      <ConfigureVapiModal
        open={configureUser !== null}
        user={configureUser}
        onClose={() => setConfigureUser(null)}
        onSaved={handleConfigureSaved}
      />
    </div>
  );
}

function ActionButtons({
  user,
  onChange,
  onConfigure,
  busy,
}: {
  user: User;
  onChange: ChangeStatusFn;
  onConfigure: (u: User) => void;
  busy: boolean;
}) {
  if (user.status === "pending") {
    return (
      <>
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => onChange(user.id, "rejected")}
        >
          Reject
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={busy}
          onClick={() => onChange(user.id, "approved")}
        >
          {busy ? "Approving…" : "Approve"}
        </Button>
      </>
    );
  }
  if (user.status === "approved") {
    return (
      <>
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => onChange(user.id, "unapproved")}
        >
          {busy ? "Updating…" : "Revoke"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onConfigure(user)}
        >
          {user.vapiAssistantId ? "Edit Vapi" : "Configure Vapi"}
        </Button>
      </>
    );
  }
  if (user.status === "unapproved" || user.status === "rejected") {
    return (
      <Button
        size="sm"
        variant="secondary"
        disabled={busy}
        onClick={() => onChange(user.id, "approved")}
      >
        {busy ? "Approving…" : "Approve"}
      </Button>
    );
  }
  return null;
}

function VapiStatus({ user }: { user: User }) {
  if (user.status !== "approved") {
    return <span className="text-xs text-zinc-600">—</span>;
  }
  if (!user.vapiAssistantId) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px] text-amber-300">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
        Not configured
      </span>
    );
  }
  const truncated =
    user.vapiAssistantId.length > 14
      ? user.vapiAssistantId.slice(0, 8) + "…" + user.vapiAssistantId.slice(-4)
      : user.vapiAssistantId;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="inline-flex items-center gap-1.5 text-[12px] text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
        <span className="font-mono">{truncated}</span>
      </span>
      {user.twilioPhoneNumber && (
        <span className="text-[11px] text-zinc-500">
          {user.twilioPhoneNumber}
        </span>
      )}
    </div>
  );
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
  const initials =
    name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-200 ring-1 ring-inset ring-emerald-500/30">
      {initials}
    </div>
  );
}
