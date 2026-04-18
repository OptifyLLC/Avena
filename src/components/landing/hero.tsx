import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-16 md:pt-48">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(ellipse_50%_55%_at_50%_40%,rgba(16,185,129,0.16),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-5xl px-6 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[13px] font-medium text-zinc-300 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 animate-ping-slow" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Avena · Real-time voice AI
        </div>

        <h1 className="mt-8 text-balance text-5xl font-semibold leading-[1.02] -tracking-[0.035em] text-white sm:text-6xl md:text-7xl lg:text-[88px]">
          Heard,
          <br className="hidden sm:block" />{" "}
          not just{" "}
          <span className="italic font-medium text-emerald-400">
            handled
          </span>
          .
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-balance text-[17px] leading-[1.65] font-normal text-zinc-400 sm:text-lg">
          Meet Avena — the voice agent that listens, books, and qualifies every
          inbound call with the precision of an expert and the rhythm of
          natural conversation.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-white pl-6 pr-2 text-[14px] font-medium text-black transition-all hover:bg-zinc-200"
          >
            Request access
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:translate-x-1">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
          >
            Log in to dashboard
          </Link>
        </div>

        <p className="mt-6 text-[13px] font-normal text-zinc-500">
          A voice product by Optify · Approved in under 24 hours
        </p>
      </div>
    </section>
  );
}
