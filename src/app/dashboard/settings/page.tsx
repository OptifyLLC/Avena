"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_TIMEZONE, TIMEZONE_OPTIONS } from "@/lib/timezones";
import { Button, Card, Input, Label, Select } from "@/components/ui";

type GoogleTokenRow = {
  google_email: string | null;
  scope: string | null;
  expires_at: string | null;
  updated_at: string | null;
};

type WorkspaceRow = {
  name: string | null;
  contact_phone: string | null;
  timezone: string | null;
};

type WorkspaceForm = {
  business: string;
  phone: string;
  timezone: string;
};

const EMPTY_FORM: WorkspaceForm = {
  business: "",
  phone: "",
  timezone: DEFAULT_TIMEZONE,
};

export default function SettingsPage() {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === "admin" ? <AdminSettings /> : <ClientSettings />;
}

function ClientSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Workspace</h1>
        <p className="mt-1 text-sm text-zinc-500">
          How your business shows up to callers and on your dashboard.
        </p>
      </div>

      <WorkspaceProfileCard />
      <GoogleCalendarCard />
    </div>
  );
}

function WorkspaceProfileCard() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;
  const [supabase] = useState(() => createClient());

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedFlag, setSavedFlag] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<WorkspaceForm>(EMPTY_FORM);
  const [saved, setSaved] = useState<WorkspaceForm>(EMPTY_FORM);

  useEffect(() => {
    if (!tenantId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("name, contact_phone, timezone")
        .eq("id", tenantId)
        .maybeSingle<WorkspaceRow>();
      if (cancelled) return;
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }
      const hydrated: WorkspaceForm = {
        business: data?.name ?? "",
        phone: data?.contact_phone ?? "",
        timezone: data?.timezone ?? DEFAULT_TIMEZONE,
      };
      setForm(hydrated);
      setSaved(hydrated);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase, tenantId]);

  const dirty =
    form.business !== saved.business ||
    form.phone !== saved.phone ||
    form.timezone !== saved.timezone;

  const submit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!tenantId || saving) return;
      setSaving(true);
      setErrorMsg(null);
      const { error } = await supabase
        .from("tenants")
        .update({
          name: form.business.trim(),
          contact_phone: form.phone.trim() || null,
          timezone: form.timezone,
        })
        .eq("id", tenantId);
      setSaving(false);
      if (error) {
        setErrorMsg(error.message);
        return;
      }
      setSaved(form);
      setSavedFlag(true);
      setTimeout(() => setSavedFlag(false), 2000);
    },
    [form, saving, supabase, tenantId]
  );

  function reset() {
    setForm(saved);
    setErrorMsg(null);
  }

  const initials =
    saved.business
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "W";

  if (loading) {
    return (
      <Card className="p-5 sm:p-6">
        <p className="text-sm text-zinc-500">Loading workspace…</p>
      </Card>
    );
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[13px] font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-white">Profile</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Used across the dashboard and call transcripts.
          </p>
        </div>
        {savedFlag && (
          <span className="inline-flex items-center gap-1.5 text-[12px] text-emerald-300">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Saved
          </span>
        )}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="biz" label="Business name">
            <Input
              id="biz"
              value={form.business}
              onChange={(e) => setForm({ ...form, business: e.target.value })}
              required
            />
          </Field>
          <Field id="email" label="Email">
            <Input
              id="email"
              type="email"
              value={user?.email ?? ""}
              disabled
              readOnly
            />
            <p className="text-[11px] text-zinc-500">
              Your sign-in email can&rsquo;t be changed here.
            </p>
          </Field>
          <Field id="phone" label="Business phone">
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field id="timezone" label="Timezone">
            <Select
              id="timezone"
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            >
              {TIMEZONE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
            <p className="text-[11px] text-zinc-500">
              Used by the voice agent to schedule and describe appointments.
            </p>
          </Field>
        </div>

        {errorMsg && (
          <p className="text-[12px] text-rose-300">{errorMsg}</p>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reset}
            disabled={!dirty || saving}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={!dirty || saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function GoogleCalendarCard() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;
  const [supabase] = useState(() => createClient());
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [row, setRow] = useState<GoogleTokenRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    if (!tenantId) return;
    const { data } = await supabase
      .from("google_tokens")
      .select("google_email, scope, expires_at, updated_at")
      .eq("tenant_id", tenantId)
      .maybeSingle<GoogleTokenRow>();
    setRow(data ?? null);
    setLoading(false);
  }, [supabase, tenantId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const status = searchParams.get("google");
    if (!status) return;
    const message = searchParams.get("message");
    if (status === "connected") {
      setBanner({ kind: "ok", text: "Google Calendar connected." });
    } else if (status === "error") {
      setBanner({
        kind: "error",
        text: `Couldn't connect Google Calendar${message ? `: ${message}` : "."}`,
      });
    }
    const t = window.setTimeout(() => setBanner(null), 4000);
    return () => window.clearTimeout(t);
  }, [searchParams]);

  async function disconnect() {
    if (busy) return;
    setBusy(true);
    setBanner(null);
    const res = await fetch("/api/google/disconnect", { method: "POST" });
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    setBusy(false);
    if (!res.ok || !json.ok) {
      setBanner({ kind: "error", text: json.error ?? "Failed to disconnect." });
      return;
    }
    setRow(null);
    setBanner({ kind: "ok", text: "Disconnected." });
  }

  const connected = !!row;

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/40">
            <GoogleCalendarMark />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">Google Calendar</p>
            <p className="text-xs text-zinc-400">
              {loading
                ? "Checking connection…"
                : connected
                  ? row?.google_email
                    ? `Connected as ${row.google_email}`
                    : "Connected"
                  : "Connect a calendar so Avena can check availability and book slots."}
            </p>
          </div>
        </div>

        {connected ? (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                window.location.href = "/api/google/authorize";
              }}
            >
              Change Google account
            </Button>
            <Button size="sm" variant="ghost" onClick={disconnect} disabled={busy}>
              {busy ? "Disconnecting…" : "Disconnect"}
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            disabled={loading}
            onClick={() => {
              window.location.href = "/api/google/authorize";
            }}
          >
            Connect Google Calendar
          </Button>
        )}
      </div>

      {banner && (
        <p
          className={`mt-4 text-[12px] ${
            banner.kind === "ok" ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {banner.text}
        </p>
      )}
    </Card>
  );
}

function AdminSettings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [saved, setSaved] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your admin profile.
        </p>
      </div>

      <Card className="p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Profile</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Shown on the dashboard header and in audit logs.
            </p>
          </div>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-emerald-300">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Saved
            </span>
          )}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Full name">
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field id="email" label="Email">
              <Input id="email" value={user?.email ?? ""} disabled />
            </Field>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-5">
            <Button type="submit" size="sm">
              Save changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
        {label}
      </Label>
      {children}
    </div>
  );
}

function GoogleCalendarMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-zinc-400"
      />
      <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400" />
      <path
        d="M8 2v4M16 2v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-zinc-400"
      />
      <circle cx="12" cy="14.5" r="2.5" fill="currentColor" className="text-emerald-400" />
    </svg>
  );
}
