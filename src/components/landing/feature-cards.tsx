export function FeatureCards() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-4 sm:px-6">
      <div className="grid gap-4 md:grid-cols-2">
        <RoutingCard />
        <BookingCard />
      </div>
    </section>
  );
}

function RoutingCard() {
  return (
    <div className="group relative flex h-[460px] flex-col overflow-hidden rounded-3xl border border-white/6 bg-linear-to-br from-emerald-950/25 via-zinc-950/50 to-black p-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/12 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.12),transparent_60%)]"
      />

      <div className="relative z-10 flex items-center gap-3">
        <span className="h-px w-8 bg-emerald-400/60" />
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-300">
          Every caller, understood
        </p>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center py-8">
        <RoutingGraphic />
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-medium leading-[1.2] -tracking-[0.02em] text-white sm:text-[28px]">
          Routed to the right outcome, instantly.
        </h3>
        <p className="mt-3 max-w-sm text-[15px] leading-[1.6] font-light text-zinc-400">
          Avena knows what the caller needs the moment they ask. Every call
          routed to the right path, in real time.
        </p>
      </div>
    </div>
  );
}

function RoutingGraphic() {
  const intents = [
    { label: "Book a meeting", state: "idle" },
    { label: "Qualify lead", state: "routed" },
    { label: "Live transfer", state: "idle" },
  ];
  return (
    <div className="mx-auto w-full max-w-xs space-y-2 rounded-2xl border border-white/8 bg-white/1 p-3 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between px-2 pb-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          Caller intent
        </p>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          live
        </span>
      </div>
      {intents.map((i) => (
        <div
          key={i.label}
          className={
            "flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-colors " +
            (i.state === "routed"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
              : "border-white/10 bg-white/3 text-zinc-300")
          }
        >
          <span>{i.label}</span>
          {i.state === "routed" ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              routed
            </span>
          ) : (
            <span className="text-xs text-zinc-500">idle</span>
          )}
        </div>
      ))}
    </div>
  );
}

function BookingCard() {
  return (
    <div className="group relative flex h-[460px] flex-col overflow-hidden rounded-3xl border border-white/6 bg-linear-to-br from-emerald-950/15 via-zinc-950/50 to-black p-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/12 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.1),transparent_60%)]"
      />

      <div className="relative z-10 flex items-center gap-3">
        <span className="h-px w-8 bg-emerald-400/60" />
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-300">
          Every meeting, booked
        </p>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center py-8">
        <BookingGraphic />
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-medium leading-[1.2] -tracking-[0.02em] text-white sm:text-[28px]">
          Confirmed before the caller hangs up.
        </h3>
        <p className="mt-3 max-w-sm text-[15px] leading-[1.6] font-light text-zinc-400">
          Avena checks your calendar live as the call runs. If a slot is
          taken, the next three open times are offered out loud.
        </p>
      </div>
    </div>
  );
}

function BookingGraphic() {
  const slots = [
    { label: "Today · 2:30 PM", state: "busy" },
    { label: "Today · 3:00 PM", state: "picked" },
    { label: "Today · 4:30 PM", state: "open" },
  ];
  return (
    <div className="mx-auto w-full max-w-xs space-y-2 rounded-2xl border border-white/8 bg-white/1 p-3 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between px-2 pb-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          Availability
        </p>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          live
        </span>
      </div>
      {slots.map((s) => (
        <div
          key={s.label}
          className={
            "flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-colors " +
            (s.state === "picked"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
              : s.state === "busy"
                ? "border-white/5 bg-white/2 text-zinc-500 line-through"
                : "border-white/10 bg-white/3 text-zinc-300")
          }
        >
          <span>{s.label}</span>
          {s.state === "picked" ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              booked
            </span>
          ) : s.state === "busy" ? (
            <span className="text-xs text-zinc-600">busy</span>
          ) : (
            <span className="text-xs text-zinc-500">open</span>
          )}
        </div>
      ))}
    </div>
  );
}
