import type { ReactNode } from "react";

const pillars: Array<{ title: string; body: string; icon: ReactNode }> = [
  {
    title: "Instant response",
    body: "Sub-500ms speech-to-text with mid-call intent routing. The caller never hears a pause.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
      </svg>
    ),
  },
  {
    title: "Actions, not scripts",
    body: "n8n fires real workflows mid-call — calendar bookings, SMS confirmations, live transfers.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h16M4 12h10M4 17h16" />
        <circle cx="18" cy="12" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Multi-tenant by default",
    body: "Every client gets isolated data, isolated calendars, and their own agent persona. No duplicated workflows.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export function Pillars() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[15%] h-[460px] bg-[radial-gradient(ellipse_45%_60%_at_50%_30%,rgba(16,185,129,0.16),transparent_70%)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <h2 className="text-balance text-center text-4xl font-semibold leading-[1.05] -tracking-[0.03em] text-white sm:text-5xl md:text-6xl">
          Fast.{" "}
          <span className="italic font-medium text-zinc-400">
            Accurate.
          </span>
          <br className="hidden sm:block" />
          Built for voice.
        </h2>

        <div className="mx-auto mt-20 grid gap-10 md:grid-cols-3 md:gap-12">
          {pillars.map((p) => (
            <div key={p.title} className="group">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-white/5 to-white/[0.01] text-emerald-400 shadow-[0_0_40px_-10px_rgba(16,185,129,0.35)] transition-all group-hover:border-emerald-500/40 group-hover:text-emerald-300 group-hover:shadow-[0_0_60px_-8px_rgba(16,185,129,0.55)]">
                {p.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold -tracking-[0.015em] text-white">
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.65] text-zinc-400">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
