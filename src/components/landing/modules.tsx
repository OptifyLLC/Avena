export function Modules() {
  return (
    <section
      id="modules"
      className="relative overflow-hidden py-28 md:py-36"
    >

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <span className="h-px w-8 bg-emerald-400/60" />
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-300">
            What Avena handles
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-16">
          <h2 className="text-balance text-4xl font-medium leading-[1.08] -tracking-[0.025em] text-white sm:text-5xl md:text-[56px]">
            From dial to done.{" "}
            <span className="font-accent italic font-normal text-zinc-400">
              Handled in one call.
            </span>
          </h2>
          <p className="max-w-md text-[15px] leading-[1.6] font-light text-zinc-400 md:pb-3">
            Every caller gets answered, booked, or handed off — and every call
            leaves behind a tagged lead, a confirmation text, and a record in
            your sheet.
          </p>
        </div>

        <div className="mt-20 space-y-24">
          <ModuleRow
            name="Booking"
            category="Confirmed on the call"
            description="Avena checks your calendar live, books the slot before the caller hangs up, and sends the calendar invite. If their time is taken, they hear three open alternatives instead of a callback promise."
            bullets={[
              "Never offers a time that's already taken",
              "Caller hears three options, not a callback promise",
              "They walk away with it on their calendar",
              "No more chasing down bad contact info",
            ]}
            visual={<BookingVisual />}
          />
          <ModuleRow
            reverse
            name="Live Availability"
            category="Open slots, read out loud"
            description="When a caller asks “what times do you have?”, Avena scans the next seven days and reads three available slots back in under two seconds. Natural phrases like “Tuesday” or “next week” all work."
            bullets={[
              "Caller never has to wait for a callback",
              "Answers before they can get bored",
              "Speaks like a person — no stiff menus or date codes",
              "One “yes” and the slot is theirs",
            ]}
            visual={<SlotsVisual />}
          />
          <ModuleRow
            name="Human Handoff"
            category="Bridged to your team in seconds"
            description="The moment a caller asks for a person — or the conversation goes somewhere Avena shouldn’t — the call bridges to your team with a short hold message. No dead air, no dropped callers."
            bullets={[
              "One “talk to a person” and they're connected",
              "No dead air — callers stay engaged",
              "Your agent is briefed before they pick up (coming soon)",
              "If no one answers, your caller is promised a callback, not ghosted",
            ]}
            visual={<TransferVisual />}
          />
          <ModuleRow
            reverse
            name="Lead Scoring"
            category="Every caller, tagged"
            description="After every call, Avena tags the caller Hot, Warm, or Cold — with a two-sentence summary and a next action your team can run with. No re-listening, no guessing who to call back first."
            bullets={[
              "Know who to call back first, before you pour coffee",
              "Skip the re-listen — get the gist and the next move",
              "Every call saved for when you need to double-check",
              "All of it in a sheet you already know how to open",
            ]}
            visual={<QualificationVisual />}
          />
          <ModuleRow
            name="Text Confirmation"
            category="In their pocket before they hang up"
            description="The moment a booking confirms, Avena fires a personalized text with the caller's name and a one-tap “Add to calendar” link — sent while the caller is still on the line. No forgotten details, no waiting for email."
            bullets={[
              "Caller sees it in their pocket before they hang up",
              "Their name, their appointment — never generic",
              "Tap once and it's on their calendar",
              "Fewer no-shows, fewer “wait, when was it again?”",
            ]}
            visual={<SmsVisual />}
          />
          <ModuleRow
            reverse
            name="Safe Recovery"
            category="If something breaks, no one gets stuck"
            description="If audio glitches or a caller keeps getting misheard, Avena apologizes, retries, then hands the call to a real person rather than grinding on. Callers never hear error codes or feel trapped in a loop."
            bullets={[
              "A rough patch doesn't end the call — the AI tries again",
              "One clean exchange and everything's back on track",
              "Callers hear a polite apology, never a robotic error",
              "Anyone who says “human” gets one, instantly",
            ]}
            visual={<FailureVisual />}
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
      <div className="relative h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-emerald-950/40 to-black p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.2),transparent_70%)]"
        />
        <div className="relative z-10 flex h-full items-center justify-center">
          {visual}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2.5">
          <h3 className="text-[28px] font-semibold leading-[1.15] -tracking-[0.025em] text-white sm:text-[32px]">
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
        <p className="mt-5 text-base leading-[1.65] text-zinc-300">
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
                  ? "border-white/5 bg-white/2 text-zinc-600 line-through"
                  : "border-white/10 bg-white/2 text-zinc-300")
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

function SlotsVisual() {
  const slots = [
    { day: "Mon, Apr 13", time: "10:00 AM" },
    { day: "Mon, Apr 13", time: "2:00 PM" },
    { day: "Tue, Apr 14", time: "11:00 AM" },
  ];
  return (
    <div className="w-full max-w-[280px] rounded-xl border border-white/10 bg-black/70 p-3 backdrop-blur">
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="text-xs font-medium text-zinc-300">
          Next available
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          live
        </span>
      </div>
      <div className="space-y-1.5">
        {slots.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/4 px-3 py-2 text-sm"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono text-emerald-400/80">
                {i + 1}
              </span>
              <span className="text-zinc-300">{s.day}</span>
            </div>
            <span className="font-mono text-xs text-emerald-200">
              {s.time}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2.5 px-1 text-[10px] text-zinc-500">
        Found in 1.4s · which one works?
      </p>
    </div>
  );
}

function QualificationVisual() {
  return (
    <div className="w-full max-w-[280px] space-y-2">
      {[
        { label: "Sarah — pre-approved, 3BR", tag: "Hot", tone: "hot" },
        { label: "Mike — seller, Upper West Side", tag: "Warm", tone: "warm" },
        { label: "Priya — buyer, 30-day window", tag: "Hot", tone: "hot" },
        { label: "James — research stage", tag: "Cold", tone: "cold" },
      ].map((r) => (
        <div
          key={r.label}
          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/3 px-3 py-2.5"
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
      <div className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/2 p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
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
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-white">Avena</p>
          <p className="truncate font-mono text-[10px] text-zinc-500">
            active · 02:14
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          live
        </span>
      </div>
      <svg width="2" height="28" viewBox="0 0 2 28" fill="none">
        <path
          d="M1 0v28"
          stroke="rgba(52,211,153,0.4)"
          strokeDasharray="2 3"
        />
      </svg>
      <div className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/2 p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-zinc-300">
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
    <div className="w-full max-w-[300px] space-y-2">
      <div className="flex items-center justify-between px-1 pb-1">
        <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500">
          SMS
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          on call
        </span>
      </div>
      <div className="ml-auto max-w-[92%] rounded-2xl rounded-br-sm bg-emerald-500/90 px-3.5 py-2.5 text-[13px] leading-[1.4] text-white">
        Hi Morgan Reyes, your appointment is confirmed!
        <br />
        <span className="mt-1 block text-[12px] text-white/90 underline underline-offset-2">
          Add to calendar: calendar.google.com/event…
        </span>
      </div>
      <div className="flex items-center justify-end gap-1.5 pr-1">
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-400"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <p className="text-[10px] text-zinc-500">
          delivered · while still on the call
        </p>
      </div>
    </div>
  );
}

function FailureVisual() {
  const strikes = [
    {
      n: 1,
      text: "“I didn't quite catch that — could you say it again?”",
      tone: "soft",
    },
    {
      n: 2,
      text: "“Sounds like a connection issue — try again, or I can connect you.”",
      tone: "warn",
    },
    {
      n: 3,
      text: "“Let me connect you with our team right away.”",
      tone: "escalate",
    },
  ];
  return (
    <div className="w-full max-w-[300px] space-y-1.5">
      {strikes.map((s) => (
        <div
          key={s.n}
          className={
            "rounded-xl border px-3 py-2.5 text-[11px] leading-[1.4] " +
            (s.tone === "soft"
              ? "border-white/10 bg-white/3 text-zinc-300"
              : s.tone === "warn"
                ? "border-amber-500/25 bg-amber-500/6 text-amber-100"
                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-100")
          }
        >
          <div className="mb-1 flex items-center gap-2">
            <span
              className={
                "inline-flex h-4 w-4 items-center justify-center rounded-full font-mono text-[9px] " +
                (s.tone === "soft"
                  ? "bg-white/10 text-zinc-400"
                  : s.tone === "warn"
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-emerald-500/25 text-emerald-300")
              }
            >
              {s.n}
            </span>
            <span
              className={
                "text-[9px] font-semibold uppercase tracking-[0.15em] " +
                (s.tone === "soft"
                  ? "text-zinc-500"
                  : s.tone === "warn"
                    ? "text-amber-400/80"
                    : "text-emerald-400")
              }
            >
              {s.tone === "escalate" ? "transfer" : "retry"}
            </span>
          </div>
          {s.text}
        </div>
      ))}
    </div>
  );
}
