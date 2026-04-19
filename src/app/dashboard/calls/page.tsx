"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card, Skeleton } from "@/components/ui";
import { timeAgo, cn } from "@/lib/utils";
import {
  useCalls,
  formatDuration,
  formatIntent,
  intentTone,
  scoreLabel,
  type CallRow,
} from "@/lib/dashboard-data";

type Filter = "all" | "booked" | "transferred" | "qa" | "voicemail";

const filterLabels: Record<Filter, string> = {
  all: "All",
  booked: "Booked",
  transferred: "Transferred",
  qa: "Q&A",
  voicemail: "Voicemail",
};

function matchesFilter(call: CallRow, filter: Filter): boolean {
  if (filter === "all") return true;
  if (filter === "booked") return call.outcome === "booked";
  if (filter === "transferred") return call.outcome === "transferred";
  if (filter === "qa") return call.outcome === "no_booking";
  if (filter === "voicemail")
    return !call.outcome && (call.duration_seconds ?? 0) < 30;
  return true;
}

export default function CallsPage() {
  const { user } = useAuth();
  const { data: calls, loading } = useCalls();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const byFilter = calls.filter((c) => matchesFilter(c, filter));
    const q = search.trim().toLowerCase();
    if (!q) return byFilter;
    return byFilter.filter(
      (c) =>
        (c.caller_name?.toLowerCase().includes(q) ?? false) ||
        (c.caller_phone?.toLowerCase().includes(q) ?? false) ||
        (c.intent?.toLowerCase().includes(q) ?? false) ||
        (c.summary?.toLowerCase().includes(q) ?? false)
    );
  }, [calls, filter, search]);

  const stats = useMemo(() => {
    const booked = calls.filter((c) => c.outcome === "booked").length;
    const transferred = calls.filter(
      (c) => c.outcome === "transferred"
    ).length;
    const hot = calls.filter((c) => c.lead_score === "hot").length;
    return [
      { label: "Total calls", value: calls.length, tone: "emerald" as const },
      { label: "Booked", value: booked, tone: "emerald" as const },
      { label: "Transferred", value: transferred, tone: "amber" as const },
      { label: "Hot leads", value: hot, tone: "emerald" as const },
    ];
  }, [calls]);

  const active = activeId ? calls.find((c) => c.id === activeId) : null;

  if (!user || loading) return <CallsSkeleton />;
  if (user.role !== "client") {
    return (
      <Card className="p-10 text-center">
        <h1 className="text-lg font-semibold">Clients only</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Switch to a client workspace to view the call log.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-[13px] font-medium text-white transition-colors hover:bg-white/10"
        >
          Back to admin overview
        </Link>
      </Card>
    );
  }

  const tabs: Filter[] = ["all", "booked", "transferred", "qa", "voicemail"];

  function exportCSV() {
    const header = [
      "caller",
      "name",
      "duration",
      "intent",
      "score",
      "started_at",
      "summary",
    ].join(",");
    const rows = visible.map((c) =>
      [
        c.caller_phone ?? "",
        c.caller_name ?? "",
        formatDuration(c.duration_seconds),
        formatIntent(c),
        scoreLabel(c.lead_score) ?? "",
        c.started_at ?? "",
        JSON.stringify(c.summary ?? ""),
      ].join(",")
    );
    const blob = new Blob([`${header}\n${rows.join("\n")}`], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avena-calls-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Call log</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Every inbound call Avena handled, with intent, summary, and full
            transcript.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-sm text-zinc-500">{s.label}</p>
            <div className="mt-2 flex items-end gap-2">
              <p className="text-3xl font-semibold tracking-tight">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-white/5 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1 rounded-lg bg-white/5 p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  filter === t
                    ? "bg-white text-zinc-900"
                    : "text-zinc-400 hover:text-zinc-100"
                )}
              >
                {filterLabels[t]}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
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
              placeholder="Search caller, name, or summary"
              className="h-10 w-full rounded-lg border border-white/10 bg-black/40 pl-9 pr-3 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:border-emerald-500/50 focus-visible:ring-2 focus-visible:ring-emerald-500/15"
            />
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-zinc-500">
            {calls.length === 0
              ? "No calls yet. As Avena takes calls they'll show up here."
              : "No calls match that filter."}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-zinc-500">
                    <th className="px-5 py-3 font-medium">Caller</th>
                    <th className="px-5 py-3 font-medium">Duration</th>
                    <th className="px-5 py-3 font-medium">Intent</th>
                    <th className="px-5 py-3 font-medium">Score</th>
                    <th className="px-5 py-3 text-right font-medium">When</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setActiveId(c.id)}
                      className="cursor-pointer border-b border-white/5 transition-colors last:border-0 hover:bg-white/3"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                          <div className="min-w-0">
                            <p className="font-mono text-[13px] text-zinc-200">
                              {c.caller_phone || "—"}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {c.caller_name || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-zinc-400">
                        {formatDuration(c.duration_seconds)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge tone={intentTone(c)}>{formatIntent(c)}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        {scoreLabel(c.lead_score) ? (
                          <ScoreBadge score={scoreLabel(c.lead_score)!} />
                        ) : (
                          <span className="text-xs text-zinc-600">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs text-zinc-500">
                        {c.started_at ? timeAgo(c.started_at) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-white/5 md:hidden">
              {visible.map((c) => (
                <li
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className="cursor-pointer px-4 py-4 transition-colors hover:bg-white/3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                      <div className="min-w-0">
                        <p className="truncate font-mono text-[13px] text-zinc-200">
                          {c.caller_phone || "—"}
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                          {c.caller_name || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="font-mono text-[11px] text-zinc-400">
                        {formatDuration(c.duration_seconds)}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {c.started_at ? timeAgo(c.started_at) : "—"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge tone={intentTone(c)}>{formatIntent(c)}</Badge>
                    {scoreLabel(c.lead_score) && (
                      <ScoreBadge score={scoreLabel(c.lead_score)!} />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      {active && (
        <CallDetailDrawer call={active} onClose={() => setActiveId(null)} />
      )}
    </div>
  );
}

function ScoreBadge({ score }: { score: "Hot" | "Warm" | "Cold" }) {
  const map = {
    Hot: "rose",
    Warm: "amber",
    Cold: "neutral",
  } as const;
  return <Badge tone={map[score]}>{score}</Badge>;
}

function CallDetailDrawer({
  call,
  onClose,
}: {
  call: CallRow;
  onClose: () => void;
}) {
  const score = scoreLabel(call.lead_score);
  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#070808]/95 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3 border-b border-white/5 p-5">
          <div>
            <p className="font-mono text-[13px] text-zinc-300">
              {call.caller_phone || "—"}
            </p>
            <p className="mt-0.5 text-sm font-medium text-white">
              {call.caller_name || "Unknown caller"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-white/2 p-4">
            <DrawerStat
              label="Duration"
              value={formatDuration(call.duration_seconds)}
            />
            <DrawerStat label="Score" value={score ?? "—"} />
            <DrawerStat
              label="When"
              value={call.started_at ? timeAgo(call.started_at) : "—"}
            />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Intent
            </p>
            <div className="mt-2">
              <Badge tone={intentTone(call)}>{formatIntent(call)}</Badge>
            </div>
          </div>

          {call.summary && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                AI summary
              </p>
              <p className="mt-2 text-sm leading-[1.65] text-zinc-300">
                {call.summary}
              </p>
            </div>
          )}

          {call.next_action && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Next action
              </p>
              <p className="mt-2 text-sm leading-[1.65] text-zinc-300">
                {call.next_action}
              </p>
            </div>
          )}

          {call.transcript && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Transcript
              </p>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-white/10 bg-white/2 p-3 text-[13px] leading-[1.6] text-zinc-300">
                {call.transcript}
              </pre>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function DrawerStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function CallsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-3 h-8 w-12" />
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-white/5 p-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-64 rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg sm:w-72" />
        </div>
        <div className="hidden md:block">
          <div className="border-b border-white/5 px-5 py-3">
            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-3 w-16" />
              ))}
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-5 gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-1.5 w-1.5 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-12 self-center" />
                <Skeleton className="h-5 w-32 rounded-full self-center" />
                <Skeleton className="h-5 w-16 rounded-full self-center" />
                <Skeleton className="h-3 w-20 self-center justify-self-end" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
