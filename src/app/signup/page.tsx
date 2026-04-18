"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/logo";

export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    const result = signup({ name, email, company, password });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#050505]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(16,185,129,0.1),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_70%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-[15px] font-semibold tracking-tight text-white">
            Avena
          </span>
        </Link>
        <Link
          href="/login"
          className="text-sm text-zinc-400 transition-colors hover:text-white"
        >
          Already have an account?{" "}
          <span className="font-medium text-white">Sign in</span>
        </Link>
      </div>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          {submitted ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center backdrop-blur-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white">
                Request received
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-400">
                Thanks, {name.split(" ")[0] || "there"}. Your Avena workspace
                is pending approval. You&rsquo;ll be able to sign in once our
                team reviews your request — usually within one business day.
              </p>
              <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Link
                  href="/"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm text-white transition-colors hover:bg-white/10"
                >
                  Back to home
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
                >
                  Go to sign in
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                  Request access.
                </h1>
                <p className="mt-3 text-sm text-zinc-400">
                  Tell us about yourself. An admin will approve your workspace.
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Field
                    id="name"
                    label="Full name"
                    value={name}
                    onChange={setName}
                    placeholder="Jane Cooper"
                    required
                  />
                  <Field
                    id="company"
                    label="Company"
                    value={company}
                    onChange={setCompany}
                    placeholder="Acme Health"
                  />
                  <Field
                    id="email"
                    label="Work email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="jane@acme.com"
                    required
                  />
                  <Field
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="At least 6 characters"
                    minLength={6}
                    required
                  />

                  {error && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-200">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-medium text-black transition-all hover:bg-zinc-200 disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : "Submit request"}
                    {!submitting && (
                      <svg
                        className="transition-transform group-hover:translate-x-0.5"
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
                    )}
                  </button>

                  <p className="text-center text-xs text-zinc-500">
                    By submitting you agree to the Optify terms of service.
                  </p>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
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
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-zinc-200">
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
        className="h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      />
    </div>
  );
}
