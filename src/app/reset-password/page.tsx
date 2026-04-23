"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { FloatingNav } from "@/components/landing/floating-nav";
import { PasswordRulesList } from "@/components/password-rules-list";
import { firstPasswordFailure, isPasswordStrong } from "@/lib/password";

type Phase = "checking" | "ready" | "invalid" | "done";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [supabase] = useState(() => createClient());
  const [phase, setPhase] = useState<Phase>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setPhase(data.session ? "ready" : "invalid");
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const passwordStrong = isPasswordStrong(password);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const failure = firstPasswordFailure(password);
    if (failure) {
      setError(`Password needs: ${failure.toLowerCase()}.`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    const result = await updatePassword(password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPhase("done");
    setTimeout(() => router.push("/dashboard"), 1200);
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#050505]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(ellipse_50%_50%_at_50%_20%,rgba(16,185,129,0.1),transparent_80%)] mix-blend-screen"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
      />

      <FloatingNav authPage authType="login" />

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-20 pt-24 md:pt-28">
        <div className="w-full max-w-md">
          {phase === "checking" && (
            <div className="rounded-2xl border border-white/10 bg-white/2 p-10 text-center text-sm text-zinc-400">
              Checking reset link…
            </div>
          )}

          {phase === "invalid" && (
            <div className="rounded-2xl border border-white/10 bg-white/2 p-10 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-sm">
              <h1 className="text-balance text-3xl font-medium leading-[1.1] -tracking-[0.025em] text-white">
                Link{" "}
                <span className="font-accent italic font-normal text-rose-400/90">
                  expired
                </span>
                .
              </h1>
              <p className="mx-auto mt-4 max-w-sm text-[14px] leading-[1.65] text-zinc-400">
                This reset link is invalid or has expired. Request a new one to
                continue.
              </p>
              <Link
                href="/forgot-password"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-emerald-950 px-5 text-[14px] font-medium text-emerald-50 shadow-[0_0_30px_-10px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-900 hover:shadow-[0_0_50px_-15px_rgba(16,185,129,0.6)]"
              >
                Request new link
              </Link>
            </div>
          )}

          {phase === "done" && (
            <div className="rounded-2xl border border-white/10 bg-white/2 p-10 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h1 className="mt-6 text-balance text-3xl font-medium leading-[1.1] -tracking-[0.025em] text-white">
                Password{" "}
                <span className="font-accent italic font-normal text-emerald-400/90">
                  updated
                </span>
                .
              </h1>
              <p className="mx-auto mt-4 max-w-sm text-[14px] leading-[1.65] text-zinc-400">
                Redirecting you to your dashboard…
              </p>
            </div>
          )}

          {phase === "ready" && (
            <>
              <div className="text-center">
                <h1 className="text-balance text-4xl font-medium leading-[1.05] -tracking-[0.025em] text-white sm:text-[42px]">
                  Pick a new{" "}
                  <span className="font-accent italic font-normal text-emerald-400/90">
                    password
                  </span>
                  .
                </h1>
                <p className="mx-auto mt-4 max-w-sm text-[15px] leading-[1.6] font-light text-zinc-400">
                  Mix upper, lower, numbers, and a symbol. You&rsquo;ll stay signed in after saving.
                </p>
              </div>

              <div className="mt-10 rounded-2xl border border-white/10 bg-white/2 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-sm md:p-7">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-[13px] font-medium tracking-[0.005em] text-zinc-200">
                      New password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Mix letters, numbers, and a symbol"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3.5 text-[14px] text-white placeholder:text-zinc-500 transition-colors focus:border-emerald-500/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
                    />
                  </div>
                  <PasswordRulesList password={password} />
                  <div className="space-y-2">
                    <label htmlFor="confirm" className="text-[13px] font-medium tracking-[0.005em] text-zinc-200">
                      Confirm password
                    </label>
                    <input
                      id="confirm"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Type it again"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3.5 text-[14px] text-white placeholder:text-zinc-500 transition-colors focus:border-emerald-500/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-[13px] text-rose-200">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !passwordStrong || password !== confirm}
                    className="group flex h-[50px] w-full items-center justify-center gap-2 rounded-full bg-white pl-5 pr-2 text-[15px] font-medium text-black shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-300 ease-out hover:scale-[1.01] hover:bg-zinc-100 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] disabled:opacity-60 disabled:hover:scale-100"
                  >
                    <span className="flex-1 text-center">
                      {submitting ? "Saving…" : "Save new password"}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:translate-x-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
