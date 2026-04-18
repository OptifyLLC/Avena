"use client";

import { useState } from "react";

type TabKey =
  | "overview"
  | "calls"
  | "appointments"
  | "leads"
  | "settings";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "calls", label: "Call log" },
  { key: "appointments", label: "Appointments" },
  { key: "leads", label: "Leads" },
  { key: "settings", label: "Settings" },
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
          Your team's single source of truth — live call log, lead tagging,
          appointment sync, and CSV export. Row-level isolated, ready for
          handoff.
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

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-zinc-950/90 backdrop-blur-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] transition-all duration-700 hover:border-white/15 hover:shadow-[0_40px_100px_-20px_rgba(16,185,129,0.1)]">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <span className="font-mono text-xs text-zinc-500">app.avena.ai</span>
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
                onClick={() => setActive(tab.key)}
                className={
                  "block w-full rounded-md px-2.5 py-1.5 text-left text-sm transition-colors " +
                  (isActive
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200")
                }
              >
                {tab.label}
              </button>
            );
          })}
        </aside>

        <div className="min-h-[520px] p-5 sm:p-6">
          {/* mobile tab row */}
          <div className="mb-4 flex gap-1.5 overflow-x-auto rounded-md bg-white/5 p-1 sm:hidden">
            {tabs.map((tab) => {
              const isActive = tab.key === active;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActive(tab.key)}
                  className={
                    "shrink-0 rounded-[5px] px-2.5 py-1 text-xs transition-colors " +
                    (isActive
                      ? "bg-white text-black"
                      : "text-zinc-400")
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {active === "overview" && <OverviewView />}
          {active === "calls" && <CallLogView />}
          {active === "appointments" && <AppointmentsView />}
          {active === "leads" && <LeadsView />}
          {active === "settings" && <SettingsView />}
        </div>
      </div>
    </div>
  );
}

function OverviewView() {
  return (
    <div>
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          { label: "Calls this week", value: "142", delta: "+23%" },
          { label: "Appointments", value: "38", delta: "+12%" },
          { label: "Hot leads", value: "12", delta: "+40%" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/10 bg-white/2 p-3.5"
          >
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">
              {s.label}
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <p className="text-xl font-semibold text-white">{s.value}</p>
              <span className="text-[10px] font-medium text-emerald-400">
                {s.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/2 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium text-zinc-400">Activity</p>
          <div className="flex gap-1 rounded-md bg-white/5 p-0.5 text-[10px]">
            <span className="rounded bg-white px-2 py-0.5 text-black">7d</span>
            <span className="px-2 py-0.5 text-zinc-400">30d</span>
            <span className="px-2 py-0.5 text-zinc-400">90d</span>
          </div>
        </div>
        <SparkBars />
      </div>

      <div className="mt-4 space-y-1.5">
        {[
          {
            caller: "+1 (415) 555-0139",
            intent: "Appointment booked",
            time: "2m ago",
            tone: "emerald" as const,
          },
          {
            caller: "+1 (347) 555-0183",
            intent: "Q&A · business hours",
            time: "14m ago",
            tone: "zinc" as const,
          },
          {
            caller: "+1 (646) 555-0104",
            intent: "Transferred to human",
            time: "42m ago",
            tone: "amber" as const,
          },
          {
            caller: "+1 (212) 555-0187",
            intent: "Hot lead · tagged",
            time: "1h ago",
            tone: "emerald" as const,
          },
        ].map((row) => (
          <div
            key={row.caller}
            className="flex items-center justify-between rounded-lg border border-white/5 bg-white/1 px-3 py-2 text-sm"
          >
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-zinc-300">{row.caller}</span>
            </div>
            <div className="flex items-center gap-3">
              <ToneBadge tone={row.tone}>{row.intent}</ToneBadge>
              <span className="text-xs text-zinc-500">{row.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CallLogView() {
  const calls = [
    {
      caller: "+1 (415) 555-0139",
      name: "Morgan Reyes",
      dur: "1:42",
      intent: "Appointment booked",
      tone: "emerald" as const,
      time: "2m ago",
    },
    {
      caller: "+1 (347) 555-0183",
      name: "—",
      dur: "0:48",
      intent: "Q&A · business hours",
      tone: "zinc" as const,
      time: "14m ago",
    },
    {
      caller: "+1 (646) 555-0104",
      name: "Priya Shah",
      dur: "3:11",
      intent: "Transferred to human",
      tone: "amber" as const,
      time: "42m ago",
    },
    {
      caller: "+1 (212) 555-0187",
      name: "Daniel Okafor",
      dur: "2:07",
      intent: "Hot lead · tagged",
      tone: "emerald" as const,
      time: "1h ago",
    },
    {
      caller: "+1 (718) 555-0166",
      name: "Lena Park",
      dur: "0:33",
      intent: "Voicemail · no intent",
      tone: "zinc" as const,
      time: "2h ago",
    },
    {
      caller: "+1 (305) 555-0122",
      name: "Rafael Cruz",
      dur: "4:28",
      intent: "Appointment booked",
      tone: "emerald" as const,
      time: "3h ago",
    },
    {
      caller: "+1 (512) 555-0191",
      name: "—",
      dur: "1:05",
      intent: "Qualified · follow-up",
      tone: "emerald" as const,
      time: "4h ago",
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-white">Recent calls</p>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-500">7 of 142</span>
          <button className="rounded-md border border-white/10 bg-white/3 px-2.5 py-1 text-[11px] text-zinc-300 hover:bg-white/10">
            Export CSV
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/2">
        <div className="grid grid-cols-[1.2fr_1fr_60px_1.3fr_60px] items-center gap-3 border-b border-white/5 bg-black/30 px-4 py-2 text-[10px] uppercase tracking-wider text-zinc-500">
          <span>Caller</span>
          <span>Name</span>
          <span>Dur.</span>
          <span>Intent</span>
          <span className="text-right">Time</span>
        </div>
        {calls.map((c) => (
          <div
            key={c.caller}
            className="grid grid-cols-[1.2fr_1fr_60px_1.3fr_60px] items-center gap-3 border-b border-white/5 px-4 py-2.5 text-sm last:border-0 hover:bg-white/2"
          >
            <span className="flex items-center gap-2 font-mono text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {c.caller}
            </span>
            <span className="text-zinc-300">{c.name}</span>
            <span className="font-mono text-xs text-zinc-400">{c.dur}</span>
            <ToneBadge tone={c.tone}>{c.intent}</ToneBadge>
            <span className="text-right text-xs text-zinc-500">{c.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppointmentsView() {
  const appts = [
    {
      when: "Today",
      time: "2:30 PM",
      name: "Morgan Reyes",
      service: "Property showing · 1402 Oak St.",
      status: "Confirmed",
    },
    {
      when: "Today",
      time: "4:00 PM",
      name: "Daniel Okafor",
      service: "Buyer consult · 30 min",
      status: "Confirmed",
    },
    {
      when: "Tomorrow",
      time: "10:15 AM",
      name: "Rafael Cruz",
      service: "Listing walkthrough",
      status: "Confirmed",
    },
    {
      when: "Tomorrow",
      time: "1:00 PM",
      name: "Priya Shah",
      service: "Follow-up · post-offer",
      status: "Pending",
    },
    {
      when: "Fri, Apr 24",
      time: "11:30 AM",
      name: "Avery Lin",
      service: "New inquiry · discovery",
      status: "Confirmed",
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-white">Upcoming appointments</p>
        <div className="flex gap-1 rounded-md bg-white/5 p-0.5 text-[11px]">
          <span className="rounded bg-white px-2 py-0.5 text-black">All</span>
          <span className="px-2 py-0.5 text-zinc-400">Today</span>
          <span className="px-2 py-0.5 text-zinc-400">Week</span>
        </div>
      </div>
      <div className="space-y-2">
        {appts.map((a, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/2 px-4 py-3"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-14 flex-col items-center justify-center rounded-lg border border-white/10 bg-black/30">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500">
                  {a.when.split(",")[0]}
                </span>
                <span className="font-mono text-xs text-white">{a.time}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{a.name}</p>
                <p className="text-xs text-zinc-400">{a.service}</p>
              </div>
            </div>
            <span
              className={
                "rounded-full px-2.5 py-0.5 text-[11px] " +
                (a.status === "Confirmed"
                  ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/30"
                  : "bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/30")
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
      name: "Daniel Okafor",
      phone: "+1 (212) 555-0187",
      score: "Hot",
      tone: "emerald" as const,
      note: "Budget confirmed · ready to tour",
      when: "1h ago",
    },
    {
      name: "Morgan Reyes",
      phone: "+1 (415) 555-0139",
      score: "Hot",
      tone: "emerald" as const,
      note: "Pre-approved · 3BR target",
      when: "3h ago",
    },
    {
      name: "Avery Lin",
      phone: "+1 (503) 555-0114",
      score: "Warm",
      tone: "amber" as const,
      note: "First-time buyer · needs agent intro",
      when: "5h ago",
    },
    {
      name: "Rafael Cruz",
      phone: "+1 (305) 555-0122",
      score: "Warm",
      tone: "amber" as const,
      note: "Comparing listings · timeline 30d",
      when: "yesterday",
    },
    {
      name: "Lena Park",
      phone: "+1 (718) 555-0166",
      score: "Cold",
      tone: "zinc" as const,
      note: "Research stage · no follow-up yet",
      when: "2d ago",
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-white">Qualified leads</p>
        <div className="flex gap-1 rounded-md bg-white/5 p-0.5 text-[11px]">
          <span className="rounded bg-white px-2 py-0.5 text-black">All</span>
          <span className="px-2 py-0.5 text-zinc-400">Hot</span>
          <span className="px-2 py-0.5 text-zinc-400">Warm</span>
        </div>
      </div>
      <div className="space-y-2">
        {leads.map((l) => (
          <div
            key={l.phone}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/2 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
                {l.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{l.name}</p>
                <p className="font-mono text-[11px] text-zinc-500">{l.phone}</p>
              </div>
            </div>
            <div className="hidden flex-1 px-6 text-xs text-zinc-400 md:block">
              {l.note}
            </div>
            <div className="flex items-center gap-3">
              <ToneBadge tone={l.tone}>{l.score}</ToneBadge>
              <span className="w-16 text-right text-xs text-zinc-500">
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
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-white">Workspace</p>
        <p className="mt-1 text-[11px] text-zinc-500">
          How your business shows up to callers and on your dashboard.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/2 p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
            CR
          </div>
          <div>
            <p className="text-sm font-medium text-white">Profile</p>
            <p className="text-[11px] text-zinc-500">
              Used across the dashboard and call transcripts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <LabeledField label="Business name" value="Cedar Ridge Realty" />
          <LabeledField label="Contact email" value="team@cedarridge.co" />
          <LabeledField label="Agent voice name" value="Avery" />
          <LabeledField label="Business phone" value="+1 (415) 555-0117" />
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button className="rounded-md border border-white/10 bg-white/3 px-3 py-1.5 text-[12px] text-zinc-300 hover:bg-white/10">
            Cancel
          </button>
          <button className="rounded-md bg-white px-3 py-1.5 text-[12px] font-medium text-black hover:bg-zinc-100">
            Save changes
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/2 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/40">
              <GoogleCalendarMark />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Google Calendar</p>
              <p className="text-[11px] text-zinc-400">
                Connected as team@cedarridge.co
              </p>
            </div>
          </div>
          <button className="shrink-0 rounded-md border border-white/10 bg-white/3 px-3 py-1.5 text-[12px] text-zinc-200 hover:bg-white/10">
            Change Google account
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
      <div className="mt-1 flex h-9 items-center rounded-md border border-white/10 bg-black/30 px-3 text-sm text-zinc-200">
        {value}
      </div>
    </div>
  );
}

function GoogleCalendarMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
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
      <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-400" />
      <circle cx="12" cy="14.5" r="2.5" fill="currentColor" className="text-emerald-400" />
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
        "rounded-full px-2 py-0.5 text-[11px] " +
        (tone === "emerald"
          ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/30"
          : tone === "amber"
            ? "bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/30"
            : "bg-white/5 text-zinc-300 ring-1 ring-inset ring-white/10")
      }
    >
      {children}
    </span>
  );
}

function SparkBars() {
  const bars = [24, 42, 33, 58, 51, 70, 56, 82, 60, 72, 81, 66, 74, 88];
  const max = Math.max(...bars);
  return (
    <div className="flex h-28 items-end gap-1.5">
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
