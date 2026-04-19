"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { FloatingNav } from "@/components/landing/floating-nav";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const authErr = search.get("auth_error");
    if (authErr) setError(authErr);
  }, [search]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(email, password);
    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    if (result.user.role !== "admin" && result.user.status !== "approved") {
      router.push("/pending");
      return;
    }
    const nextUrl = new URLSearchParams(window.location.search).get("next") || "/dashboard";
    router.push(nextUrl);
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

      <FloatingNav authPage authType="login" />

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-20 pt-24 md:pt-28">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-balance text-4xl font-medium leading-[1.05] -tracking-[0.025em] text-white sm:text-[42px]">
              Welcome{" "}
              <span className="font-accent italic font-normal text-emerald-400/90">
                back
              </span>
              .
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-[15px] leading-[1.6] font-light text-zinc-400">
              Open your dashboard, pick up where the last call left off.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/2 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-sm md:p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
              <Field
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                trailing={
                  <Link
                    href="/forgot-password"
                    className="text-[12px] text-zinc-500 transition-colors hover:text-zinc-200"
                  >
                    Forgot?
                  </Link>
                }
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
                  {submitting ? "Signing in…" : "Sign in"}
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
            By signing in you agree to the{" "}
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
  autoComplete,
  trailing,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[13px] font-medium tracking-[0.005em] text-zinc-200"
        >
          {label}
        </label>
        {trailing}
      </div>
      <input
        id={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3.5 text-[14px] text-white placeholder:text-zinc-500 transition-colors focus:border-emerald-500/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
      />
    </div>
  );
}
