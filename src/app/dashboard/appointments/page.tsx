"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { seedAppointments, type Appointment, type AppointmentStatus } from "@/lib/mock-data";

type Scope = "upcoming" | "today" | "past" | "all";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appts, setAppts] = useState<Appointment[]>(seedAppointments);
  const [scope, setScope] = useState<Scope>("upcoming");
  const [view, setView] = useState<"list" | "week">("list");
  const [activeId, setActiveId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const now = Date.now();
    const today = appts.filter((a) => {
      const d = new Date(a.date);
      const t = new Date();
      return (
        d.getFullYear() === t.getFullYear() &&
        d.getMonth() === t.getMonth() &&
        d.getDate() === t.getDate()
      );
    }).length;
    const upcoming = appts.filter((a) => new Date(a.date).getTime() >= now).length;
    const past = appts.filter((a) => new Date(a.date).getTime() < now).length;
    return { today, upcoming, past, all: appts.length };
  }, [appts]);

  const visible = useMemo(() => {
    const now = Date.now();
    if (scope === "all") return appts;
    if (scope === "today") {
      return appts.filter((a) => {
        const d = new Date(a.date);
        const t = new Date();
        return (
          d.getFullYear() === t.getFullYear() &&
          d.getMonth() === t.getMonth() &&
          d.getDate() === t.getDate()
        );
      });
    }
    if (scope === "upcoming") {
      return appts.filter((a) => new Date(a.date).getTime() >= now - 86_400_000);
    }
    return appts.filter((a) => new Date(a.date).getTime() < now);
  }, [appts, scope]);

  const active = activeId ? appts.find((a) => a.id === activeId) : null;

  if (!user) return null;
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

  function updateStatus(id: string, status: AppointmentStatus) {
    setAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  const tabs: { key: Scope; label: string; count: number }[] = [
    { key: "upcoming", label: "Upcoming", count: counts.upcoming },
    { key: "today", label: "Today", count: counts.today },
    { key: "past", label: "Past", count: counts.past },
    { key: "all", label: "All", count: counts.all },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Everything Avena booked, with status and live actions.
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

      <Card className="overflow-hidden">
        <div className="flex flex-wrap gap-1 border-b border-white/5 p-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setScope(t.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                scope === t.key ? "bg-white text-zinc-900" : "text-zinc-400 hover:text-zinc-100"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "ml-2 rounded-full px-1.5 py-0.5 text-xs",
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

        {visible.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-zinc-500">
            No appointments in this window.
          </div>
        ) : view === "list" ? (
          <ul className="divide-y divide-white/5">
            {visible.map((a) => (
              <li
                key={a.id}
                className="group flex items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-white/3 sm:px-5"
              >
                <button
                  type="button"
                  onClick={() => setActiveId(a.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4"
                >
                  <div className="flex h-12 w-14 shrink-0 flex-col items-center justify-center rounded-lg border border-white/10 bg-black/30 sm:w-16">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500">
                      {a.when.split(",")[0]}
                    </span>
                    <span className="font-mono text-[11px] text-white sm:text-xs">{a.time}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{a.name}</p>
                    <p className="truncate text-xs text-zinc-400">{a.service}</p>
                  </div>
                </button>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={a.status} />
                  <ApptActions
                    status={a.status}
                    onConfirm={() => updateStatus(a.id, "Confirmed")}
                    onCancel={() => updateStatus(a.id, "Cancelled")}
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
          onClose={() => setActiveId(null)}
          onStatus={(status) => {
            updateStatus(active.id, status);
          }}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const map: Record<AppointmentStatus, "emerald" | "amber" | "rose"> = {
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
  status: AppointmentStatus;
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
  appointments: Appointment[];
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
          const ad = new Date(a.date);
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
                  <p className="font-mono text-emerald-200">{a.time}</p>
                  <p className="truncate text-zinc-200">{a.name}</p>
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
  onClose,
  onStatus,
}: {
  appt: Appointment;
  onClose: () => void;
  onStatus: (status: AppointmentStatus) => void;
}) {
  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#070808]/95 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3 border-b border-white/5 p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              {appt.when}
            </p>
            <p className="mt-1 font-mono text-sm text-white">{appt.time}</p>
            <p className="mt-2 text-base font-medium text-white">{appt.name}</p>
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

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Service
            </p>
            <p className="mt-2 text-sm text-zinc-200">{appt.service}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Phone
            </p>
            <p className="mt-2 font-mono text-sm text-zinc-200">{appt.phone}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Status
            </p>
            <div className="mt-2">
              <StatusBadge status={appt.status} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-white/5 p-4">
          <Button
            size="sm"
            variant="secondary"
            className="flex-1"
            onClick={() => onStatus("Confirmed")}
            disabled={appt.status === "Confirmed"}
          >
            Confirm
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onStatus("Cancelled")}
            disabled={appt.status === "Cancelled"}
          >
            Cancel
          </Button>
        </div>
      </aside>
    </div>
  );
}
