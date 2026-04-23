"use client";

import { PASSWORD_RULES } from "@/lib/password";

export function PasswordRulesList({ password }: { password: string }) {
  return (
    <ul className="grid gap-1.5 rounded-lg border border-white/5 bg-black/30 p-3 sm:grid-cols-2">
      {PASSWORD_RULES.map((rule) => {
        const pass = rule.test(password);
        return (
          <li
            key={rule.key}
            className={
              pass
                ? "inline-flex items-center gap-2 text-[12px] text-emerald-300"
                : "inline-flex items-center gap-2 text-[12px] text-zinc-500"
            }
          >
            <span
              aria-hidden
              className={
                pass
                  ? "flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300"
                  : "flex h-4 w-4 items-center justify-center rounded-full bg-white/5 text-zinc-600"
              }
            >
              {pass ? (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <span className="h-1 w-1 rounded-full bg-zinc-600" />
              )}
            </span>
            <span>{rule.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
