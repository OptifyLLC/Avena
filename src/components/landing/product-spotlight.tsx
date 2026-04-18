export function ProductSpotlight() {
  return (
    <section
      id="product"
      className="relative mx-auto w-full max-w-6xl px-6 py-28 md:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[10%] -z-10 h-[440px] bg-[radial-gradient(ellipse_50%_55%_at_30%_40%,rgba(16,185,129,0.14),transparent_70%)]"
      />
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Dashboard
            </p>
          </div>
          <h2 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] -tracking-[0.03em] text-white sm:text-5xl md:text-6xl">
            Every call, in one place.
          </h2>
          <p className="mt-5 text-[17px] leading-[1.65] text-zinc-400">
            Every Avena call, booking, and lead in a single pane — row-level
            isolated, exportable as CSV, ready for your team.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-3 text-[15px] text-zinc-400">
          {[
            "Live call log",
            "Lead tagging",
            "Appointment sync",
            "CSV export",
          ].map((label) => (
            <li key={label} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.14),transparent_70%)] blur-2xl"
        />
        <DashboardMock />
      </div>
    </section>
  );
}

function DashboardMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
      {/* titlebar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <span className="font-mono text-xs text-zinc-500">
          app.avena.ai
        </span>
        <span className="w-12" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
        <aside className="hidden border-r border-white/10 p-3 sm:block">
          {[
            { label: "Overview", active: true },
            { label: "Call log" },
            { label: "Appointments" },
            { label: "Leads" },
            { label: "Integrations" },
            { label: "Settings" },
          ].map((item) => (
            <div
              key={item.label}
              className={
                "rounded-md px-2.5 py-1.5 text-sm " +
                (item.active
                  ? "bg-white text-black"
                  : "text-zinc-400")
              }
            >
              {item.label}
            </div>
          ))}
        </aside>

        <div className="p-5 sm:p-6">
          <div className="mb-5 grid grid-cols-3 gap-3">
            {[
              { label: "Calls this week", value: "142", delta: "+23%" },
              { label: "Appointments", value: "38", delta: "+12%" },
              { label: "Hot leads", value: "12", delta: "+40%" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5"
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

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-400">Activity</p>
              <div className="flex gap-1 rounded-md bg-white/5 p-0.5 text-[10px]">
                <span className="rounded bg-white px-2 py-0.5 text-black">
                  7d
                </span>
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
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.01] px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="font-mono text-zinc-300">{row.caller}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={
                      "rounded-full px-2 py-0.5 text-[11px] " +
                      (row.tone === "emerald"
                        ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/30"
                        : row.tone === "amber"
                          ? "bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/30"
                          : "bg-white/5 text-zinc-300 ring-1 ring-inset ring-white/10")
                    }
                  >
                    {row.intent}
                  </span>
                  <span className="text-xs text-zinc-500">{row.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
          className="flex-1 rounded-sm bg-gradient-to-t from-emerald-500/30 via-emerald-500 to-emerald-300"
          style={{ height: `${(b / max) * 100}%` }}
        />
      ))}
    </div>
  );
}
