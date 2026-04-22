"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  useAppointments,
  statusLabel,
  type AppointmentRow,
} from "@/lib/dashboard-data";

type Scope = "upcoming" | "today" | "past" | "all";
type StatusLabel = "Confirmed" | "Pending" | "Cancelled";

function isSameCalendarDay(value: string, referenceDate: Date) {
  const date = new Date(value);
  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth() &&
    date.getDate() === referenceDate.getDate()
  );
}

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatWhen(value: string, referenceDate: Date): string {
  const d = new Date(value);
  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);
  const diffDays = Math.round((d.getTime() - ref.getTime()) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatDayLabel(value: string): string {
  return new Date(value).toLocaleDateString("en-US", { weekday: "short" });
}

function formatMonthLabel(value: string): string {
  return new Date(value).toLocaleDateString("en-US", { month: "short" });
}

function formatDayOfMonth(value: string): string {
  return String(new Date(value).getDate());
}

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { data: appts, loading, error, updateStatus } = useAppointments();
  const [scope, setScope] = useState<Scope>("all");
  const [view, setView] = useState<"list" | "week">("list");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [referenceDate] = useState(() => new Date());

  const counts = useMemo(() => {
    const now = referenceDate.getTime();
    const today = appts.filter((a) => isSameCalendarDay(a.scheduled_for, referenceDate)).length;
    const upcoming = appts.filter((a) => new Date(a.scheduled_for).getTime() >= now).length;
    const past = appts.filter((a) => new Date(a.scheduled_for).getTime() < now).length;
    return { today, upcoming, past, all: appts.length };
  }, [appts, referenceDate]);

  const visible = useMemo(() => {
    const now = referenceDate.getTime();
    if (scope === "all") return appts;
    if (scope === "today") {
      return appts.filter((a) => isSameCalendarDay(a.scheduled_for, referenceDate));
    }
    if (scope === "upcoming") {
      return appts.filter((a) => new Date(a.scheduled_for).getTime() >= now);
    }
    return appts.filter((a) => new Date(a.scheduled_for).getTime() < now);
  }, [appts, referenceDate, scope]);

  const active = activeId ? appts.find((a) => a.id === activeId) : null;

  if (!user || loading) return <AppointmentsSkeleton />;
  if (user.role !== "client") {
    return (
      <Card className="p-10 text-center">
        <h1 className="text-lg font-semibold">Clients only</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Switch to a client workspace to view appointments.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-[13px] font-medium text-white transition-colors hover:bg-white/10"
        >
          Back to admin overview
        </Link>
      </Card>
    );
  }

  const tabs: { key: Scope; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "upcoming", label: "Upcoming", count: counts.upcoming },
    { key: "today", label: "Today", count: counts.today },
    { key: "past", label: "Past", count: counts.past },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Appointments
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Everything Operavo booked, with status and live actions.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1 text-[13px]">
          <button
            onClick={() => setView("list")}
            className={cn(
              "rounded-md px-3 py-1.5 font-medium transition-colors",
              view === "list" ? "bg-white text-zinc-900" : "text-zinc-400 hover:text-zinc-100"
            )}
          >
            List
          </button>
          <button
            onClick={() => setView("week")}
            className={cn(
              "rounded-md px-3 py-1.5 font-medium transition-colors",
              view === "week" ? "bg-white text-zinc-900" : "text-zinc-400 hover:text-zinc-100"
            )}
          >
            Week
          </button>
        </div>
      </div>

      {error && (
        <Card className="border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-200">
          Failed to load appointments: {error}
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="border-b border-white/5 p-4">
          <div className="flex flex-wrap gap-1 rounded-xl bg-black/30 p-1 ring-1 ring-inset ring-white/5">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setScope(t.key)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",
                  scope === t.key
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "ml-2 inline-flex min-w-[18px] justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                    scope === t.key
                      ? "bg-zinc-900 text-white"
                      : "bg-white/10 text-zinc-400"
                  )}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {appts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <p className="text-sm text-zinc-400">
              No appointments yet. When Operavo books one it will appear here.
            </p>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12h8" />
              </svg>
            </div>
            <p className="text-sm text-zinc-400">
              No appointments in this window.
            </p>
          </div>
        ) : view === "list" ? (
          <ul className="divide-y divide-white/5">
            {visible.map((a) => (
              <li
                key={a.id}
                className="group flex items-center justify-between gap-3 px-5 py-5 transition-colors duration-150 hover:bg-white/[0.035] sm:px-6"
              >
                <button
                  type="button"
                  onClick={() => setActiveId(a.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4"
                >
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg border border-white/10 bg-black/30 sm:w-16">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                      {formatMonthLabel(a.scheduled_for)}
                    </span>
                    <span className="text-base font-semibold leading-none text-white">
                      {formatDayOfMonth(a.scheduled_for)}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500">
                      {formatDayLabel(a.scheduled_for)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {a.attendee_name ?? a.title ?? "Unknown attendee"}
                    </p>
                    <p className="truncate text-xs text-zinc-400">
                      <span className="text-zinc-300">
                        {formatWhen(a.scheduled_for, referenceDate)}
                      </span>
                      <span className="mx-1.5 text-zinc-600">·</span>
                      <span className="font-mono text-zinc-300">
                        {formatTime(a.scheduled_for)}
                      </span>
                      <span className="mx-1.5 text-zinc-600">·</span>
                      {a.service ?? a.title ?? "Appointment"}
                    </p>
                  </div>
                </button>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={statusLabel(a.status)} />
                  <ApptActions
                    status={statusLabel(a.status)}
                    onConfirm={() => void updateStatus(a.id, "confirmed")}
                    onCancel={() => void updateStatus(a.id, "cancelled")}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <WeekView appointments={visible} onSelect={setActiveId} />
        )}
      </Card>

      {active && (
        <ApptDetailDrawer
          appt={active}
          referenceDate={referenceDate}
          onClose={() => setActiveId(null)}
          onStatus={(status) => {
            void updateStatus(active.id, status);
          }}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: StatusLabel }) {
  const map: Record<StatusLabel, "emerald" | "amber" | "rose"> = {
    Confirmed: "emerald",
    Pending: "amber",
    Cancelled: "rose",
  };
  return <Badge tone={map[status]}>{status}</Badge>;
}

function ApptActions({
  status,
  onConfirm,
  onCancel,
}: {
  status: StatusLabel;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="hidden items-center gap-2 sm:flex">
      {status !== "Confirmed" && (
        <Button size="sm" variant="secondary" onClick={onConfirm}>
          Confirm
        </Button>
      )}
      {status !== "Cancelled" && (
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
}

function WeekView({
  appointments,
  onSelect,
}: {
  appointments: AppointmentRow[];
  onSelect: (id: string) => void;
}) {
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
  }, []);

  return (
    <div className="grid grid-cols-1 divide-y divide-white/5 md:grid-cols-7 md:divide-x md:divide-y-0">
      {days.map((d) => {
        const dayAppts = appointments.filter((a) => {
          const ad = new Date(a.scheduled_for);
          return (
            ad.getFullYear() === d.getFullYear() &&
            ad.getMonth() === d.getMonth() &&
            ad.getDate() === d.getDate()
          );
        });
        const isToday = d.toDateString() === new Date().toDateString();
        return (
          <div key={d.toISOString()} className="min-h-[220px] p-3">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </p>
              <span
                className={cn(
                  "text-sm font-semibold",
                  isToday ? "text-emerald-400" : "text-zinc-300"
                )}
              >
                {d.getDate()}
              </span>
            </div>
            <div className="space-y-1.5">
              {dayAppts.length === 0 && (
                <p className="text-[11px] text-zinc-600">—</p>
              )}
              {dayAppts.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onSelect(a.id)}
                  className="block w-full rounded-md border border-emerald-500/20 bg-emerald-500/8 px-2 py-1.5 text-left text-[11px] transition-colors hover:bg-emerald-500/15"
                >
                  <p className="font-mono text-emerald-200">
                    {formatTime(a.scheduled_for)}
                  </p>
                  <p className="truncate text-zinc-200">
                    {a.attendee_name ?? a.title ?? "—"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ApptDetailDrawer({
  appt,
  referenceDate,
  onClose,
  onStatus,
}: {
  appt: AppointmentRow;
  referenceDate: Date;
  onClose: () => void;
  onStatus: (status: "confirmed" | "pending" | "cancelled") => void;
}) {
  const status = statusLabel(appt.status);
  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col border-l border-white/10 bg-[#070808]/95 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3 border-b border-white/5 p-6">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Appointment
            </p>
            <p className="mt-1 truncate text-lg font-semibold text-white">
              {appt.attendee_name ?? appt.title ?? (
                <span className="italic text-zinc-400">Unknown attendee</span>
              )}
            </p>
            <p className="mt-0.5 truncate font-mono text-xs text-zinc-500">
              <span className="text-zinc-300">
                {formatWhen(appt.scheduled_for, referenceDate)}
              </span>
              <span className="mx-1.5 text-zinc-600">·</span>
              <span>{formatTime(appt.scheduled_for)}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Service
            </p>
            <p className="mt-2 text-sm text-zinc-200">
              {appt.service ?? appt.title ?? "—"}
            </p>
          </div>
          {appt.attendee_phone && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Phone
              </p>
              <p className="mt-2 font-mono text-sm text-zinc-200">
                {appt.attendee_phone}
              </p>
            </div>
          )}
          {appt.attendee_email && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Email
              </p>
              <p className="mt-2 text-sm text-zinc-200">{appt.attendee_email}</p>
            </div>
          )}
          {appt.duration_minutes != null && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Duration
              </p>
              <p className="mt-2 text-sm text-zinc-200">
                {appt.duration_minutes} minutes
              </p>
            </div>
          )}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Status
            </p>
            <div className="mt-2">
              <StatusBadge status={status} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-white/5 p-4">
          <Button
            size="sm"
            variant="secondary"
            className="flex-1"
            onClick={() => onStatus("confirmed")}
            disabled={appt.status === "confirmed"}
          >
            Confirm
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onStatus("cancelled")}
            disabled={appt.status === "cancelled"}
          >
            Cancel
          </Button>
        </div>
      </aside>
    </div>
  );
}

function AppointmentsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap gap-2 border-b border-white/5 p-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-md" />
          ))}
        </div>
        <div className="divide-y divide-white/5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-16 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
