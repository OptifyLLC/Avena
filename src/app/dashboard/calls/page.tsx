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

function formatAbsolute(value: string): string {
  return new Date(value).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

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

  const counts = useMemo(() => {
    return {
      all: calls.length,
      booked: calls.filter((c) => c.outcome === "booked").length,
      transferred: calls.filter((c) => c.outcome === "transferred").length,
      qa: calls.filter((c) => c.outcome === "no_booking").length,
      voicemail: calls.filter(
        (c) => !c.outcome && (c.duration_seconds ?? 0) < 30
      ).length,
    };
  }, [calls]);

  const stats = useMemo(() => {
    const total = calls.length;
    const totalDuration = calls.reduce(
      (sum, c) => sum + (c.duration_seconds ?? 0),
      0
    );
    const avgSeconds = total > 0 ? Math.round(totalDuration / total) : 0;
    const bookingRate = total > 0 ? Math.round((counts.booked / total) * 100) : 0;
    return [
      { label: "Total calls", value: total.toString() },
      { label: "Booked", value: counts.booked.toString(), sub: `${bookingRate}% rate` },
      { label: "Transferred", value: counts.transferred.toString() },
      { label: "Avg duration", value: formatDuration(avgSeconds) },
    ];
  }, [calls, counts]);

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
    a.download = `operavo-calls-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Call log
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Every inbound call Operavo handled, with intent, summary, and full
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
          <Card
            key={s.label}
            className="group p-6 transition-colors duration-200 hover:border-white/15 hover:bg-white/[0.04]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              {s.label}
            </p>
            <p className="mt-3 text-[32px] font-semibold leading-none tracking-tight text-white">
              {s.value}
            </p>
            <p className="mt-3 text-xs text-zinc-500">{s.sub ?? "\u00a0"}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1 rounded-xl bg-black/30 p-1 ring-1 ring-inset ring-white/5">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",
                  filter === t
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                )}
              >
                {filterLabels[t]}
                <span
                  className={cn(
                    "ml-2 inline-flex min-w-[18px] justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                    filter === t
                      ? "bg-zinc-900 text-white"
                      : "bg-white/10 text-zinc-400"
                  )}
                >
                  {counts[t]}
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
              placeholder="Search caller, name, or summary"
              className="h-10 w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 transition-colors focus-visible:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/15"
            />
          </div>
        </div>

        {visible.length === 0 ? (
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
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <p className="text-sm text-zinc-400">
              {calls.length === 0
                ? "No calls yet. As Operavo takes calls they'll show up here."
                : "No calls match that filter."}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-[40%]" />
                  <col className="w-[80px]" />
                  <col className="w-[200px]" />
                  <col className="w-[80px]" />
                  <col className="w-[100px]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-white/5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    <th className="whitespace-nowrap px-6 py-3.5">Caller</th>
                    <th className="whitespace-nowrap px-6 py-3.5">Duration</th>
                    <th className="whitespace-nowrap px-6 py-3.5">Intent</th>
                    <th className="whitespace-nowrap px-6 py-3.5">Score</th>
                    <th className="whitespace-nowrap px-6 py-3.5 text-right">When</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((c) => {
                    const name = c.caller_name?.trim();
                    const phone = c.caller_phone?.trim();
                    const summary = c.summary?.trim();
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setActiveId(c.id)}
                        className="group cursor-pointer border-b border-white/5 align-top transition-colors duration-150 last:border-0 hover:bg-white/[0.035]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-start gap-3">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                            <div className="min-w-0">
                              <p className="truncate text-[13.5px] font-medium leading-tight text-zinc-100">
                                {name || (
                                  <span className="italic text-zinc-500">
                                    Unknown caller
                                  </span>
                                )}
                              </p>
                              <p className="mt-1 truncate font-mono text-xs text-zinc-500">
                                {phone || "no number"}
                              </p>
                              {summary && (
                                <p className="mt-2 line-clamp-1 text-xs leading-relaxed text-zinc-500">
                                  {summary}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5 font-mono text-xs tabular-nums text-zinc-400">
                          {formatDuration(c.duration_seconds)}
                        </td>
                        <td className="px-6 py-5">
                          <Badge
                            tone={intentTone(c)}
                            className="whitespace-nowrap"
                          >
                            {formatIntent(c)}
                          </Badge>
                        </td>
                        <td className="px-6 py-5">
                          {scoreLabel(c.lead_score) ? (
                            <ScoreBadge score={scoreLabel(c.lead_score)!} />
                          ) : (
                            <span className="text-xs text-zinc-600">—</span>
                          )}
                        </td>
                        <td
                          className="whitespace-nowrap px-6 py-5 text-right text-xs tabular-nums text-zinc-500 transition-colors group-hover:text-zinc-400"
                          title={c.started_at ? formatAbsolute(c.started_at) : undefined}
                        >
                          {c.started_at ? timeAgo(c.started_at) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-white/5 md:hidden">
              {visible.map((c) => {
                const name = c.caller_name?.trim();
                const phone = c.caller_phone?.trim();
                const summary = c.summary?.trim();
                return (
                  <li
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className="cursor-pointer px-4 py-4 transition-colors hover:bg-white/3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-zinc-100">
                            {name || (
                              <span className="italic text-zinc-500">
                                Unknown caller
                              </span>
                            )}
                          </p>
                          <p className="truncate font-mono text-xs text-zinc-500">
                            {phone || "no number"}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="font-mono text-[11px] text-zinc-400">
                          {formatDuration(c.duration_seconds)}
                        </span>
                        <span
                          className="text-[11px] text-zinc-500"
                          title={c.started_at ? formatAbsolute(c.started_at) : undefined}
                        >
                          {c.started_at ? timeAgo(c.started_at) : "—"}
                        </span>
                      </div>
                    </div>
                    {summary && (
                      <p className="mt-2 line-clamp-2 text-xs text-zinc-500">
                        {summary}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge
                        tone={intentTone(c)}
                        className="whitespace-nowrap"
                      >
                        {formatIntent(c)}
                      </Badge>
                      {scoreLabel(c.lead_score) && (
                        <ScoreBadge score={scoreLabel(c.lead_score)!} />
                      )}
                    </div>
                  </li>
                );
              })}
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
  const name = call.caller_name?.trim();
  const phone = call.caller_phone?.trim();
  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col border-l border-white/10 bg-[#070808]/95 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3 border-b border-white/5 p-6">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Inbound call
            </p>
            <p className="mt-1 truncate text-lg font-semibold text-white">
              {name || (
                <span className="italic text-zinc-400">Unknown caller</span>
              )}
            </p>
            <p className="mt-0.5 truncate font-mono text-xs text-zinc-500">
              {phone || "no number"}
              {call.started_at && (
                <>
                  <span className="mx-1.5 text-zinc-600">·</span>
                  <span>{formatAbsolute(call.started_at)}</span>
                </>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
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

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-white/2 p-4">
            <DrawerStat
              label="Duration"
              value={formatDuration(call.duration_seconds)}
            />
            <DrawerStat label="Score" value={score ?? "—"} />
            <DrawerStat
              label="Outcome"
              value={formatIntent(call)}
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
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-300">
                Next action
              </p>
              <p className="mt-2 text-sm leading-[1.65] text-emerald-50">
                {call.next_action}
              </p>
            </div>
          )}

          {call.transcript && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Transcript
              </p>
              <div className="mt-3">
                <Transcript text={call.transcript} />
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

type TranscriptTurn = { speaker: "ai" | "user"; content: string };

function parseTranscript(text: string): TranscriptTurn[] {
  const turns: TranscriptTurn[] = [];
  let current: TranscriptTurn | null = null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const aiMatch = line.match(/^(?:AI|Assistant|Bot|Agent|Operavo|Avena|Avina)[:\u2014\u2013-]\s*(.*)$/i);
    const userMatch = line.match(/^(?:User|Caller|Customer|You|Client)[:\u2014\u2013-]\s*(.*)$/i);
    if (aiMatch) {
      if (current) turns.push(current);
      current = { speaker: "ai", content: aiMatch[1] };
    } else if (userMatch) {
      if (current) turns.push(current);
      current = { speaker: "user", content: userMatch[1] };
    } else if (current) {
      current.content += " " + line;
    }
  }
  if (current) turns.push(current);
  return turns;
}

function Transcript({ text }: { text: string }) {
  const turns = useMemo(() => parseTranscript(text), [text]);

  if (turns.length === 0) {
    return (
      <pre className="whitespace-pre-wrap rounded-lg border border-white/10 bg-white/2 p-3 text-[13px] leading-[1.6] text-zinc-300">
        {text}
      </pre>
    );
  }

  return (
    <div className="space-y-2">
      {turns.map((turn, i) => (
        <div
          key={i}
          className={cn(
            "flex",
            turn.speaker === "ai" ? "justify-start" : "justify-end"
          )}
        >
          <div
            className={cn(
              "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.55]",
              turn.speaker === "ai"
                ? "border border-emerald-500/20 bg-emerald-500/8 text-emerald-50"
                : "border border-white/10 bg-white/5 text-zinc-100"
            )}
          >
            <p
              className={cn(
                "text-[9px] font-semibold uppercase tracking-[0.15em]",
                turn.speaker === "ai"
                  ? "text-emerald-400/70"
                  : "text-zinc-500"
              )}
            >
              {turn.speaker === "ai" ? "AI" : "Caller"}
            </p>
            <p className="mt-1">{turn.content.trim()}</p>
          </div>
        </div>
      ))}
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
