export function WordmarkSection() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 pt-12 pb-32 md:pt-24 md:pb-48">
      <div className="relative">
        <h2 className="select-none text-balance text-center font-[family-name:var(--font-serif)] text-[clamp(5.5rem,22vw,20rem)] font-normal leading-[0.88] -tracking-[0.04em] text-white">
          AVENA
        </h2>
        <p className="mt-6 text-center font-[family-name:var(--font-serif)] text-xl italic text-zinc-400 sm:text-[26px]">
          The breath of optimization.
        </p>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-10 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent"
        />
      </div>

      <div className="mx-auto mt-20 grid max-w-4xl gap-14 md:grid-cols-2 md:gap-20">
        <div>
          <p className="font-[family-name:var(--font-serif)] text-[17px] italic text-zinc-400">
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
