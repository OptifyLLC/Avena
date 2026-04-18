"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card } from "@/components/ui";
import { timeAgo, cn } from "@/lib/utils";
import { seedCalls, type CallRecord, type CallTone } from "@/lib/mock-data";

type Filter = "all" | "booked" | "transferred" | "qa" | "voicemail";

const filterLabels: Record<Filter, string> = {
  all: "All",
  booked: "Booked",
  transferred: "Transferred",
  qa: "Q&A",
  voicemail: "Voicemail",
};

function matchesFilter(call: CallRecord, filter: Filter): boolean {
  if (filter === "all") return true;
  if (filter === "booked") return call.intent === "Appointment booked";
  if (filter === "transferred") return call.intent === "Transferred to human";
  if (filter === "qa") return call.intent === "Q&A · business hours";
  if (filter === "voicemail") return call.intent === "Voicemail · no intent";
  return true;
}

export default function CallsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const byFilter = seedCalls.filter((c) => matchesFilter(c, filter));
    const q = search.trim().toLowerCase();
    if (!q) return byFilter;
    return byFilter.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.caller.toLowerCase().includes(q) ||
        c.intent.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q)
    );
  }, [filter, search]);

  const stats = useMemo(() => {
    const booked = seedCalls.filter((c) => c.intent === "Appointment booked").length;
    const transferred = seedCalls.filter((c) => c.intent === "Transferred to human").length;
    const hot = seedCalls.filter((c) => c.score === "Hot").length;
    return [
      { label: "Total calls", value: seedCalls.length, tone: "emerald" as const },
      { label: "Booked", value: booked, tone: "emerald" as const },
      { label: "Transferred", value: transferred, tone: "amber" as const },
      { label: "Hot leads", value: hot, tone: "emerald" as const },
    ];
  }, []);

  const active = activeId ? seedCalls.find((c) => c.id === activeId) : null;

  if (!user) return null;
  if (user.role !== "client") {
    return (
      <Card className="p-10 text-center">
        <h1 className="text-lg font-semibold">Clients only</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Switch to a client workspace to view the call log.
        </p>
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
      [c.caller, c.name, c.duration, c.intent, c.score ?? "", c.startedAt, JSON.stringify(c.summary)].join(",")
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
            Every inbound call Avena handled, with intent, summary, and full transcript.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
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
            No calls match that filter yet.
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
                            <p className="font-mono text-[13px] text-zinc-200">{c.caller}</p>
                            <p className="text-xs text-zinc-500">{c.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-zinc-400">{c.duration}</td>
                      <td className="px-5 py-3.5">
                        <ToneBadge tone={c.tone}>{c.intent}</ToneBadge>
                      </td>
                      <td className="px-5 py-3.5">
                        {c.score ? <ScoreBadge score={c.score} /> : <span className="text-xs text-zinc-600">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs text-zinc-500">
                        {timeAgo(c.startedAt)}
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
                        <p className="truncate font-mono text-[13px] text-zinc-200">{c.caller}</p>
                        <p className="truncate text-xs text-zinc-500">{c.name}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="font-mono text-[11px] text-zinc-400">{c.duration}</span>
                      <span className="text-[11px] text-zinc-500">{timeAgo(c.startedAt)}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <ToneBadge tone={c.tone}>{c.intent}</ToneBadge>
                    {c.score && <ScoreBadge score={c.score} />}
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

function ToneBadge({
  tone,
  children,
}: {
  tone: CallTone;
  children: React.ReactNode;
}) {
  const map: Record<CallTone, "emerald" | "amber" | "neutral" | "rose"> = {
    emerald: "emerald",
    amber: "amber",
    zinc: "neutral",
    rose: "rose",
  };
  return <Badge tone={map[tone]}>{children}</Badge>;
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
  call: CallRecord;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#070808]/95 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3 border-b border-white/5 p-5">
          <div>
            <p className="font-mono text-[13px] text-zinc-300">{call.caller}</p>
            <p className="mt-0.5 text-sm font-medium text-white">{call.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-white/2 p-4">
            <DrawerStat label="Duration" value={call.duration} />
            <DrawerStat label="Score" value={call.score ?? "—"} />
            <DrawerStat label="When" value={timeAgo(call.startedAt)} />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Intent
            </p>
            <div className="mt-2">
              <ToneBadge tone={call.tone}>{call.intent}</ToneBadge>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              AI summary
            </p>
            <p className="mt-2 text-sm leading-[1.65] text-zinc-300">
              {call.summary}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Transcript
            </p>
            <div className="mt-3 space-y-2">
              {sampleTranscript(call).map((t, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-[13px] leading-[1.5]",
                    t.speaker === "Avena"
                      ? "border-emerald-500/25 bg-emerald-500/6 text-emerald-50"
                      : "border-white/10 bg-white/2 text-zinc-300"
                  )}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    {t.speaker}
                  </p>
                  <p className="mt-1">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 p-4">
          <Button variant="outline" size="sm" className="w-full">
            Download recording
          </Button>
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

function sampleTranscript(call: CallRecord) {
  return [
    { speaker: "Avena", text: "Hi, this is Avena — how can I help?" },
    {
      speaker: "Caller",
      text:
        call.intent === "Appointment booked"
          ? "Hi, I'd like to book a showing for later this week."
          : call.intent === "Transferred to human"
            ? "Can I speak to an agent about our offer?"
            : "Wanted to ask about your hours and process.",
    },
    {
      speaker: "Avena",
      text:
        call.intent === "Appointment booked"
          ? "Got it. I can see Friday at 3:00 PM is open — does that work?"
          : call.intent === "Transferred to human"
            ? "Absolutely, let me connect you with the team right away."
            : "Happy to help — we're open 9 to 6 on weekdays, and Avena is on 24/7.",
    },
  ];
}
