import type { ReactNode } from "react";

const steps: Array<{ title: string; body: string; icon: ReactNode }> = [
  {
    title: "Answer",
    body: "Picks up every time, day or night. No rings out, no voicemail, no missed leads.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M5 4.5h2.6l1.9 4-2.1 1.3a12 12 0 0 0 5.3 5.3l1.3-2.1 4 1.9V17a2 2 0 0 1-2 2C9 19 5 15 5 9Z" />
        <circle
          cx="18.5"
          cy="5.5"
          r="2"
          fill="currentColor"
          stroke="none"
          opacity="0.85"
        />
      </svg>
    ),
  },
  {
    title: "Qualify",
    body: "Asks the right questions, listens for intent, and gauges fit before anything reaches your team.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3.5 5h17l-6.5 8v5.5L10 16.5V13z" />
      </svg>
    ),
  },
  {
    title: "Book",
    body: "Checks your calendar live and confirms a slot out loud, all before the caller hangs up.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
        <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
        <path d="m9 14.5 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Summarize",
    body: "Sends transcript, lead score, and a one-line recap to your dashboard the moment the call ends.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 3.5h8.5L19 8V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V5A1.5 1.5 0 0 1 6 3.5Z" />
        <path d="M14 3.5V8h5" />
        <path d="M8 12h8M8 15h8M8 18h5" />
      </svg>
    ),
  },
];

export function WordmarkSection() {
  return (
    <section
      id="about"
      className="relative mx-auto w-full max-w-7xl px-6 pt-12 pb-32 md:pt-24 md:pb-48 scroll-mt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[15%] -z-10 h-[560px] bg-[radial-gradient(ellipse_50%_55%_at_50%_50%,rgba(16,185,129,0.2),transparent_70%)]"
      />

      <div className="relative">
        <h2
          className="select-none text-balance text-center text-[clamp(3.5rem,15vw,14rem)] font-semibold leading-[0.88] -tracking-[0.06em] text-white"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
          }}
        >
          OPERAVO
        </h2>
      </div>

      <div className="mx-auto mt-20 max-w-6xl md:mt-28">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-emerald-400/60" />
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-300">
                How Operavo works
              </p>
            </div>
            <h3 className="mt-5 text-balance text-3xl font-medium leading-[1.15] -tracking-[0.02em] text-white sm:text-4xl">
              Every call,{" "}
              <span className="font-accent italic font-normal text-zinc-400">
                handled end to end.
              </span>
            </h3>
          </div>
          <p className="max-w-[280px] text-[15px] leading-[1.6] font-light text-zinc-400 md:text-right">
            Four jobs Operavo does on every inbound call.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/6 bg-linear-to-br from-emerald-950/15 via-zinc-950/50 to-black p-7 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/12 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="relative z-10 flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Step 0{i + 1}
                </span>
                <span className="text-emerald-400/80 transition-colors duration-300 group-hover:text-emerald-300 [&>svg]:h-5 [&>svg]:w-5">
                  {step.icon}
                </span>
              </div>

              <div className="relative z-10 mt-8 flex items-center gap-3">
                <span className="h-px w-6 bg-emerald-400/40" />
                <h4 className="text-xl font-medium leading-[1.2] -tracking-[0.02em] text-white">
                  {step.title}
                </h4>
              </div>
              <p className="relative z-10 mt-3 text-[15px] leading-[1.6] font-light text-zinc-400">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
