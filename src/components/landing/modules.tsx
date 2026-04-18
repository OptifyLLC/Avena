export function Modules() {
  return (
    <section
      id="modules"
      className="relative overflow-hidden py-28 md:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[10%] h-[460px] bg-[radial-gradient(ellipse_45%_55%_at_50%_30%,rgba(16,185,129,0.16),transparent_70%)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <div className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Modules
            </p>
          </div>
          <h2 className="mt-5 text-balance text-center text-4xl font-semibold leading-[1.05] -tracking-[0.03em] text-white sm:text-5xl md:text-6xl">
            One Avena.{" "}
            <span className="italic font-medium text-zinc-400">
              Six workflows.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-[1.65] text-zinc-400">
            Every call runs through a set of composable n8n nodes. Each one
            fires the moment its intent is detected.
          </p>
        </div>

        <div className="mt-20 space-y-24">
          <ModuleRow
            badge="NEW"
            name="Booking"
            category="Calendar sync"
            description="Checks Google Calendar in real-time, proposes alternative slots, and confirms the booking verbally before the caller hangs up."
            bullets={[
              "Live availability check",
              "Auto-suggests next 3 open slots",
              "Logs to Google Sheets on confirm",
            ]}
            visual={<BookingVisual />}
          />
          <ModuleRow
            reverse
            name="Qualification"
            category="Lead scoring"
            description="Runs 2–3 qualifying questions tuned to your business. GPT-4o scores every caller Hot, Warm, or Cold and tags the row."
            bullets={[
              "Configurable question set",
              "Deterministic tagging schema",
              "Tag written alongside transcript",
            ]}
            visual={<QualificationVisual />}
          />
          <ModuleRow
            name="Live Transfer"
            category="Human handoff"
            description="Detects &ldquo;speak to a human&rdquo; or agent requests. Warm-transfers to the designated line with a short brief."
            bullets={[
              "Twilio live transfer",
              "AI briefs the caller before handoff",
              "Status logged as Transferred",
            ]}
            visual={<TransferVisual />}
          />
          <ModuleRow
            reverse
            name="SMS Follow-up"
            category="Post-call"
            description="Twilio fires a confirmation or follow-up text within 60 seconds of hangup. SMS log appended to the call record."
            bullets={[
              "Booking confirmations",
              "Pending-query replies",
              "Delivery status logged",
            ]}
            visual={<SmsVisual />}
          />
        </div>
      </div>
    </section>
  );
}

function ModuleRow({
  name,
  category,
  description,
  bullets,
  visual,
  badge,
  reverse,
}: {
  name: string;
  category: string;
  description: string;
  bullets: string[];
  visual: React.ReactNode;
  badge?: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={
        "grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16 " +
        (reverse ? "md:[&>*:first-child]:order-2" : "")
      }
    >
      <div className="relative h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-950/25 via-zinc-950 to-black p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.12),transparent_70%)]"
        />
        <div className="relative z-10 flex h-full items-center justify-center">
          {visual}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2.5">
          <h3 className="text-3xl font-semibold leading-[1.1] -tracking-[0.025em] text-white sm:text-[34px]">
            {name}
          </h3>
          {badge && (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {category}
        </p>
        <p className="mt-5 text-[16px] leading-[1.65] text-zinc-300">
          {description}
        </p>
        <ul className="mt-6 space-y-2.5 border-t border-white/5 pt-6">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-center gap-3 text-[15px] text-zinc-400"
            >
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BookingVisual() {
  return (
    <div className="w-full max-w-[280px] rounded-xl border border-white/10 bg-black/70 p-3 backdrop-blur">
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="text-xs font-medium text-zinc-300">Fri, Apr 19</span>
        <span className="font-mono text-[10px] text-zinc-500">live</span>
      </div>
      <div className="space-y-1.5">
        {[
          { t: "10:00 AM", state: "busy" },
          { t: "11:30 AM", state: "open" },
          { t: "1:00 PM", state: "open" },
          { t: "3:00 PM", state: "picked" },
          { t: "4:30 PM", state: "open" },
        ].map((s) => (
          <div
            key={s.t}
            className={
              "flex items-center justify-between rounded-lg border px-3 py-2 text-sm " +
              (s.state === "picked"
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-100"
                : s.state === "busy"
                  ? "border-white/5 bg-white/[0.02] text-zinc-600 line-through"
                  : "border-white/10 bg-white/[0.02] text-zinc-300")
            }
          >
            <span className="font-mono text-xs">{s.t}</span>
            {s.state === "picked" && (
              <span className="text-[10px] font-medium text-emerald-400">
                booked ✓
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function QualificationVisual() {
  return (
    <div className="w-full max-w-[280px] space-y-2">
      {[
        { label: "Sarah — Northwell Clinic", tag: "Hot", tone: "hot" },
        { label: "Mike — Autohaus NYC", tag: "Warm", tone: "warm" },
        { label: "Priya — LegalEdge CA", tag: "Hot", tone: "hot" },
        { label: "James — OldClient Inc", tag: "Cold", tone: "cold" },
      ].map((r) => (
        <div
          key={r.label}
          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
        >
          <span className="truncate text-xs text-zinc-300">{r.label}</span>
          <span
            className={
              "rounded-full px-2 py-0.5 text-[10px] font-semibold " +
              (r.tone === "hot"
                ? "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30"
                : r.tone === "warm"
                  ? "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30"
                  : "bg-zinc-500/15 text-zinc-300 ring-1 ring-inset ring-zinc-500/30")
            }
          >
            {r.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

function TransferVisual() {
  return (
    <div className="flex w-full max-w-[320px] flex-col items-center gap-2">
      <div className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-white">
            Avena
          </p>
          <p className="truncate font-mono text-[10px] text-zinc-500">
            active · 02:14
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          live
        </span>
      </div>
      <svg width="2" height="28" viewBox="0 0 2 28" fill="none">
        <path d="M1 0v28" stroke="rgba(52,211,153,0.4)" strokeDasharray="2 3" />
      </svg>
      <div className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-zinc-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-white">
            Front desk · ext 102
          </p>
          <p className="truncate font-mono text-[10px] text-zinc-500">
            connecting…
          </p>
        </div>
      </div>
    </div>
  );
}

function SmsVisual() {
  return (
    <div className="w-full max-w-[280px] space-y-2">
      <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-emerald-500/90 px-4 py-2.5 text-sm text-white">
        Your appt with Dr. Khan is confirmed for Fri Apr 19, 3:00 PM. Reply R
        to reschedule.
      </div>
      <p className="text-right text-[10px] text-zinc-500">
        delivered · 00:42s after call
      </p>
      <div className="mr-auto mt-4 max-w-[88%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-300">
        Thanks for calling! We received your question about pricing — our
        team will be in touch shortly.
      </div>
      <p className="text-left text-[10px] text-zinc-500">
        delivered · 00:58s after call
      </p>
    </div>
  );
}
