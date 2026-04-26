const faqs: Array<{ q: string; a: string }> = [
  {
    q: "How fast can we go live?",
    a: "Most teams are up in 2 to 3 business days. We handle the workspace, number porting, and a live test call before we hand it over.",
  },
  {
    q: "Can I keep my existing phone number?",
    a: "Yes. We port your number so callers reach the same line. Operavo picks up before the ring goes through.",
  },
  {
    q: "Will it sound like a robot?",
    a: "No. The agent is tuned to your tone, your offer, and your pace. Most callers don't realize they're speaking to AI.",
  },
  {
    q: "What happens if a caller asks for a person?",
    a: "Operavo bridges the call to your team in seconds, with full context. If no one picks up, the caller is promised a callback rather than dropped.",
  },
  {
    q: "Does Operavo work with my calendar?",
    a: "Yes. Operavo checks Google Calendar live as the call runs and confirms the slot out loud before the caller hangs up.",
  },
  {
    q: "What do I get after each call?",
    a: "A full transcript, a lead score, and a one-line recap delivered to your dashboard the moment the call ends.",
  },
  {
    q: "Is there a long-term contract?",
    a: "Monthly billing, cancel any time. The Scale plan offers a custom term if you prefer one.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="relative mx-auto w-full max-w-7xl px-4 py-28 sm:px-6 md:py-36 scroll-mt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[10%] -z-10 h-[500px] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(16,185,129,0.05),transparent_80%)] mix-blend-screen"
      />

      <div className="mx-auto max-w-3xl text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-emerald-400/60" />
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-300">
            Common questions
          </p>
          <span className="h-px w-8 bg-emerald-400/60" />
        </div>
        <h2 className="mt-5 text-balance text-3xl font-medium leading-[1.15] -tracking-[0.02em] text-white sm:text-4xl md:text-5xl">
          Quick answers,{" "}
          <span className="font-accent italic font-normal text-zinc-400">
            before you book.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.6] font-light text-zinc-400">
          The things teams ask most before they put Operavo on their line.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-3xl divide-y divide-white/8 border-y border-white/8">
        {faqs.map((faq) => (
          <details key={faq.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 transition-colors [&::-webkit-details-marker]:hidden">
              <h3 className="text-[16px] font-medium -tracking-[0.01em] text-white sm:text-[17px]">
                {faq.q}
              </h3>
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/3 text-zinc-400 transition-all duration-300 group-hover:border-emerald-400/40 group-hover:text-emerald-300 group-open:rotate-180 group-open:border-emerald-400/40 group-open:bg-emerald-500/10 group-open:text-emerald-300"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </summary>
            <p className="pb-7 pr-12 text-[15px] leading-[1.7] font-light text-zinc-400">
              {faq.a}
            </p>
          </details>
        ))}
      </div>

      <p className="mx-auto mt-12 max-w-xl text-center text-[13px] leading-[1.6] text-zinc-500">
        Still have questions?{" "}
        <a
          href="https://calendly.com/tawhid-chowdhury/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 transition-colors hover:text-emerald-300"
        >
          Book a 30-minute demo
        </a>{" "}
        and we&apos;ll walk through your numbers live.
      </p>
    </section>
  );
}
