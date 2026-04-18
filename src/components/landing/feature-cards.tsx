export function FeatureCards() {
  return (
    <section
      id="about"
      className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-4 sm:px-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <RoutingCard />
        <BookingCard />
      </div>
    </section>
  );
}

function RoutingCard() {
  return (
    <div className="group relative h-[440px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-950/30 via-black to-black p-8 transition-colors hover:border-white/15">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.18),transparent_60%)]"
      />
      <div className="relative z-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Real-time routing
        </p>
      </div>

      <RoutingGraphic />

      <div className="absolute bottom-8 left-8 right-8 z-10">
        <h3 className="text-2xl font-semibold leading-[1.15] -tracking-[0.025em] text-white sm:text-[28px]">
          Intent detected mid-sentence.
        </h3>
        <p className="mt-3 max-w-sm text-[15px] leading-[1.6] text-zinc-400">
          Vapi streams the transcript to n8n. Actions fire the moment a caller
          says &ldquo;book&rdquo;, &ldquo;speak to someone&rdquo;, or asks for
          hours.
        </p>
      </div>
    </div>
  );
}

function RoutingGraphic() {
  return (
    <div className="absolute inset-x-0 top-20 flex justify-center">
      <svg viewBox="0 0 400 200" className="w-full max-w-md" fill="none">
        <defs>
          <linearGradient id="line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(52,211,153,0)" />
            <stop offset="50%" stopColor="rgba(52,211,153,0.8)" />
            <stop offset="100%" stopColor="rgba(52,211,153,0)" />
          </linearGradient>
        </defs>
        <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
          <path d="M40 100 Q 200 20 360 100" />
          <path d="M40 100 Q 200 60 360 100" />
          <path d="M40 100 Q 200 140 360 100" />
          <path d="M40 100 Q 200 180 360 100" />
        </g>
        <g>
          <path
            d="M40 100 Q 200 60 360 100"
            stroke="url(#line)"
            strokeWidth="1.5"
          />
        </g>
        <circle cx="40" cy="100" r="6" fill="#34d399" />
        <circle cx="40" cy="100" r="14" fill="none" stroke="rgba(52,211,153,0.3)" />
        <g fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="ui-monospace, monospace">
          <text x="360" y="54" textAnchor="end">booking</text>
          <text x="360" y="94" textAnchor="end">qualify</text>
          <text x="360" y="134" textAnchor="end">transfer</text>
          <text x="360" y="174" textAnchor="end">q&amp;a</text>
        </g>
        <g>
          <circle cx="360" cy="50" r="4" fill="rgba(255,255,255,0.25)" />
          <circle cx="360" cy="90" r="5" fill="#34d399" />
          <circle cx="360" cy="130" r="4" fill="rgba(255,255,255,0.25)" />
          <circle cx="360" cy="170" r="4" fill="rgba(255,255,255,0.25)" />
        </g>
      </svg>
    </div>
  );
}

function BookingCard() {
  return (
    <div className="group relative h-[440px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-black to-black p-8 transition-colors hover:border-white/15">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_60%)]"
      />
      <div className="relative z-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Booking engine
        </p>
      </div>

      <div className="relative z-10 mt-8">
        <BookingGraphic />
      </div>

      <div className="absolute bottom-8 left-8 right-8 z-10">
        <h3 className="text-2xl font-semibold leading-[1.15] -tracking-[0.025em] text-white sm:text-[28px]">
          Slots confirmed before the caller hangs up.
        </h3>
        <p className="mt-3 max-w-sm text-[15px] leading-[1.6] text-zinc-400">
          Live Google Calendar checks. If a slot is taken, the agent offers the
          next three — out loud, on the same call.
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
    { label: "Tomorrow · 10:00 AM", state: "open" },
  ];
  return (
    <div className="mx-auto w-full max-w-xs space-y-2 rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur">
      <div className="flex items-center justify-between px-2 pb-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          Availability
        </p>
        <span className="font-mono text-[10px] text-zinc-500">
          live · gcal
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
                ? "border-white/5 bg-white/[0.02] text-zinc-500 line-through"
                : "border-white/10 bg-white/[0.03] text-zinc-300")
          }
        >
          <span>{s.label}</span>
          {s.state === "picked" ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
