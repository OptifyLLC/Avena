import Link from "next/link";
import { FloatingNav } from "@/components/landing/floating-nav";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#050505]">
      {/* Background gradients mirroring the auth and premium pages */}
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

      <FloatingNav />

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-20 pt-24 md:pt-28">
          <div className="w-full max-w-md text-center">
          <h1 className="text-balance text-4xl font-medium leading-[1.05] -tracking-[0.025em] text-white sm:text-[42px]">
            Page not{" "}
            <span className="font-accent italic font-normal text-emerald-400/90">
              found
            </span>
            .
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-[1.6] font-light text-zinc-400">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="group flex h-[48px] items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-black shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-zinc-100 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] active:scale-[0.98]"
            >
              Back to home
            </Link>
            <Link
              href="/login"
              className="group flex h-[48px] items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 text-[15px] font-medium text-white transition-all duration-300 ease-out hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
