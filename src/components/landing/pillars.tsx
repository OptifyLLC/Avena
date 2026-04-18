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
    <section className="relative border-y border-white/5 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent py-28 md:py-36">
      <div className="mx-auto w-full max-w-6xl px-6">
        <h2 className="text-balance text-center text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Fast.{" "}
          <span className="font-[family-name:var(--font-serif)] italic font-normal text-zinc-400">
            Accurate.
          </span>
          <br className="hidden sm:block" />
          Built for voice.
        </h2>

        <div className="mx-auto mt-20 grid gap-10 md:grid-cols-3 md:gap-12">
          {pillars.map((p) => (
            <div key={p.title} className="group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.01] text-emerald-400 transition-colors group-hover:border-emerald-500/30 group-hover:text-emerald-300">
                {p.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">
                {p.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-zinc-400">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
