"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card } from "@/components/ui";
import { timeAgo, cn } from "@/lib/utils";
import { seedLeads, type Lead, type LeadScore } from "@/lib/mock-data";

type Filter = "all" | "Hot" | "Warm" | "Cold";

export default function LeadsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>(seedLeads);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      all: leads.length,
      Hot: leads.filter((l) => l.score === "Hot").length,
      Warm: leads.filter((l) => l.score === "Warm").length,
      Cold: leads.filter((l) => l.score === "Cold").length,
    }),
    [leads]
  );

  const visible = useMemo(() => {
    const byFilter = leads.filter((l) => filter === "all" || l.score === filter);
    const q = search.trim().toLowerCase();
    return q
      ? byFilter.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.phone.toLowerCase().includes(q) ||
            (l.email?.toLowerCase().includes(q) ?? false) ||
            (l.company?.toLowerCase().includes(q) ?? false) ||
            l.note.toLowerCase().includes(q)
        )
      : byFilter;
  }, [leads, filter, search]);

  const active = activeId ? leads.find((l) => l.id === activeId) : null;

  if (!user) return null;
  if (user.role !== "client") {
    return (
      <Card className="p-10 text-center">
        <h1 className="text-lg font-semibold">Clients only</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Switch to a client workspace to view leads.
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

  function updateScore(id: string, score: LeadScore) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, score } : l)));
  }

  function exportCSV() {
    const header = ["name", "phone", "email", "company", "score", "note", "last_call_at", "source"].join(",");
    const rows = visible.map((l) =>
      [
        l.name,
        l.phone,
        l.email ?? "",
        l.company ?? "",
        l.score,
        JSON.stringify(l.note),
        l.lastCallAt,
        l.source,
      ].join(",")
    );
    const blob = new Blob([`${header}\n${rows.join("\n")}`], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avena-leads-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "Hot", label: "Hot", count: counts.Hot },
    { key: "Warm", label: "Warm", count: counts.Warm },
    { key: "Cold", label: "Cold", count: counts.Cold },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Qualified leads</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Every caller Avena scored — with a two-sentence summary and recommended next step.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total leads" value={counts.all} />
        <StatCard label="Hot" value={counts.Hot} tone="rose" />
        <StatCard label="Warm" value={counts.Warm} tone="amber" />
        <StatCard label="Cold" value={counts.Cold} tone="neutral" />
      </div>

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
                    ? "bg-white text-zinc-900"
                    : "text-zinc-400 hover:text-zinc-100"
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "ml-2 rounded-full px-1.5 py-0.5 text-xs",
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
              placeholder="Search name, phone, or company"
              className="h-10 w-full rounded-lg border border-white/10 bg-black/40 pl-9 pr-3 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:border-emerald-500/50 focus-visible:ring-2 focus-visible:ring-emerald-500/15"
            />
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-zinc-500">
            No leads match that filter.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {visible.map((l) => (
              <li key={l.id} className="group flex items-center gap-3 px-4 py-4 transition-colors hover:bg-white/3 sm:px-5">
                <button
                  type="button"
                  onClick={() => setActiveId(l.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
                    {l.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{l.name}</p>
                    <p className="truncate font-mono text-[11px] text-zinc-500">{l.phone}</p>
                  </div>
                </button>

                <div className="hidden flex-1 px-4 text-xs text-zinc-400 md:block">
                  {l.note}
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                  <ScoreBadge score={l.score} />
                  <span className="hidden w-16 text-right text-xs text-zinc-500 sm:inline">
                    {timeAgo(l.lastCallAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {active && (
        <LeadDetailDrawer
          lead={active}
          onClose={() => setActiveId(null)}
          onScore={(score) => updateScore(active.id, score)}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "emerald" | "amber" | "rose" | "neutral";
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <p className="text-sm text-zinc-500">{label}</p>
        {tone && (
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              tone === "rose" && "bg-rose-400",
              tone === "amber" && "bg-amber-400",
              tone === "neutral" && "bg-zinc-400",
              tone === "emerald" && "bg-emerald-400"
            )}
          />
        )}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
    </Card>
  );
}

function ScoreBadge({ score }: { score: LeadScore }) {
  const map: Record<LeadScore, "rose" | "amber" | "neutral"> = {
    Hot: "rose",
    Warm: "amber",
    Cold: "neutral",
  };
  return <Badge tone={map[score]}>{score}</Badge>;
}

function LeadDetailDrawer({
  lead,
  onClose,
  onScore,
}: {
  lead: Lead;
  onClose: () => void;
  onScore: (score: LeadScore) => void;
}) {
  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#070808]/95 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3 border-b border-white/5 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
              {lead.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <p className="text-base font-medium text-white">{lead.name}</p>
              <p className="mt-0.5 font-mono text-[11px] text-zinc-500">{lead.phone}</p>
            </div>
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

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-3">
            <DrawerStat label="Score" value={lead.score} />
            <DrawerStat label="Source" value={lead.source} />
            {lead.email && <DrawerStat label="Email" value={lead.email} />}
            {lead.company && <DrawerStat label="Company" value={lead.company} />}
            <DrawerStat label="Last call" value={timeAgo(lead.lastCallAt)} />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Summary
            </p>
            <p className="mt-2 text-sm leading-[1.65] text-zinc-300">{lead.note}</p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Update score
            </p>
            <div className="mt-2 flex gap-2">
              {(["Hot", "Warm", "Cold"] as LeadScore[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onScore(s)}
                  className={cn(
                    "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    lead.score === s
                      ? s === "Hot"
                        ? "bg-rose-500/15 text-rose-200 ring-1 ring-inset ring-rose-500/40"
                        : s === "Warm"
                          ? "bg-amber-500/15 text-amber-200 ring-1 ring-inset ring-amber-500/40"
                          : "bg-white/10 text-zinc-200 ring-1 ring-inset ring-white/20"
                      : "border border-white/10 bg-white/2 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-white/5 p-4">
          <a
            href={`tel:${lead.phone}`}
            className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-emerald-500/15 px-4 text-[14px] font-medium text-emerald-200 ring-1 ring-inset ring-emerald-500/30 transition-colors hover:bg-emerald-500/25 hover:text-emerald-100"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call back
          </a>
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Email
            </a>
          )}
        </div>
      </aside>
    </div>
  );
}

function DrawerStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/2 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium text-white">{value}</p>
    </div>
  );
}
