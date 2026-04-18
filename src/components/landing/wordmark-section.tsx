export function WordmarkSection() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 pt-12 pb-32 md:pt-24 md:pb-48">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[15%] -z-10 h-[560px] bg-[radial-gradient(ellipse_50%_55%_at_50%_50%,rgba(16,185,129,0.2),transparent_70%)]"
      />
      <div className="relative">
        <h2 className="select-none text-balance text-center text-[clamp(5.5rem,22vw,20rem)] font-semibold leading-[0.88] -tracking-[0.06em] text-white">
          AVENA
        </h2>
        <p className="mt-6 text-center text-xl italic font-normal text-zinc-400 sm:text-2xl">
          The breath of optimization.
        </p>
      </div>

      <div className="mx-auto mt-20 grid max-w-4xl gap-14 md:grid-cols-2 md:gap-20">
        <div>
          <p className="text-[17px] italic font-normal text-zinc-400">
            &ldquo;Avena (n.)&rdquo;
          </p>
          <p className="mt-3 text-[17px] leading-[1.7] text-zinc-200">
            In the natural world, a symbol of{" "}
            <span className="text-emerald-400">nourishment and calm</span>. In
            ours, a voice that listens before it speaks — so every caller
            feels heard, not just handled.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-400">
            A · V · E · N · A
          </p>
          <p className="mt-3 text-[17px] leading-[1.7] text-zinc-300">
            <span className="text-white">
              Automated Voice Engagement &amp; Neural Assistance
            </span>{" "}
            — the technical power of Optify, with a soul. Built on Vapi,
            Twilio, and GPT-4o. Orchestrated in n8n.
          </p>
        </div>
      </div>
    </section>
  );
}
