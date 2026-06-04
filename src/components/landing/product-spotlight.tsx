"use client";

import { useEffect, useRef, useState } from "react";

type TabKey =
  | "overview"
  | "calls"
  | "appointments"
  | "leads"
  | "settings";

const tabs: Array<{ key: TabKey; label: string; icon: React.ReactNode }> = [
  { key: "overview", label: "Overview", icon: <IconHome /> },
  { key: "calls", label: "Call log", icon: <IconPhone /> },
  { key: "appointments", label: "Appointments", icon: <IconCalendar /> },
  { key: "leads", label: "Leads", icon: <IconSpark /> },
  { key: "settings", label: "Settings", icon: <IconGear /> },
];

export function ProductSpotlight() {
  return (
    <section
      id="product"
      className="relative mx-auto w-full max-w-6xl px-6 py-28 md:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[10%] -z-10 h-[500px] bg-[radial-gradient(ellipse_50%_50%_at_30%_40%,rgba(16,185,129,0.06),transparent_80%)] mix-blend-screen"
      />
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-medium leading-[1.15] -tracking-[0.02em] text-white sm:text-4xl">
          Every call, booking, and lead.
          <br className="hidden sm:block" />{" "}
          <span className="font-accent italic font-normal text-zinc-400">
            One pane for all of it.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[15px] leading-[1.6] font-light text-zinc-400">
          A live call log, appointments on your Google Calendar, lead scoring,
          and CSV export, every plan, every workspace.
        </p>
      </div>

      <div className="relative mt-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_70%)] blur-2xl"
        />
        <DashboardMock />
      </div>
    </section>
  );
}

