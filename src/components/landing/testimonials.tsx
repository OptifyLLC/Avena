type Testimonial = {
  quote: string;
  name: string;
  role: string;
  org: string;
  initials: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "I used to lose weekend showings because I was busy. Now Operavo books them while I'm out. Seven showings landed the first week.",
    name: "Sarah Lin",
    role: "Independent Agent",
    org: "Bay Area",
    initials: "SL",
  },
  {
    quote:
      "Our agents stopped fielding basic listing questions. By the time a call hits us, the lead is qualified and the slot is on the calendar.",
    name: "Marcus Reid",
    role: "Team Lead",
    org: "Reid Realty Group",
    initials: "MR",
  },
  {
    quote:
      "We tested it on our overflow line for two weeks. It paid for itself in showings booked after 6pm. The team won't let us turn it off.",
    name: "Avery Park",
    role: "Broker",
    org: "Atlas Properties",
    initials: "AP",
  },
];

export function Testimonials() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-28 sm:px-6 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[10%] -z-10 h-[500px] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(16,185,129,0.05),transparent_80%)] mix-blend-screen"
      />

      <div className="mx-auto max-w-3xl text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-emerald-400/60" />
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-300">
            From the line
          </p>
          <span className="h-px w-8 bg-emerald-400/60" />
        </div>
        <h2 className="mt-5 text-balance text-3xl font-medium leading-[1.15] -tracking-[0.02em] text-white sm:text-4xl md:text-5xl">
          Real teams,{" "}
          <span className="font-accent italic font-normal text-zinc-400">
            real outcomes.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.6] font-light text-zinc-400">
          Independent agents and brokerages running Operavo on their inbound
          line.
        </p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/6 bg-linear-to-br from-emerald-950/15 via-zinc-950/50 to-black p-7 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/12 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />

            <svg
              className="relative z-10 h-7 w-7 text-emerald-400/70"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M9.4 6.5c-3 1.3-5.4 3.8-5.4 7.8V18h6v-6H6.7c.3-2.2 1.8-3.7 4-4.6L9.4 6.5zm10 0c-3 1.3-5.4 3.8-5.4 7.8V18h6v-6h-3.3c.3-2.2 1.8-3.7 4-4.6L19.4 6.5z" />
            </svg>

            <blockquote className="relative z-10 mt-5 flex-1 text-[15px] leading-[1.7] text-zinc-200">
              {t.quote}
            </blockquote>

            <figcaption className="relative z-10 mt-7 flex items-center gap-3 border-t border-white/5 pt-5">
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[12px] font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-500/20"
              >
                {t.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {t.name}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {t.role} · {t.org}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
