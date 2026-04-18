"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const productLinks = [
  { label: "Dashboard", href: "#product" },
  { label: "Modules", href: "#modules" },
  { label: "Integrations", href: "#product" },
  { label: "Roadmap", href: "#" },
];

const companyLinks = [
  { label: "About", href: "#about" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#contact" },
];

const resourcesLinks = [
  { label: "Documentation", href: "#" },
  { label: "Changelog", href: "#" },
  { label: "Status", href: "#" },
  { label: "Privacy", href: "#" },
];

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-white/5 bg-[#050505] pt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(16,185,129,0.12),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <CtaBlock />

        <div className="mt-24 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-[16px] font-semibold -tracking-[0.015em] text-white"
            >
              Avena
            </Link>
            <p className="mt-5 max-w-sm text-[15px] leading-[1.65] text-zinc-400">
              Avena is the voice layer for inbound calls — a product by Optify
              for teams that can&rsquo;t afford to miss one.
            </p>
            <Subscribe />
          </div>
          <LinkColumn title="Product" links={productLinks} />
          <LinkColumn title="Company" links={companyLinks} />
          <LinkColumn title="Resources" links={resourcesLinks} />
        </div>

        <div className="mt-20 flex flex-col items-start gap-4 border-t border-white/5 pt-8 text-[13px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Optify LLC. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="mailto:hello@optifyllc.com" className="hover:text-zinc-200">
              hello@optifyllc.com
            </a>
            <SocialIcon href="#" label="X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2H21.5l-7.54 8.62L23 22h-6.86l-5.37-6.56L4.6 22H1.34l8.1-9.26L1 2h7.03l4.84 5.96L18.244 2Zm-2.4 18h1.96L7.2 4h-2L15.844 20Z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="#" label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1s2.48 1.12 2.48 2.5ZM.22 8h4.56v14H.22V8Zm7.3 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.48 3.04 5.48 6.99V22h-4.56v-6.16c0-1.47-.03-3.37-2.05-3.37-2.05 0-2.37 1.6-2.37 3.27V22H7.52V8Z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="#" label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.91c.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.27-5.23-5.67 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a11 11 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
}

function CtaBlock() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-900/40 via-zinc-950 to-black p-10 md:p-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl"
      />
      <div className="relative">
        <h3 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.05] -tracking-[0.03em] text-white sm:text-5xl md:text-6xl">
          Give every caller Avena.
        </h3>
        <p className="mt-5 max-w-xl text-lg leading-[1.6] text-zinc-300 sm:text-xl">
          Request access and our team will provision your Avena workspace
          within a business day.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-white pl-6 pr-2 text-[14px] font-medium text-black transition-all hover:bg-zinc-200"
          >
            Request access
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:translate-x-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
          >
            I already have an account
          </Link>
        </div>
      </div>
    </div>
  );
}

function Subscribe() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 2500);
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex max-w-sm gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="h-10 flex-1 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      />
      <button
        type="submit"
        className="h-10 shrink-0 rounded-full bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
      >
        {done ? "Subscribed ✓" : "Subscribe"}
      </button>
    </form>
  );
}

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {title}
      </p>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="group inline-flex items-center gap-1.5 text-[14px] text-zinc-300 transition-colors hover:text-white"
            >
              {l.label}
              <svg
                className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-70 group-hover:translate-x-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      {children}
    </a>
  );
}

