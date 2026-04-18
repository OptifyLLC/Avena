import type { ReactNode } from "react";

const pillars: Array<{ title: string; body: string; icon: ReactNode }> = [
  {
    title: "Answered around the clock",
    body: "Your line picks up every time — day, night, weekends. Prospects hear a live voice instead of voicemail, so leads stop slipping through the hours no one is at the desk.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 4.5h2.6l1.9 4-2.1 1.3a12 12 0 0 0 5.3 5.3l1.3-2.1 4 1.9V17a2 2 0 0 1-2 2C9 19 5 15 5 9Z" />
        <circle cx="18.5" cy="5.5" r="2" fill="currentColor" opacity="0.85" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Outcomes on the call",
    body: "Meetings booked, leads qualified, and handoffs connected while the caller is still on the line — not left for someone to chase tomorrow.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="8.5" opacity="0.55" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
        <path d="M17 7l3-3M20 4h-2.5M20 4v2.5" opacity="0.7" />
      </svg>
    ),
  },
  {
    title: "Sounds like your team",
    body: "Trained on your business, your tone, and your offer. Callers feel like they reached someone who works for you — because the agent speaks for your brand, not ours.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5V14a1.5 1.5 0 0 1-1.5 1.5H11l-3.5 3.5v-3.5H5.5A1.5 1.5 0 0 1 4 14Z" />
        <path d="M9 10v1" />
        <path d="M12 8.5v4" />
        <path d="M15 10v1" />
      </svg>
    ),
  },
];

export function Pillars() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-4 sm:px-6">
      <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-emerald-400/60" />
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-300">
              What you get
            </p>
          </div>
          <h2 className="mt-5 text-balance text-3xl font-medium leading-[1.15] -tracking-[0.02em] text-white sm:text-4xl">
            Fast, accurate,{" "}
            <span className="font-accent italic font-normal text-zinc-400">
              built for voice.
            </span>
          </h2>
        </div>
        <p className="max-w-sm text-[15px] leading-[1.6] font-light text-zinc-400 md:text-right">
          Three promises your callers feel the moment they dial in — from the
          first ring to the outcome.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/6 bg-linear-to-br from-emerald-950/15 via-zinc-950/50 to-black p-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/12 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />

            <div className="relative z-10 text-emerald-400 transition-colors duration-300 group-hover:text-emerald-300 [&>svg]:h-7 [&>svg]:w-7">
              {p.icon}
            </div>

            <div className="relative z-10 mt-7 flex items-center gap-3">
              <span className="h-px w-6 bg-emerald-400/40" />
              <h3 className="text-xl font-medium leading-[1.2] -tracking-[0.02em] text-white">
                {p.title}
              </h3>
            </div>
            <p className="relative z-10 mt-3 text-[15px] leading-[1.6] font-light text-zinc-400">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

