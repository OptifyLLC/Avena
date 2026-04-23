"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card, Skeleton } from "@/components/ui";
import { timeAgo, formatDate, cn } from "@/lib/utils";

type SubscriberResponse = {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
};

type Subscriber = SubscriberResponse & { isRecent: boolean };

type Filter = "all" | "recent";

const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export default function NewsletterPage() {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (user?.role !== "admin") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/newsletter", { cache: "no-store" });
        const json = (await res.json()) as
          | { ok: true; subscribers: SubscriberResponse[] }
          | { ok: false; error: string };
        if (cancelled) return;
        if (!json.ok) {
          setErrorMsg(json.error);
          setSubscribers([]);
        } else {
          const cutoff = Date.now() - RECENT_WINDOW_MS;
          setSubscribers(
            json.subscribers.map((s) => ({
              ...s,
              isRecent: new Date(s.created_at).getTime() >= cutoff,
            }))
          );
          setErrorMsg(null);
        }
      } catch (err) {
        if (cancelled) return;
        setErrorMsg(err instanceof Error ? err.message : "Failed to load");
        setSubscribers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.role, reloadToken]);

  function refresh() {
    setLoading(true);
    setReloadToken((n) => n + 1);
  }

  const counts = useMemo(
    () => ({
      all: subscribers.length,
      recent: subscribers.filter((s) => s.isRecent).length,
    }),
    [subscribers]
  );

  const visible = useMemo(() => {
    const byFilter =
      filter === "recent" ? subscribers.filter((s) => s.isRecent) : subscribers;
    const q = search.trim().toLowerCase();
    return q
      ? byFilter.filter((s) => s.email.toLowerCase().includes(q))
      : byFilter;
  }, [subscribers, filter, search]);

  async function copyAllEmails() {
    const emails = visible.map((s) => s.email).join(", ");
    if (!emails) return;
    try {
      await navigator.clipboard.writeText(emails);
    } catch {
      // Clipboard unavailable — silently ignore
    }
  }

  if (!user) return <NewsletterSkeleton />;

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
    { key: "all", label: "All", count: counts.all },
    { key: "recent", label: "Last 7 days", count: counts.recent },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Newsletter
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Subscribers captured from the landing page footer, mirrored from
            Google Sheets via n8n.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={copyAllEmails}
            disabled={visible.length === 0}
          >
            Copy emails
          </Button>
          <Button size="sm" variant="secondary" onClick={refresh} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-[13px] text-rose-200">
          {errorMsg}
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1 rounded-xl bg-black/30 p-1 ring-1 ring-inset ring-white/5">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",
                  filter === t.key
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "ml-2 inline-flex min-w-[18px] justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                    filter === t.key
                      ? "bg-zinc-900 text-white"
                      : "bg-white/10 text-zinc-400"
                  )}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-80">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
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
              placeholder="Search email"
              className="h-10 w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 transition-colors focus-visible:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/15"
            />
          </div>
        </div>

        {loading && subscribers.length === 0 ? (
          <div className="divide-y divide-white/5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-500"
              >
                <path d="M4 4h16v16H4z" />
                <path d="m22 6-10 7L2 6" />
              </svg>
            </div>
            <p className="text-sm text-zinc-400">
              {search || filter !== "all"
                ? "No subscribers match that filter."
                : "No subscribers yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    <th className="whitespace-nowrap px-6 py-3.5">Email</th>
                    <th className="whitespace-nowrap px-6 py-3.5">Source</th>
                    <th className="whitespace-nowrap px-6 py-3.5">Subscribed</th>
                    <th className="whitespace-nowrap px-6 py-3.5 text-right">
                      When
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-white/5 transition-colors duration-150 last:border-0 hover:bg-white/[0.035]"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <Avatar email={s.email} />
                          <span className="font-medium text-zinc-100">
                            {s.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge tone="neutral">
                          {s.source ?? "landing_footer"}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-zinc-400">
                        {formatDate(s.created_at)}
                      </td>
                      <td className="px-6 py-5 text-right text-xs tabular-nums text-zinc-500">
                        {timeAgo(s.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-white/5 md:hidden">
              {visible.map((s) => (
                <li key={s.id} className="px-5 py-5">
                  <div className="flex items-start gap-3">
                    <Avatar email={s.email} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-100">
                        {s.email}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge tone="neutral">
                          {s.source ?? "landing_footer"}
                        </Badge>
                        <span className="text-xs text-zinc-600">
                          {timeAgo(s.created_at)}
                        </span>
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

function Avatar({ email }: { email: string }) {
  const initial = email.charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-200 ring-1 ring-inset ring-emerald-500/30">
      {initial}
    </div>
  );
}

function NewsletterSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-white/5 p-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-56 rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg sm:w-64" />
        </div>
        <div className="divide-y divide-white/5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 w-64" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
