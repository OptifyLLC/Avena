export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={
        "inline-flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 ring-1 ring-inset ring-emerald-500/30 " +
        className
      }
      aria-hidden
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          d="M2.5 8c0-2.8 2-5 4.5-5s4.5 2.2 4.5 5"
          stroke="#34d399"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M5 9.5c0-1.4 1-2.5 2.5-2.5s2.5 1.1 2.5 2.5"
          stroke="#34d399"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="7.5" cy="11.75" r="1" fill="#34d399" />
      </svg>
    </span>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={"flex items-center gap-2 " + className}
    >
      <Logo />
      <span className="text-[15px] font-semibold tracking-tight text-white">
        Avena
      </span>
    </span>
  );
}
