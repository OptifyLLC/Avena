"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/lib/auth";
import { FloatingNav } from "@/components/landing/floating-nav";

export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    const result = await signup({ name, email, company, password });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setNeedsEmailConfirm(result.needsEmailConfirm);
    setSubmitted(true);
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#050505]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(ellipse_50%_50%_at_50%_20%,rgba(16,185,129,0.1),transparent_80%)] mix-blend-screen"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_40%_40%_at_50%_30%,rgba(255,255,255,0.03),transparent_80%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
      />

      <FloatingNav authPage authType="signup" />

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-20 pt-24 md:pt-28">
        <div className="w-full max-w-md">
          {submitted ? (
            <SuccessPanel
              firstName={name.split(" ")[0] || "there"}
              email={email}
              needsEmailConfirm={needsEmailConfirm}
            />
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-balance text-4xl font-medium leading-[1.05] -tracking-[0.025em] text-white sm:text-[42px]">
                  Tell us about{" "}
                  <span className="font-accent italic font-normal text-emerald-400/90">
                    your team
                  </span>
                  .
                </h1>
                <p className="mx-auto mt-4 max-w-sm text-[15px] leading-[1.6] font-light text-zinc-400">
                  An Optify admin will approve your workspace within one
                  business day — usually faster.
                </p>
              </div>

              <div className="mt-10 rounded-2xl border border-white/10 bg-white/2 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-sm md:p-7">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Field
                    id="name"
                    label="Full name"
                    value={name}
                    onChange={setName}
                    placeholder="Jane Cooper"
                    autoComplete="name"
                    required
                  />
                  <Field
                    id="company"
                    label="Company"
                    value={company}
                    onChange={setCompany}
                    placeholder="Acme Health"
                    autoComplete="organization"
                  />
                  <Field
                    id="email"
                    label="Work email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="jane@acme.com"
                    autoComplete="email"
                    required
                  />
                  <Field
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                  {error && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-[13px] text-rose-200">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group flex h-[50px] w-full items-center justify-center gap-2 rounded-full bg-white pl-5 pr-2 text-[15px] font-medium text-black shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-300 ease-out hover:scale-[1.01] hover:bg-zinc-100 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] disabled:opacity-60 disabled:hover:scale-100"
                  >
                    <span className="flex-1 text-center">
                      {submitting ? "Submitting…" : "Submit request"}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:translate-x-0.5">
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
                  </button>
                </form>
              </div>

              <p className="mt-8 text-center text-[12px] text-zinc-500">
                By submitting you agree to the{" "}
                <Link
                  href="/terms-and-conditions"
                  className="text-zinc-300 underline decoration-emerald-400/40 underline-offset-4 hover:decoration-emerald-400"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-zinc-300 underline decoration-emerald-400/40 underline-offset-4 hover:decoration-emerald-400"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function SuccessPanel({
  firstName,
  email,
  needsEmailConfirm,
}: {
  firstName: string;
  email: string;
  needsEmailConfirm: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/2 p-10 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
        {needsEmailConfirm ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <path d="m22 6-10 7L2 6" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </div>
      <h1 className="mt-6 text-balance text-3xl font-medium leading-[1.1] -tracking-[0.025em] text-white">
        {needsEmailConfirm ? (
          <>
            Verify your{" "}
            <span className="font-accent italic font-normal text-emerald-400/90">
              email
            </span>
            .
          </>
        ) : (
          <>
            Request{" "}
            <span className="font-accent italic font-normal text-emerald-400/90">
              received
            </span>
            .
          </>
        )}
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-[14px] leading-[1.65] text-zinc-400">
        {needsEmailConfirm ? (
          <>
            Thanks, {firstName}. We sent a confirmation link to{" "}
            <span className="text-zinc-200">{email}</span>. Click it to verify
            your address, then our team will review your workspace — usually
            within one business day.
          </>
        ) : (
          <>
            Thanks, {firstName}. Your Avena workspace is pending approval.
            You&rsquo;ll be able to sign in once our team reviews your
            request — usually within one business day.
          </>
        )}
      </p>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
        >
          Back to home
        </Link>
        <Link
          href="/login"
          className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-950 px-5 text-[14px] font-medium text-emerald-50 shadow-[0_0_30px_-10px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-900 hover:shadow-[0_0_50px_-15px_rgba(16,185,129,0.6)]"
        >
          Go to sign in
        </Link>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  minLength,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-[13px] font-medium tracking-[0.005em] text-zinc-200"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3.5 text-[14px] text-white placeholder:text-zinc-500 transition-colors focus:border-emerald-500/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
      />
    </div>
  );
}
