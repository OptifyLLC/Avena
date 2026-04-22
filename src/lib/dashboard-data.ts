"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";

export type CallRow = {
  id: string;
  tenant_id: string;
  vapi_call_id: string | null;
  caller_phone: string | null;
  caller_name: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  intent: string | null;
  outcome: string | null;
  lead_score: "hot" | "warm" | "cold" | null;
  next_action: string | null;
  transcript: string | null;
  summary: string | null;
  created_at: string;
};

export type LeadRow = {
  id: string;
  tenant_id: string;
  call_id: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  company: string | null;
  score: "hot" | "warm" | "cold" | null;
  notes: string | null;
  source: string | null;
  last_call_at: string | null;
  created_at: string;
};

export type AppointmentRow = {
  id: string;
  tenant_id: string;
  call_id: string | null;
  google_event_id: string | null;
  title: string | null;
  attendee_name: string | null;
  attendee_phone: string | null;
  attendee_email: string | null;
  service: string | null;
  scheduled_for: string;
  duration_minutes: number | null;
  status: "confirmed" | "pending" | "cancelled";
  created_at: string;
};

type FetchState<T> = {
  data: T[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useCalls(): FetchState<CallRow> {
  const { user } = useAuth();
  const [supabase] = useState(() => createClient());
  const [data, setData] = useState<CallRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const tenantId = user?.tenantId ?? null;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!tenantId) {
        if (cancelled) return;
        setData([]);
        setError(null);
        setLoading(false);
        return;
      }
      const { data: rows, error: err } = await supabase
        .from("calls")
        .select(
          "id, tenant_id, vapi_call_id, caller_phone, caller_name, started_at, ended_at, duration_seconds, intent, outcome, lead_score, next_action, transcript, summary, created_at"
        )
        .eq("tenant_id", tenantId)
        .order("started_at", { ascending: false, nullsFirst: false })
        .limit(500);
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setData([]);
      } else {
        setError(null);
        setData((rows ?? []) as CallRow[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase, tenantId, refreshKey]);

  const refresh = useCallback(async () => {
    setRefreshKey((n) => n + 1);
  }, []);

  return { data, loading, error, refresh };
}

export function useLeads(): FetchState<LeadRow> & {
  updateScore: (id: string, score: "hot" | "warm" | "cold") => Promise<void>;
} {
  const { user } = useAuth();
  const [supabase] = useState(() => createClient());
  const [data, setData] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const tenantId = user?.tenantId ?? null;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!tenantId) {
        if (cancelled) return;
        setData([]);
        setError(null);
        setLoading(false);
        return;
      }
      const { data: rows, error: err } = await supabase
        .from("leads")
        .select(
          "id, tenant_id, call_id, name, phone, email, company, score, notes, source, last_call_at, created_at"
        )
        .eq("tenant_id", tenantId)
        .order("last_call_at", { ascending: false, nullsFirst: false })
        .limit(500);
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setData([]);
      } else {
        setError(null);
        setData((rows ?? []) as LeadRow[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase, tenantId, refreshKey]);

  const refresh = useCallback(async () => {
    setRefreshKey((n) => n + 1);
  }, []);

  const updateScore = useMemo(
    () => async (id: string, score: "hot" | "warm" | "cold") => {
      const { error: err } = await supabase
        .from("leads")
        .update({ score })
        .eq("id", id);
      if (err) {
        setError(err.message);
        return;
      }
      setData((prev) => prev.map((l) => (l.id === id ? { ...l, score } : l)));
    },
    [supabase]
  );

  return { data, loading, error, refresh, updateScore };
}

export function useAppointments(): FetchState<AppointmentRow> & {
  updateStatus: (
    id: string,
    status: "confirmed" | "pending" | "cancelled"
  ) => Promise<void>;
} {
  const { user } = useAuth();
  const [supabase] = useState(() => createClient());
  const [data, setData] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const tenantId = user?.tenantId ?? null;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!tenantId) {
        if (cancelled) return;
        setData([]);
        setError(null);
        setLoading(false);
        return;
      }
      const { data: rows, error: err } = await supabase
        .from("appointments")
        .select(
          "id, tenant_id, call_id, google_event_id, title, attendee_name, attendee_phone, attendee_email, service, scheduled_for, duration_minutes, status, created_at"
        )
        .eq("tenant_id", tenantId)
        .order("scheduled_for", { ascending: true })
        .limit(500);
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setData([]);
      } else {
        setError(null);
        setData((rows ?? []) as AppointmentRow[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase, tenantId, refreshKey]);

  const refresh = useCallback(async () => {
    setRefreshKey((n) => n + 1);
  }, []);

  const updateStatus = useMemo(
    () => async (id: string, status: "confirmed" | "pending" | "cancelled") => {
      const { error: err } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);
      if (err) {
        setError(err.message);
        return;
      }
      setData((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    },
    [supabase]
  );

  return { data, loading, error, refresh, updateStatus };
}

export function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatIntent(call: CallRow): string {
  if (call.outcome === "booked") return "Appointment booked";
  if (call.outcome === "transferred") return "Transferred to human";
  if (call.intent) return call.intent;
  if (call.outcome === "no_booking") return "Q&A · no booking";
  return "Call handled";
}

export function intentTone(
  call: CallRow
): "emerald" | "amber" | "rose" | "neutral" {
  // Only fully completed bookings are green.
  if (call.outcome === "booked") return "emerald";
  if (call.outcome === "transferred") return "amber";
  // Intent to book that didn't complete is shown amber so it's visually
  // distinct from actual bookings — "they wanted it, we didn't close".
  const intent = call.intent?.toLowerCase() ?? "";
  if (intent.includes("book") || intent.includes("appointment")) return "amber";
  return "neutral";
}

export function scoreLabel(
  score: "hot" | "warm" | "cold" | null
): "Hot" | "Warm" | "Cold" | null {
  if (!score) return null;
  return (score.charAt(0).toUpperCase() + score.slice(1)) as
    | "Hot"
    | "Warm"
    | "Cold";
}

export function statusLabel(
  status: "confirmed" | "pending" | "cancelled"
): "Confirmed" | "Pending" | "Cancelled" {
  if (status === "confirmed") return "Confirmed";
  if (status === "pending") return "Pending";
  return "Cancelled";
}
