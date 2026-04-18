"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { FloatingNav } from "@/components/landing/floating-nav";
import { SiteFooter } from "@/components/landing/site-footer";

export type LegalSection = {
  id: string;
  title: string;
  body: ReactNode;
};

export function LegalLayout({
  eyebrow,
  title,
  lede,
  lastUpdated,
  sections,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  lastUpdated: string;
  sections: LegalSection[];
}) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const ticking = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      ticking.current = false;
      const offset = 160; // anchor line near top of viewport
      let current = sections[0]?.id ?? "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - offset <= 0) {
          current = s.id;
        } else {
          break;
        }
      }
      setActive(current);
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  return (
    <div className="relative min-h-screen bg-[#050505]">
      <FloatingNav />

      <section className="relative overflow-hidden pt-36 pb-12 md:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(ellipse_50%_50%_at_50%_20%,rgba(16,185,129,0.08),transparent_80%)] mix-blend-screen"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_40%_40%_at_50%_30%,rgba(255,255,255,0.03),transparent_80%)]"
        />

        <div className="relative mx-auto w-full max-w-4xl px-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <span className="h-px w-8 bg-emerald-400/60" />
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-300">
              {eyebrow}
            </p>
          </div>

          <h1 className="mt-10 text-balance text-4xl font-medium leading-[1.05] -tracking-[0.025em] text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>

          <p className="mt-7 max-w-2xl text-balance text-[17px] leading-[1.65] font-light text-zinc-400 md:text-[18px]">
            {lede}
          </p>

          <p className="mt-8 text-[13px] text-zinc-500">
            Last updated {lastUpdated} · Optify LLC · Avena
          </p>
        </div>
      </section>

      <main className="relative">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-24 md:grid-cols-[240px_1fr] md:items-start md:gap-16 md:pb-32">
          <aside className="hidden md:sticky md:top-28 md:block md:max-h-[calc(100vh-8rem)] md:self-start md:overflow-y-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              On this page
            </p>
            <ol className="mt-5 space-y-2.5 border-l border-white/10 pl-4">
              {sections.map((s, i) => {
                const isActive = active === s.id;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={
                        "flex items-start gap-2 text-[13px] leading-[1.5] transition-colors " +
                        (isActive
                          ? "text-white"
                          : "text-zinc-500 hover:text-zinc-200")
                      }
                    >
                      <span
                        className={
                          "mt-0.5 font-mono text-[10px] " +
                          (isActive ? "text-emerald-400" : "text-zinc-600")
                        }
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </aside>

          <article className="min-w-0">
            <div className="space-y-16 md:space-y-20">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-28">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] font-medium text-emerald-400/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-balance text-2xl font-semibold leading-[1.2] -tracking-[0.02em] text-white sm:text-[28px]">
                      {s.title}
                    </h2>
                  </div>
                  <div className="prose-legal mt-5 space-y-4 text-[15px] leading-[1.75] text-zinc-300">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-20 border-t border-white/10 pt-10">
              <h3 className="text-[20px] font-semibold -tracking-[0.015em] text-white">
                Questions about this page?
              </h3>
              <p className="mt-3 max-w-xl text-[15px] leading-[1.7] text-zinc-400">
                Email{" "}
                <a
                  href="mailto:legal@optifyllc.com"
                  className="text-zinc-200 underline decoration-zinc-600 underline-offset-4 hover:text-white hover:decoration-zinc-300"
                >
                  legal@optifyllc.com
                </a>{" "}
                or write to Optify LLC, 1007 N Orange St, 4th Floor, Suite
                #1382, Wilmington, DE 19801, United States. We respond to
                legal and privacy requests within 30 days.
              </p>
            </div>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="space-y-2.5 border-t border-white/5 pt-4">{children}</ul>
  );
}

export function LI({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-3 text-[15px] leading-[1.65] text-zinc-300">
      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
      <span className="min-w-0">
        {label && (
          <span className="font-medium text-white">{label}. </span>
        )}
        {children}
      </span>
    </li>
  );
}

export function Callout({
  tone = "emerald",
  title,
  children,
}: {
  tone?: "emerald" | "amber";
  title?: string;
  children: ReactNode;
}) {
  const styles =
    tone === "amber"
      ? "border-amber-500/25 bg-amber-500/6 text-amber-100"
      : "border-emerald-500/30 bg-emerald-500/8 text-emerald-50";
  const accent = tone === "amber" ? "text-amber-300" : "text-emerald-300";
  return (
    <div className={"rounded-xl border px-4 py-4 text-[14px] leading-[1.6] " + styles}>
      {title && (
        <p
          className={
            "mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] " +
            accent
          }
        >
          {title}
        </p>
      )}
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function Strong({ children }: { children: ReactNode }) {
  return <span className="font-medium text-white">{children}</span>;
}
