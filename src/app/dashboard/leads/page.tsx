"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card, Skeleton } from "@/components/ui";
import { timeAgo, cn } from "@/lib/utils";
import { useLeads, type LeadRow } from "@/lib/dashboard-data";

type Filter = "all" | "Hot" | "Warm" | "Cold";
type LeadScore = "Hot" | "Warm" | "Cold";

function toScoreLabel(score: LeadRow["score"]): LeadScore | null {
  if (!score) return null;
  return (score.charAt(0).toUpperCase() + score.slice(1)) as LeadScore;
}

function toScoreValue(score: LeadScore): "hot" | "warm" | "cold" {
  return score.toLowerCase() as "hot" | "warm" | "cold";
}

export default function LeadsPage() {
  const { user } = useAuth();
  const { data: leads, loading, updateScore } = useLeads();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      all: leads.length,
      Hot: leads.filter((l) => l.score === "hot").length,
      Warm: leads.filter((l) => l.score === "warm").length,
      Cold: leads.filter((l) => l.score === "cold").length,
    }),
    [leads]
  );

  const visible = useMemo(() => {
    const byFilter = leads.filter((l) => {
      if (filter === "all") return true;
      return toScoreLabel(l.score) === filter;
    });
    const q = search.trim().toLowerCase();
    return q
      ? byFilter.filter(
          (l) =>
            (l.name?.toLowerCase().includes(q) ?? false) ||
            (l.phone?.toLowerCase().includes(q) ?? false) ||
            (l.email?.toLowerCase().includes(q) ?? false) ||
            (l.company?.toLowerCase().includes(q) ?? false) ||
            (l.notes?.toLowerCase().includes(q) ?? false)
        )
      : byFilter;
  }, [leads, filter, search]);

  const active = activeId ? leads.find((l) => l.id === activeId) : null;

  if (!user || loading) return <LeadsSkeleton />;
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

  function exportCSV() {
    const header = [
      "name",
      "phone",
      "email",
      "company",
      "score",
      "notes",
      "last_call_at",
      "source",
    ].join(",");
    const rows = visible.map((l) =>
      [
        l.name ?? "",
        l.phone ?? "",
        l.email ?? "",
        l.company ?? "",
        toScoreLabel(l.score) ?? "",
        JSON.stringify(l.notes ?? ""),
        l.last_call_at ?? "",
        l.source ?? "",
      ].join(",")
    );
    const blob = new Blob([`${header}\n${rows.join("\n")}`], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `operavo-leads-${Date.now()}.csv`;
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
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Qualified leads
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Every caller Operavo scored — with a two-sentence summary and
            recommended next step.
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
        <StatCard label="Total leads" value={counts.all} />
        <StatCard label="Hot" value={counts.Hot} tone="rose" />
        <StatCard label="Warm" value={counts.Warm} tone="amber" />
        <StatCard label="Cold" value={counts.Cold} tone="neutral" />
      </div>

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
              placeholder="Search name, phone, or company"
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
                <path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
              </svg>
            </div>
            <p className="text-sm text-zinc-400">
              {leads.length === 0
                ? "No leads yet. Qualified callers will appear here after Operavo handles them."
                : "No leads match that filter."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {visible.map((l) => {
              const score = toScoreLabel(l.score);
              const name = l.name?.trim();
              const phone = l.phone?.trim();
              const company = l.company?.trim();
              const initials = (name ?? "?")
                .split(" ")
                .map((n) => n[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase() || "?";
              return (
                <li
                  key={l.id}
                  onClick={() => setActiveId(l.id)}
                  className="group cursor-pointer px-5 py-5 transition-colors duration-150 hover:bg-white/[0.035] sm:px-6"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-1 ring-inset",
                        name
                          ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20"
                          : "bg-white/5 text-zinc-500 ring-white/10"
                      )}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p className="truncate text-[14px] font-medium text-white">
                          {name || (
                            <span className="italic text-zinc-500">
                              Unknown caller
                            </span>
                          )}
                        </p>
                        {company && (
                          <span className="truncate text-xs text-zinc-500">
                            · {company}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate font-mono text-xs text-zinc-500">
                        {phone || "no number"}
                        {l.email && (
                          <>
                            <span className="mx-1.5 text-zinc-600">·</span>
                            <span className="font-sans">{l.email}</span>
                          </>
                        )}
                      </p>
                      {l.notes && (
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                          {l.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      {score && <ScoreBadge score={score} />}
                      <span
                        className="text-[11px] tabular-nums text-zinc-500"
                        title={l.last_call_at ?? undefined}
                      >
                        {l.last_call_at ? timeAgo(l.last_call_at) : "—"}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {active && (
        <LeadDetailDrawer
          lead={active}
          onClose={() => setActiveId(null)}
          onScore={(score) => updateScore(active.id, toScoreValue(score))}
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
    <Card className="group p-6 transition-colors duration-200 hover:border-white/15 hover:bg-white/[0.04]">
      <div className="flex items-center gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          {label}
        </p>
        {tone && (
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              tone === "rose" && "bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.7)]",
              tone === "amber" && "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]",
              tone === "neutral" && "bg-zinc-400",
              tone === "emerald" && "bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.7)]"
            )}
          />
        )}
      </div>
      <p className="mt-3 text-[32px] font-semibold leading-none tracking-tight text-white tabular-nums">
        {value}
      </p>
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
  lead: LeadRow;
  onClose: () => void;
  onScore: (score: LeadScore) => void;
}) {
  const score = toScoreLabel(lead.score);
  const name = lead.name ?? "Unknown";
  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col border-l border-white/10 bg-[#070808]/95 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3 border-b border-white/5 p-6">
          <div className="flex min-w-0 items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-1 ring-inset",
                lead.name
                  ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20"
                  : "bg-white/5 text-zinc-500 ring-white/10"
              )}
            >
              {(name || "?")
                .split(" ")
                .map((n) => n[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Qualified lead
              </p>
              <p className="mt-1 truncate text-lg font-semibold text-white">
                {lead.name || (
                  <span className="italic text-zinc-400">Unknown caller</span>
                )}
              </p>
              <p className="mt-0.5 truncate font-mono text-xs text-zinc-500">
                {lead.phone || "no number"}
                {lead.company && (
                  <>
                    <span className="mx-1.5 text-zinc-600">·</span>
                    <span className="font-sans">{lead.company}</span>
                  </>
                )}
              </p>
            </div>
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

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-3">
            {score && <DrawerStat label="Score" value={score} />}
            {lead.source && <DrawerStat label="Source" value={lead.source} />}
            {lead.email && <DrawerStat label="Email" value={lead.email} />}
            {lead.company && <DrawerStat label="Company" value={lead.company} />}
            {lead.last_call_at && (
              <DrawerStat label="Last call" value={timeAgo(lead.last_call_at)} />
            )}
          </div>

          {lead.notes && (
            <div className="rounded-xl border border-white/10 bg-white/2 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Summary
              </p>
              <p className="mt-2 text-sm leading-[1.65] text-zinc-300">
                {lead.notes}
              </p>
            </div>
          )}

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Update score
            </p>
            <div className="mt-3 flex gap-2">
              {(["Hot", "Warm", "Cold"] as LeadScore[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onScore(s)}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    score === s
                      ? s === "Hot"
                        ? "bg-rose-500/15 text-rose-200 ring-1 ring-inset ring-rose-500/40"
                        : s === "Warm"
                          ? "bg-amber-500/15 text-amber-200 ring-1 ring-inset ring-amber-500/40"
                          : "bg-white/10 text-zinc-200 ring-1 ring-inset ring-white/20"
                      : "border border-white/10 bg-white/2 text-zinc-400 hover:border-white/20 hover:bg-white/[0.04] hover:text-zinc-200"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-white/5 p-4">
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-emerald-500/15 px-4 text-[14px] font-medium text-emerald-200 ring-1 ring-inset ring-emerald-500/30 transition-colors hover:bg-emerald-500/25 hover:text-emerald-100"
            >
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
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call back
            </a>
          )}
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
            >
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

function LeadsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-12" />
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-white/5 p-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-64 rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg sm:w-72" />
        </div>
        <div className="divide-y divide-white/5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="hidden h-4 flex-1 md:block" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
