"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

const links = [
  { label: "About", href: "/#about" },
  { label: "Dashboard", href: "/#product" },
  { label: "Modules", href: "/#modules" },
  { label: "Contact", href: "/#contact" },
];

export function FloatingNav({
  authPage = false,
  authType,
}: {
  authPage?: boolean;
  authType?: "login" | "signup";
} = {}) {
  const { user, hydrated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header
        className={
          "fixed inset-x-0 z-50 flex justify-center px-4 transition-all duration-500 ease-out top-4 md:top-6"
        }
      >
        <nav
          className={
            "flex w-full items-center justify-between rounded-full border py-1.5 pl-6 pr-1.5 transition-all duration-500 ease-out " +
            (scrolled
              ? "max-w-5xl border-white/8 bg-zinc-950/80 shadow-[0_0_30px_-5px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
              : "max-w-6xl border-transparent bg-transparent shadow-none backdrop-blur-0")
          }
        >
          <Link
            href="/"
            aria-label="Avena home"
            className="inline-flex items-center"
          >
            <span className="text-[22px] font-semibold -tracking-[0.02em] text-white hover:text-white/80 transition-colors">
              Avena
            </span>
          </Link>

          {/* Desktop Links */}
          {!authPage && (
            <div className="hidden md:flex items-center gap-8">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-[15px] font-medium -tracking-[0.005em] text-zinc-300 transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            {authPage && (
              <span className="hidden text-[14px] text-zinc-400 sm:block">
                {authType === "login" ? "New here?" : "Already have an account?"}
              </span>
            )}
            <Link
              href={
                authPage
                  ? authType === "login"
                    ? "/signup"
                    : "/login"
                  : hydrated && user
                    ? "/dashboard"
                    : "/signup"
              }
              className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-[15px] font-medium tracking-tight text-black shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105 hover:bg-zinc-100 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.6)] active:scale-95"
            >
              {authPage
                ? authType === "login"
                  ? "Sign up"
                  : "Sign in"
                : hydrated && user
                  ? "Dashboard"
                  : "Get Started"}
            </Link>
            {!authPage && (
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="flex h-10 w-10 md:hidden items-center justify-center rounded-full text-white transition-colors hover:bg-white/6"
              >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                {open ? (
                  <>
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </>
                ) : (
                  <>
                    <path d="M4 8h16" />
                    <path d="M4 16h16" />
                  </>
                )}
              </svg>
            </button>
            )}
          </div>
        </nav>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      aria-hidden={!open}
      className={
        "fixed inset-0 z-40 flex flex-col items-center justify-center px-6 transition-all duration-500 " +
        (open
          ? "pointer-events-auto bg-black/90 opacity-100 backdrop-blur-2xl"
          : "pointer-events-none bg-black/0 opacity-0")
      }
      onClick={onClose}
    >
      <nav
        className="flex flex-col items-center gap-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={onClose}
            className={
              "text-3xl font-semibold -tracking-[0.025em] text-white/90 transition-all duration-500 hover:text-white sm:text-4xl " +
              (open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")
            }
            style={{ transitionDelay: open ? `${i * 60 + 100}ms` : "0ms" }}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div
        className={
          "mt-14 flex flex-col items-center gap-4 text-center transition-opacity duration-500 " +
          (open ? "opacity-100" : "opacity-0")
        }
        style={{ transitionDelay: open ? "360ms" : "0ms" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Link
          href="/login"
          onClick={onClose}
          className="text-[14px] font-medium text-zinc-400 transition-colors hover:text-white"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
