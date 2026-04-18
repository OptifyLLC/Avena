"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-white/10 bg-[#080a09] pb-20 pt-24"
    >
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <CtaBlock />

        <div className="mt-24 grid gap-14 md:grid-cols-2 md:items-stretch">
          <div className="flex flex-col">
            <BrandBlock />

            <div className="mt-14 flex flex-col items-start gap-7">
              <div className="flex items-center gap-6 text-zinc-500">
                <SocialLink href="#" label="LinkedIn">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </SocialLink>
                <SocialLink href="#" label="Facebook">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </SocialLink>
                <SocialLink href="#" label="Instagram">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </SocialLink>
                <SocialLink href="mailto:hello@optifyllc.com" label="Email">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </SocialLink>
              </div>
              <div className="flex flex-col items-start gap-3 text-[14px] text-zinc-400 sm:flex-row sm:items-center sm:gap-7">
                <Link
                  href="/privacy-policy"
                  className="transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="transition-colors hover:text-white"
                >
                  Terms and Conditions
                </Link>
              </div>
            </div>

            <p className="mt-auto pt-14 text-[13px] text-zinc-500">
              All rights reserved © {new Date().getFullYear()} Optify LLC
            </p>
          </div>

          <div className="flex flex-col md:items-end md:justify-center">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </footer>
  );
}

function CtaBlock() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-950/60 bg-[#040a08] p-10 md:p-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-900/25 via-[#040a08] to-black"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-700/15 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-emerald-800/12 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/3"
      />
      <div className="relative flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-12">
        <div className="md:max-w-md">
          <h3 className="text-balance text-3xl font-semibold leading-[1.08] -tracking-[0.03em] text-white sm:text-4xl md:text-[40px]">
            Give every caller Avena.
          </h3>
          <p className="mt-5 text-[15px] leading-[1.6] text-zinc-300">
            Request access and our team will set up your workspace within a
            business day — your number ported, your calendar connected, and a
            live test call waiting the moment you&rsquo;re ready to flip the
            switch.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:items-center">
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
            className="inline-flex h-[54px] items-center justify-center gap-2 rounded-full bg-emerald-950 px-7 text-[15px] font-medium text-emerald-50 shadow-[0_0_40px_-10px_rgba(16,185,129,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-emerald-900 hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.4)]"
          >
            I already have an account
          </Link>
        </div>
      </div>
    </div>
  );
}

function BrandBlock() {
  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center font-heading text-[32px] font-semibold leading-none -tracking-[0.03em] text-white"
      >
        Avena
      </Link>
      <p className="mt-3 text-[13px] font-medium tracking-[0.02em] text-emerald-400">
        The voice layer, always on.
      </p>
    </div>
  );
}

function NewsletterForm() {
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
    <div className="w-full max-w-md md:text-right">
      <h3 className="text-balance text-[26px] font-semibold leading-[1.15] -tracking-[0.025em] text-white">
        We&rsquo;ll keep you posted on every release.
      </h3>
      <p className="mt-4 text-[14px] leading-[1.65] text-zinc-400">
        Product updates and release notes from the Optify team. Unsubscribe
        anytime — see our privacy policy for how we handle your email.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-7 flex items-center gap-3 border-b border-white/10 py-3 transition-colors focus-within:border-emerald-400/60"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Business email"
          className="flex-1 bg-transparent text-[14px] text-white placeholder:text-zinc-500 focus:outline-none md:text-left"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-emerald-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-300"
        >
          {done ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}

function SocialLink({
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
      className="text-zinc-500 transition-colors hover:text-white"
    >
      {children}
    </a>
  );
}
