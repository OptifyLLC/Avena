"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }
    router.push("/dashboard");
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
        <Link
          href="/"
          className="flex items-center text-[15px] font-semibold tracking-tight text-white"
        >
          Avena
        </Link>
        <Link
          href="/signup"
          className="text-sm text-zinc-400 transition-colors hover:text-white"
        >
          Need an account?{" "}
          <span className="font-medium text-white">Request access</span>
        </Link>
      </div>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Welcome back.
            </h1>
            <p className="mt-3 text-sm text-zinc-400">
              Sign in to manage Avena.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-zinc-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-zinc-500 hover:text-white"
                  >
                    Forgot?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

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
                {submitting ? "Signing in…" : "Sign in"}
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
            </form>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-white/[0.015] p-4 text-xs text-zinc-400">
            <p className="font-medium text-zinc-200">Demo credentials</p>
            <div className="mt-2 space-y-1 font-mono">
              <p>
                Admin ·{" "}
                <span className="text-white">admin@avena.ai</span> / admin123
              </p>
              <p>
                Client ·{" "}
                <span className="text-white">client@avena.ai</span> / client123
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
