"use client";

import { forwardRef } from "react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap rounded-full transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-black shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] hover:bg-zinc-100 hover:shadow-[0_0_45px_-12px_rgba(255,255,255,0.5)] focus-visible:ring-white/40",
  secondary:
    "bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-500/30 hover:bg-emerald-500/25 hover:text-emerald-100 focus-visible:ring-emerald-500/40",
  outline:
    "border border-white/10 bg-white/5 text-white hover:bg-white/10 focus-visible:ring-white/20",
  ghost:
    "text-zinc-300 hover:bg-white/5 hover:text-white focus-visible:ring-white/20",
  danger:
    "bg-rose-500/15 text-rose-200 ring-1 ring-inset ring-rose-500/30 hover:bg-rose-500/25 hover:text-rose-100 focus-visible:ring-rose-500/40",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-10 px-4 text-[14px]",
  lg: "h-11 px-5 text-[15px]",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={cn(
          buttonBase,
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-lg border border-white/10 bg-black/40 px-3.5 text-[14px] text-white placeholder:text-zinc-500 transition-colors",
        "focus:border-emerald-500/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/15",
        className
      )}
      {...props}
    />
  );
});

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-10 w-full appearance-none rounded-lg border border-white/10 bg-black/40 pl-3.5 pr-9 text-[14px] text-white transition-colors",
          "focus:border-emerald-500/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/15",
          "[&>option]:bg-zinc-900 [&>option]:text-white",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 8 4 4 4-4" />
      </svg>
    </div>
  );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[96px] w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-[14px] text-white placeholder:text-zinc-500 transition-colors",
          "focus:border-emerald-500/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/15",
          className
        )}
        {...props}
      />
    );
  }
);

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-[13px] font-medium tracking-[0.005em] text-zinc-200",
        className
      )}
      {...props}
    />
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/2 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-white/5",
        className
      )}
    />
  );
}

type BadgeTone = "neutral" | "amber" | "emerald" | "rose" | "zinc";

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  const tones: Record<BadgeTone, string> = {
    neutral:
      "bg-white/5 text-zinc-300 ring-1 ring-inset ring-white/10",
    amber:
      "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30",
    emerald:
      "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30",
    rose:
      "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30",
    zinc:
      "bg-white text-zinc-900",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