function DashboardMock() {
  const [active, setActive] = useState<TabKey>("overview");
  const [autoplay, setAutoplay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-cycle through tabs so visitors realize the sidebar is interactive.
  // Stops permanently after the user clicks a tab; pauses while hovered or
  // when the mock is off-screen.
  useEffect(() => {
    if (!autoplay || hovered || !visible) return;
    const id = setInterval(() => {
      setActive((prev) => {
        const i = tabs.findIndex((t) => t.key === prev);
        return tabs[(i + 1) % tabs.length].key;
      });
    }, 3200);
    return () => clearInterval(id);
  }, [autoplay, hovered, visible]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function handleSelect(key: TabKey) {
    setAutoplay(false);
    setActive(key);
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="overflow-hidden rounded-2xl border border-white/8 bg-zinc-950/90 backdrop-blur-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] transition-all duration-700 hover:border-white/15 hover:shadow-[0_40px_100px_-20px_rgba(16,185,129,0.1)]"
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <span className="font-mono text-xs text-zinc-500">app.operavo.ai</span>
        <span className="w-12" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
        <aside className="hidden border-r border-white/10 p-3 sm:block">
          {tabs.map((tab) => {
            const isActive = tab.key === active;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleSelect(tab.key)}
                className={
                  "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-300 " +
                  (isActive
                    ? "bg-white/5 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100 hover:translate-x-0.5")
                }
              >
                {isActive && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-1 left-0 w-0.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                  />
                )}
                <span
                  className={
                    "flex h-4 w-4 items-center justify-center transition-colors duration-300 " +
                    (isActive
                      ? "text-emerald-400"
                      : "text-zinc-500 group-hover:text-zinc-300")
                  }
                >
                  {tab.icon}
                </span>
                <span className="-tracking-[0.005em]">{tab.label}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                )}
              </button>
            );
          })}
          {autoplay && (
            <p className="mt-3 px-3 text-[10px] uppercase tracking-[0.15em] text-zinc-600">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400/70 align-middle" />
              <span className="ml-1.5 align-middle">Auto preview · click to explore</span>
            </p>
          )}
        </aside>

        <div className="mock-scroll h-[640px] overflow-y-auto p-5 sm:p-6">
          <div className="mb-4 flex gap-1.5 overflow-x-auto rounded-md bg-white/5 p-1 sm:hidden">
            {tabs.map((tab) => {
              const isActive = tab.key === active;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleSelect(tab.key)}
                  className={
                    "shrink-0 rounded-[5px] px-2.5 py-1 text-xs transition-colors " +
                    (isActive
                      ? "bg-white text-black font-medium shadow-sm"
                      : "text-zinc-400")
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div key={active} className="mock-fade">
            {active === "overview" && <OverviewView />}
            {active === "calls" && <CallLogView />}
            {active === "appointments" && <AppointmentsView />}
            {active === "leads" && <LeadsView />}
            {active === "settings" && <SettingsView />}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewView() {
  const stats = [
    {
      label: "Calls · last 7 days",
      value: "28",
      delta: 6,
      sub: "vs 22 prior",
    },
    {
      label: "Appointments · 7 days",
      value: "9",
      delta: null,
      sub: "3 upcoming",
    },
    {
      label: "Hot leads",
      value: "4",
      delta: null,
      sub: "7 warm",
    },
  ];

  const upNext = [
    { time: "2:30 PM", name: "Morgan Reyes", service: "Property showing · 1402 Oak St.", relative: "in 42 min" },
    { time: "4:00 PM", name: "Daniel Okafor", service: "Buyer consultation · 30 min", relative: "in 2h" },
  ];

  const recent = [
    {
      name: "Morgan Reyes",
      phone: "+1 (415) 555-0139",
      duration: "1m 42s",
      time: "4m ago",
      intent: "Showing booked",
      tone: "emerald" as const,
      score: "hot" as const,
    },
    {
      name: "Daniel Okafor",
      phone: "+1 (212) 555-0187",
      duration: "2m 07s",
      time: "38m ago",
      intent: "Pre-qualified buyer",
      tone: "emerald" as const,
      score: "hot" as const,
    },
    {
      name: "Priya Shah",
      phone: "+1 (646) 555-0104",
      duration: "3m 11s",
      time: "1h ago",
      intent: "Transferred to agent",
      tone: "amber" as const,
      score: "warm" as const,
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <p className="text-[15px] font-semibold tracking-tight text-white">
          Welcome back, Jordan
        </p>
        <p className="mt-0.5 text-[11px] text-zinc-500">
          Every call, booking, and lead in one pane.
        </p>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/10 bg-white/2 p-3.5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {s.label}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-2xl font-semibold tracking-tight text-white">
                {s.value}
              </p>
              {s.delta !== null && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
                  <span aria-hidden>▲</span>
                  {s.delta}
                </span>
              )}
            </div>
            <p className="mt-2 text-[10px] text-zinc-500">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="mb-3 overflow-hidden rounded-xl border border-white/10 bg-white/2">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
          <div>
            <p className="text-[13px] font-medium text-white">Up next</p>
            <p className="text-[10px] text-zinc-500">
              Your next {upNext.length} appointments.
            </p>
          </div>
          <span className="text-[11px] text-zinc-500">View all →</span>
        </div>
        <div className="divide-y divide-white/5">
          {upNext.map((a) => (
            <div
              key={a.name}
              className="flex items-center justify-between gap-3 px-4 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-12 shrink-0 flex-col items-center justify-center rounded-md border border-white/10 bg-black/30">
                  <span className="font-mono text-[10px] text-white">{a.time}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-white">
                    {a.name}
                  </p>
                  <p className="truncate text-[11px] text-zinc-500">{a.service}</p>
                </div>
              </div>
              <span className="shrink-0 text-[11px] text-zinc-400">
                {a.relative}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/2 p-3.5">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-300">Activity</p>
            <p className="mt-0.5 text-[10px] text-zinc-500">
              28 calls over the last 7 days
            </p>
          </div>
          <div className="flex gap-1 rounded-md bg-white/5 p-0.5 text-[10px]">
            <span className="rounded bg-white px-2 py-0.5 text-black">7d</span>
            <span className="px-2 py-0.5 text-zinc-400">30d</span>
            <span className="px-2 py-0.5 text-zinc-400">90d</span>
          </div>
        </div>
        <SparkBars />
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-white/2">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
          <div>
            <p className="text-[13px] font-medium text-white">Recent activity</p>
            <p className="text-[10px] text-zinc-500">
              Latest calls Operavo handled on your behalf.
            </p>
          </div>
          <span className="text-[11px] text-zinc-500">View all →</span>
        </div>
        <div className="divide-y divide-white/5">
          {recent.map((row) => (
            <div
              key={row.phone}
              className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-zinc-100">
                    {row.name}
                  </p>
                  <p className="truncate text-[11px] text-zinc-500">
                    <a
                      href={`tel:${row.phone}`}
                      className="font-mono hover:underline hover:text-zinc-300 transition-colors"
                    >
                      {row.phone}
                    </a>
                    <span className="mx-1.5 text-zinc-600">·</span>
                    <span>{row.duration}</span>
                    <span className="mx-1.5 text-zinc-600">·</span>
                    <span>{row.time}</span>
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={
                    "h-1.5 w-1.5 rounded-full " +
                    (row.score === "hot"
                      ? "bg-rose-400"
                      : row.score === "warm"
                        ? "bg-amber-400"
                        : "bg-zinc-500")
                  }
                  title={row.score === "hot" ? "Hot lead" : "Warm lead"}
                />
                <ToneBadge tone={row.tone}>{row.intent}</ToneBadge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CallLogView() {
  const calls = [
    {
      caller: "Morgan Reyes",
      phone: "+1 (415) 555-0139",
      summary: "Asked about 1402 Oak St., booked Tuesday 2:30 PM showing.",
      dur: "1m 42s",
      intent: "Showing booked",
      score: "Hot" as const,
      tone: "emerald" as const,
      time: "4m ago",
    },
    {
      caller: "Daniel Okafor",
      phone: "+1 (212) 555-0187",
      summary: "Buyer, $650k budget, prefers Upper West Side.",
      dur: "2m 07s",
      intent: "Pre-qualified buyer",
      score: "Hot" as const,
      tone: "emerald" as const,
      time: "38m ago",
    },
    {
      caller: "Priya Shah",
      phone: "+1 (646) 555-0104",
      summary: "Existing client, wanted to speak with agent directly.",
      dur: "3m 11s",
      intent: "Transferred to agent",
      score: "Warm" as const,
      tone: "amber" as const,
      time: "1h ago",
    },
    {
      caller: "Rafael Cruz",
      phone: "+1 (305) 555-0122",
      summary: "Asked about 220 Beacon Ave. listing details and price.",
      dur: "1m 28s",
      intent: "Listing inquiry",
      score: null,
      tone: "zinc" as const,
      time: "2h ago",
    },
  ];

  const filters = [
    { key: "all", label: "All", count: 28 },
    { key: "booked", label: "Booked", count: 11 },
    { key: "transferred", label: "Transferred", count: 4 },
    { key: "qa", label: "Q&A", count: 9 },
    { key: "voicemail", label: "Voicemail", count: 4 },
  ];
  const stats = [
    { label: "Total calls", value: "28", sub: "" },
    { label: "Booked", value: "11", sub: "39% rate" },
    { label: "Transferred", value: "4", sub: "" },
    { label: "Avg duration", value: "2m 12s", sub: "" },
  ];

  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-white">Call log</p>
          <p className="mt-0.5 text-[11px] text-zinc-500">
            Every inbound call Operavo handled, with intent, summary, and full transcript.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-300 hover:bg-white/10">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </button>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/10 bg-white/2 p-3"
          >
            <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
              {s.label}
            </p>
            <p className="mt-1.5 text-xl font-semibold tracking-tight text-white">
              {s.value}
            </p>
            <p className="mt-1 text-[10px] text-zinc-500">{s.sub || " "}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/2">
        <div className="flex flex-col gap-2 border-b border-white/5 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1 rounded-xl bg-black/30 p-1 ring-1 ring-inset ring-white/5">
            {filters.map((f, i) => (
              <span
                key={f.key}
                className={
                  "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors " +
                  (i === 0 ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400")
                }
              >
                {f.label}
                <span
                  className={
                    "ml-1.5 inline-flex min-w-[16px] justify-center rounded-full px-1 py-0.5 text-[9px] font-semibold tabular-nums " +
                    (i === 0 ? "bg-zinc-900 text-white" : "bg-white/10 text-zinc-400")
                  }
                >
                  {f.count}
                </span>
              </span>
            ))}
          </div>
          <div className="relative w-full sm:w-56">
            <svg className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <div className="h-8 w-full rounded-lg border border-white/10 bg-black/40 pl-8 pr-2.5 text-[11px] leading-8 text-zinc-500">
              Search caller, name, or summary
            </div>
          </div>
        </div>

        {calls.map((c) => (
          <div
            key={c.phone}
            className="flex items-start justify-between gap-3 border-b border-white/5 px-4 py-3 last:border-0 hover:bg-white/2"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-zinc-100">
                  {c.caller}
                </p>
                <p className="truncate font-mono text-[11px] text-zinc-500">
                  <a
                    href={`tel:${c.phone}`}
                    className="hover:underline hover:text-zinc-300 transition-colors"
                  >
                    {c.phone}
                  </a>
                </p>
                <p className="mt-1 line-clamp-1 text-[11px] text-zinc-500">
                  {c.summary}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <div className="flex items-center gap-1.5">
                <ToneBadge tone={c.tone}>{c.intent}</ToneBadge>
                {c.score && <ScoreBadge score={c.score} />}
              </div>
              <span className="font-mono text-[10px] tabular-nums text-zinc-500">
                {c.dur} · {c.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppointmentsView() {
  const appts = [
    {
      mon: "May",
      day: "07",
      dow: "Wed",
      when: "Today",
      time: "2:30 PM",
      name: "Morgan Reyes",
      service: "Property showing · 1402 Oak St.",
      status: "Confirmed" as const,
    },
    {
      mon: "May",
      day: "07",
      dow: "Wed",
      when: "Today",
      time: "4:00 PM",
      name: "Daniel Okafor",
      service: "Buyer consultation · 30 min",
      status: "Confirmed" as const,
    },
    {
      mon: "May",
      day: "08",
      dow: "Thu",
      when: "Tomorrow",
      time: "10:15 AM",
      name: "Rafael Cruz",
      service: "Listing walkthrough · 220 Beacon Ave.",
      status: "Confirmed" as const,
    },
    {
      mon: "May",
      day: "08",
      dow: "Thu",
      when: "Tomorrow",
      time: "1:00 PM",
      name: "Priya Shah",
      service: "Follow-up · post-offer",
      status: "Pending" as const,
    },
  ];

  const tabs = [
    { label: "Upcoming", count: 9 },
    { label: "Today", count: 2 },
    { label: "Past", count: 14 },
    { label: "All", count: 23 },
  ];

  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-white">
            Appointments
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-500">
            Everything Operavo booked, with status and live actions.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-0.5 text-[11px]">
          <span className="rounded-md bg-white px-2 py-0.5 font-medium text-zinc-900">List</span>
          <span className="px-2 py-0.5 text-zinc-400">Week</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/2">
        <div className="border-b border-white/5 p-3">
          <div className="flex flex-wrap gap-1 rounded-xl bg-black/30 p-1 ring-1 ring-inset ring-white/5">
            {tabs.map((t, i) => (
              <span
                key={t.label}
                className={
                  "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors " +
                  (i === 0 ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400")
                }
              >
                {t.label}
                <span
                  className={
                    "ml-1.5 inline-flex min-w-[16px] justify-center rounded-full px-1 py-0.5 text-[9px] font-semibold tabular-nums " +
                    (i === 0 ? "bg-zinc-900 text-white" : "bg-white/10 text-zinc-400")
                  }
                >
                  {t.count}
                </span>
              </span>
            ))}
          </div>
        </div>
        {appts.map((a, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3 last:border-0 hover:bg-white/3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-white/10 bg-black/30">
                <span className="text-[8px] font-semibold uppercase tracking-wider text-zinc-500">
                  {a.mon}
                </span>
                <span className="text-sm font-semibold leading-none text-white">
                  {a.day}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-zinc-500">
                  {a.dow}
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-white">
                  {a.name}
                </p>
                <p className="truncate text-[11px] text-zinc-400">
                  <span className="text-zinc-300">{a.when}</span>
                  <span className="mx-1.5 text-zinc-600">·</span>
                  <span className="font-mono text-zinc-300">{a.time}</span>
                  <span className="mx-1.5 text-zinc-600">·</span>
                  {a.service}
                </p>
              </div>
            </div>
            <span
              className={
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset " +
                (a.status === "Confirmed"
                  ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
                  : "bg-amber-500/10 text-amber-300 ring-amber-500/30")
              }
            >
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadsView() {
  const leads = [
    {
      name: "Morgan Reyes",
      phone: "+1 (415) 555-0139",
      company: "Self-employed",
      score: "Hot" as const,
      note: "Pre-approved · 3BR target · ready to tour this week",
      when: "4m ago",
    },
    {
      name: "Daniel Okafor",
      phone: "+1 (212) 555-0187",
      company: "",
      score: "Hot" as const,
      note: "Budget confirmed $650k · loves Upper West Side",
      when: "38m ago",
    },
    {
      name: "Avery Lin",
      phone: "+1 (503) 555-0114",
      company: "First-time buyer",
      score: "Warm" as const,
      note: "Needs agent intro · timeline 60 days · open to condos",
      when: "5h ago",
    },
    {
      name: "Lena Park",
      phone: "+1 (718) 555-0166",
      company: "",
      score: "Cold" as const,
      note: "Research stage · not ready for direct contact yet",
      when: "2d ago",
    },
  ];

  const stats = [
    { label: "Total leads", value: 18, dot: "bg-emerald-400" },
    { label: "Hot", value: 4, dot: "bg-rose-400" },
    { label: "Warm", value: 7, dot: "bg-amber-400" },
    { label: "Cold", value: 7, dot: "bg-zinc-400" },
  ];

  const tabs = [
    { label: "All", count: 18 },
    { label: "Hot", count: 4 },
    { label: "Warm", count: 7 },
    { label: "Cold", count: 7 },
  ];

  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-white">
            Qualified leads
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-500">
            Every caller Operavo scored, with a two-sentence summary and recommended next step.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-300 hover:bg-white/10">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </button>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/10 bg-white/2 p-3"
          >
            <div className="flex items-center gap-1.5">
              <span className={"h-1.5 w-1.5 rounded-full " + s.dot} />
              <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                {s.label}
              </p>
            </div>
            <p className="mt-1.5 text-xl font-semibold tracking-tight text-white">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/2">
        <div className="flex flex-col gap-2 border-b border-white/5 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1 rounded-xl bg-black/30 p-1 ring-1 ring-inset ring-white/5">
            {tabs.map((t, i) => (
              <span
                key={t.label}
                className={
                  "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors " +
                  (i === 0 ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400")
                }
              >
                {t.label}
                <span
                  className={
                    "ml-1.5 inline-flex min-w-[16px] justify-center rounded-full px-1 py-0.5 text-[9px] font-semibold tabular-nums " +
                    (i === 0 ? "bg-zinc-900 text-white" : "bg-white/10 text-zinc-400")
                  }
                >
                  {t.count}
                </span>
              </span>
            ))}
          </div>
          <div className="relative w-full sm:w-56">
            <svg className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <div className="h-8 w-full rounded-lg border border-white/10 bg-black/40 pl-8 pr-2.5 text-[11px] leading-8 text-zinc-500">
              Search name, phone, or company
            </div>
          </div>
        </div>

        {leads.map((l) => (
          <div
            key={l.phone}
            className="flex items-start gap-3 border-b border-white/5 px-4 py-3 last:border-0 hover:bg-white/3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
              {l.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <p className="truncate text-[13px] font-medium text-white">
                  {l.name}
                </p>
                {l.company && (
                  <span className="truncate text-[10px] text-zinc-500">
                    · {l.company}
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate font-mono text-[10px] text-zinc-500">
                <a
                  href={`tel:${l.phone}`}
                  className="hover:underline hover:text-zinc-300 transition-colors"
                >
                  {l.phone}
                </a>
              </p>
              <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-zinc-400">
                {l.note}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <ScoreBadge score={l.score} />
              <span className="text-[10px] tabular-nums text-zinc-500">
                {l.when}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[15px] font-semibold tracking-tight text-white">Workspace</p>
        <p className="mt-0.5 text-[11px] text-zinc-500">
          How your business shows up to callers and on your dashboard.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/2 p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
            CR
          </div>
          <div>
            <p className="text-[13px] font-medium text-white">Profile</p>
            <p className="text-[11px] text-zinc-500">
              Used across the dashboard and call transcripts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <LabeledField label="Business name" value="Cedar Ridge Realty" />
          <LabeledField label="Full name" value="Jordan Bennett" />
          <LabeledField label="Business phone" value="+1 (415) 555-0117" />
          <LabeledField label="Timezone" value="America/Los_Angeles" />
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button className="rounded-full border border-white/10 bg-white/3 px-3 py-1 text-[11px] text-zinc-300 hover:bg-white/10">
            Cancel
          </button>
          <button className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-black hover:bg-zinc-100">
            Save changes
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/2 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/40">
              <GoogleCalendarMark />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-white">
                Google Calendar
              </p>
              <p className="truncate text-[11px] text-zinc-400">
                Connected as{" "}
                <a
                  href="mailto:team@cedarridge.co"
                  className="hover:underline hover:text-zinc-200 transition-colors"
                >
                  team@cedarridge.co
                </a>
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
            Connected
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/2 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-zinc-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-medium text-white">Change password</p>
            <p className="text-[11px] text-zinc-500">
              Pick something at least 12 characters with a number and symbol.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <LabeledField label="Current password" value="••••••••••••" />
          <LabeledField label="New password" value="••••••••••••" />
        </div>
        <div className="mt-4 flex justify-end">
          <button className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-black hover:bg-zinc-100">
            Update password
          </button>
        </div>
      </div>
    </div>
  );
}

function LabeledField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </label>
      <div className="mt-1 flex h-8 items-center rounded-md border border-white/10 bg-black/30 px-2.5 text-[12px] text-zinc-200">
        {value}
      </div>
    </div>
  );
}

function GoogleCalendarMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-zinc-400"
      />
      <path
        d="M3 9h18"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-zinc-400"
      />
      <path
        d="M8 2v4M16 2v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-zinc-400"
      />
      <circle
        cx="12"
        cy="14.5"
        r="2.5"
        fill="currentColor"
        className="text-emerald-400"
      />
    </svg>
  );
}

function ToneBadge({
  tone,
  children,
}: {
  tone: "emerald" | "amber" | "zinc";
  children: React.ReactNode;
}) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ring-1 ring-inset " +
        (tone === "emerald"
          ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
          : tone === "amber"
            ? "bg-amber-500/10 text-amber-300 ring-amber-500/30"
            : "bg-white/5 text-zinc-300 ring-white/10")
      }
    >
      {children}
    </span>
  );
}

function ScoreBadge({ score }: { score: "Hot" | "Warm" | "Cold" }) {
  const classes =
    score === "Hot"
      ? "bg-rose-500/15 text-rose-300 ring-rose-500/30"
      : score === "Warm"
        ? "bg-amber-500/15 text-amber-300 ring-amber-500/30"
        : "bg-white/5 text-zinc-300 ring-white/10";
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset " +
        classes
      }
    >
      {score}
    </span>
  );
}

function SparkBars() {
  const bars = [3, 5, 2, 6, 4, 5, 3];
  const max = Math.max(...bars);
  return (
    <div className="flex h-16 items-end gap-2">
      {bars.map((b, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-linear-to-t from-emerald-500/30 via-emerald-500 to-emerald-300"
          style={{ height: `${(b / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

function IconHome() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
    </svg>
  );
}

function IconGear() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
