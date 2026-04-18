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
          className="select-none text-balance text-center text-[clamp(5.5rem,22vw,20rem)] font-semibold leading-[0.88] -tracking-[0.06em] text-white"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
          }}
        >
          AVENA
        </h2>
        <p className="mt-6 text-center text-lg font-normal text-emerald-400 sm:text-xl">
          Automated Voice Engagement &amp; Neural Assistance
        </p>
      </div>

      <div className="mx-auto mt-20 max-w-xl md:mt-28">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-white/8 pb-4">
          <span className="font-mono text-[13px] text-zinc-500">
            | əˈviːnə |
          </span>
          <span className="font-accent text-sm italic text-zinc-400">
            noun
          </span>
          <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600">
            Latin origin
          </span>
        </div>

        <ol className="mt-8 space-y-9">
          <li className="flex gap-5">
            <span className="shrink-0 font-mono text-[13px] font-medium text-emerald-400">
              1.
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Botanical
              </p>
              <p className="mt-2 text-[15px] leading-[1.75] text-zinc-200">
                A genus of the oat family. Historically regarded as a quiet
                symbol of{" "}
                <span className="text-emerald-400">
                  nourishment and calm
                </span>
                .
              </p>
            </div>
          </li>

          <li className="flex gap-5">
            <span className="shrink-0 font-mono text-[13px] font-medium text-emerald-400">
              2.
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Product, by Optify
              </p>
              <p className="mt-2 text-[15px] leading-[1.75] text-zinc-200">
                A real-time voice agent that answers, qualifies, and books
                every inbound call. Built so every caller feels heard, not
                handled.
              </p>
              <p className="mt-4 border-l-2 border-emerald-400/40 pl-4 font-accent text-[15px] italic text-zinc-400">
                &ldquo;Every business runs on the calls it can&rsquo;t
                afford to miss.&rdquo;
              </p>
            </div>
          </li>
        </ol>

      </div>
    </section>
  );
}
