import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-16 md:pt-48">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[800px] bg-[radial-gradient(ellipse_50%_50%_at_50%_30%,rgba(16,185,129,0.08),transparent_80%)] mix-blend-screen"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_40%_40%_at_50%_40%,rgba(255,255,255,0.03),transparent_80%)]"
      />

      <div className="relative mx-auto w-full max-w-5xl px-6 text-center">
        <h1 className="text-balance text-5xl font-medium leading-[1.05] -tracking-[0.02em] text-white sm:text-6xl md:text-7xl">
          Never miss another{" "}
          <span className="font-accent italic font-normal text-emerald-400/90">
            lead
          </span>
          ,
          <br className="hidden sm:block" />{" "}
          even after hours.
        </h1>

        <p className="mx-auto mt-12 max-w-2xl text-balance text-lg leading-[1.6] font-light text-zinc-400 sm:text-xl md:mt-14">
          Avena is a real-time voice agent for your inbound calls, live with
          real estate teams today and rolling out to clinics, law firms, and
          agencies next.
        </p>

        <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-16">
          <Link
            href="/signup"
            className="group inline-flex h-[54px] items-center gap-2.5 rounded-full bg-white pl-7 pr-2 text-[15px] font-medium text-black shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-zinc-100 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]"
          >
            Request access
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:translate-x-0.5">
              <svg
                width="16"
                height="16"
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
            className="inline-flex h-[54px] items-center gap-2 rounded-full bg-emerald-950 px-7 text-[15px] font-medium text-emerald-50 shadow-[0_0_40px_-10px_rgba(16,185,129,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-emerald-900 hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.4)]"
          >
            Log in to dashboard
          </Link>
        </div>

      </div>
    </section>
  );
}
