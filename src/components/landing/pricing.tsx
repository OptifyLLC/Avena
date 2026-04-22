type Tier = {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  description: string;
  minutes: string;
  overage: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Starter",
    price: "$499",
    period: "/month",
    tagline: "Test the waters",
    description:
      "For solo agents and small teams putting an AI voice on their number for the first time.",
    minutes: "300 minutes included",
    overage: "$0.45 / min after",
    features: [
      "Dedicated phone number",
      "1 AI agent — standard persona",
      "Knowledge base up to 10 Q&A pairs",
      "Self-serve setup",
      "Email support",
    ],
    cta: "Book a demo",
  },
  {
    name: "Growth",
    price: "$899",
    period: "/month",
    tagline: "Most popular",
    description:
      "For brokerages running real inbound volume and ready to invest in deep tuning.",
    minutes: "1,000 minutes included",
    overage: "$0.40 / min after",
    features: [
      "Dedicated phone number",
      "1 AI agent — brand voice + tone tuning",
      "Unlimited knowledge base",
      "Monthly prompt review session",
      "Live onboarding call",
      "Priority support",
    ],
    cta: "Book a demo",
    featured: true,
  },
  {
    name: "Scale",
    price: "Custom",
    tagline: "Multi-office teams",
    description:
      "For brokerages operating multiple offices or high-volume inbound lines.",
    minutes: "Unlimited minutes",
    overage: "Volume rates from $0.35 / min",
    features: [
      "Multi-location agent deployment",
      "Voice cloning + deep persona work",
      "Custom workflow integrations",
      "Dedicated account manager",
      "White-glove setup + SLA",
    ],
    cta: "Talk to founders",
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative mx-auto w-full max-w-7xl px-4 py-28 sm:px-6 md:py-36 scroll-mt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[10%] -z-10 h-[500px] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(16,185,129,0.06),transparent_80%)] mix-blend-screen"
      />

      <div className="mx-auto max-w-3xl text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-emerald-400/60" />
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-300">
            Founding customer pricing
          </p>
          <span className="h-px w-8 bg-emerald-400/60" />
        </div>
        <h2 className="mt-5 text-balance text-3xl font-medium leading-[1.15] -tracking-[0.02em] text-white sm:text-4xl md:text-5xl">
          Pay for what you pick up.{" "}
          <span className="font-accent italic font-normal text-zinc-400">
            More calls, more credit.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.6] font-light text-zinc-400">
          Priced by the minute your AI is on a live call. One booked showing
          covers the month — and the more calls you run, the better your rate.
        </p>
      </div>

      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <TierCard key={tier.name} tier={tier} />
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-[13px] leading-[1.6] text-zinc-500">
        Pricing covers platform usage and dashboard access. Minutes are billed
        only when your AI is on a live call. Workspace setup, number porting,
        and a live test call are included with every plan.
      </p>
    </section>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  return (
    <div
      className={
        "relative flex flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-500 ease-out hover:-translate-y-1 " +
        (tier.featured
          ? "border-emerald-500/30 bg-linear-to-br from-emerald-950/40 via-zinc-950/60 to-black shadow-[0_0_60px_-20px_rgba(16,185,129,0.35)]"
          : "border-white/6 bg-linear-to-br from-emerald-950/10 via-zinc-950/50 to-black hover:border-white/12")
      }
    >
      {tier.featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_60%)]"
        />
      )}

      <div className="relative z-10 flex items-center justify-between">
        <h3 className="text-lg font-medium -tracking-[0.01em] text-white">
          {tier.name}
        </h3>
        {tier.featured && (
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
            {tier.tagline}
          </span>
        )}
      </div>
      {!tier.featured && (
        <p className="relative z-10 mt-1 text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-500">
          {tier.tagline}
        </p>
      )}

      <div className="relative z-10 mt-6 flex items-baseline gap-1">
        <span className="text-5xl font-semibold -tracking-[0.03em] text-white">
          {tier.price}
        </span>
        {tier.period && (
          <span className="text-[15px] font-light text-zinc-400">
            {tier.period}
          </span>
        )}
      </div>

      <p className="relative z-10 mt-4 text-[14px] leading-[1.6] font-light text-zinc-400">
        {tier.description}
      </p>

      <div className="relative z-10 mt-6 rounded-xl border border-white/8 bg-white/2 p-4">
        <div className="flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-emerald-400"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p className="text-[13px] font-medium text-white">{tier.minutes}</p>
        </div>
        <p className="mt-1.5 pl-6 text-[12px] text-zinc-500">
          {tier.overage}
        </p>
      </div>

      <ul className="relative z-10 mt-6 space-y-3 border-t border-white/5 pt-6">
        {tier.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-3 text-[14px] leading-[1.5] text-zinc-300"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0 text-emerald-400"
              aria-hidden
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="relative z-10 mt-5 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 shrink-0 text-emerald-400"
          aria-hidden
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <div>
          <p className="text-[13px] font-medium text-emerald-100">
            Full dashboard included
          </p>
          <p className="mt-1 text-[12px] leading-[1.5] text-emerald-200/70">
            Call log · Calendar booking · Lead scoring · SMS confirmation · AI
            summary · CSV export
          </p>
        </div>
      </div>

      <a
        href="https://calendly.com/tawhid-chowdhury/30min"
        target="_blank"
        rel="noopener noreferrer"
        className={
          "relative z-10 mt-8 inline-flex h-12 items-center justify-center rounded-full text-[14px] font-medium transition-all duration-300 ease-out hover:scale-[1.02] " +
          (tier.featured
            ? "bg-white text-black shadow-[0_0_30px_-8px_rgba(255,255,255,0.4)] hover:bg-zinc-100 hover:shadow-[0_0_45px_-10px_rgba(255,255,255,0.6)]"
            : "border border-white/10 bg-white/3 text-white hover:border-white/20 hover:bg-white/6")
        }
      >
        {tier.cta}
      </a>
    </div>
  );
}

