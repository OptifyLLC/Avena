"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth, hasCalendarScope } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_TIMEZONE, TIMEZONE_OPTIONS } from "@/lib/timezones";
import { Button, Card, Input, Label, Select, Skeleton } from "@/components/ui";
import { updateWorkspaceAction } from "@/app/actions/tenant";

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
  fullName: string;
  phone: string;
  timezone: string;
};

type BannerState = { kind: "ok" | "error"; text: string };

const EMPTY_FORM: WorkspaceForm = {
  business: "",
  fullName: "",
  phone: "",
  timezone: DEFAULT_TIMEZONE,
};

const GOOGLE_BANNER_MESSAGES = {
  account_not_approved: "Your account must be approved before connecting Google Calendar.",
  connection_failed: "Couldn't connect Google Calendar. Please try again.",
  insufficient_permissions: "You don't have permission to manage this Google Calendar connection.",
  missing_code_or_state: "Google Calendar didn't return the required authorization details.",
  missing_tenant: "We couldn't determine which workspace to connect.",
  not_authenticated: "Please sign in again before connecting Google Calendar.",
  oauth_cancelled: "Google Calendar connection was cancelled before it could finish.",
  save_failed: "We couldn't save the Google Calendar connection. Please try again.",
  state_mismatch: "Google Calendar verification expired. Please try connecting again.",
  tenant_mismatch: "This Google Calendar response doesn't match your current workspace.",
  token_exchange_failed: "We couldn't complete the Google Calendar sign-in. Please try again.",
} satisfies Record<string, string>;

function resolveGoogleBannerMessage(code: string | null) {
  if (code && Object.hasOwn(GOOGLE_BANNER_MESSAGES, code)) {
    return GOOGLE_BANNER_MESSAGES[code as keyof typeof GOOGLE_BANNER_MESSAGES];
  }

  return GOOGLE_BANNER_MESSAGES.connection_failed;
}

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
  const { user, refreshUser } = useAuth();
  const tenantId = user?.tenantId;
  const userName = user?.name ?? "";
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
        fullName: userName,
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
  }, [supabase, tenantId, userName]);

  const dirty =
    form.business !== saved.business ||
    form.fullName !== saved.fullName ||
    form.phone !== saved.phone ||
    form.timezone !== saved.timezone;

  const submit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!tenantId || saving) return;
      setSaving(true);
      setErrorMsg(null);

      const result = await updateWorkspaceAction({
        name: form.business,
        contact_phone: form.phone,
        timezone: form.timezone,
        full_name: form.fullName,
      });

      setSaving(false);
      if (!result.ok) {
        setErrorMsg(result.error ?? "Failed to update workspace");
        return;
      }
      setSaved(form);
      setSavedFlag(true);
      setTimeout(() => setSavedFlag(false), 2000);
      void refreshUser();
    },
    [form, saving, tenantId, refreshUser]
  );

  function reset() {
    setForm(saved);
    setErrorMsg(null);
  }

  const initials =
    (saved.fullName || saved.business)
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "W";

  if (loading) {
    return <WorkspaceProfileSkeleton />;
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
          <Field id="fullname" label="Your name">
            <Input
              id="fullname"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Jane Cooper"
            />
            <p className="text-[11px] text-zinc-500">
              Shown in the sidebar and on your account.
            </p>
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
          <Field id="biz" label="Business name">
            <Input
              id="biz"
              value={form.business}
              onChange={(e) => setForm({ ...form, business: e.target.value })}
              required
            />
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
  const [disconnecting, setDisconnecting] = useState(false);
  const [disconnectError, setDisconnectError] = useState<string | null>(null);

  const handleDisconnect = useCallback(async () => {
    if (disconnecting) return;
    if (!confirm("Disconnect Google Calendar? Operavo will stop reading or creating events until you reconnect.")) {
      return;
    }
    setDisconnecting(true);
    setDisconnectError(null);
    try {
      const res = await fetch("/api/google/disconnect", { method: "POST" });
      const payload = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !payload.ok) {
        setDisconnectError(payload.error ?? `Disconnect failed (${res.status})`);
        setDisconnecting(false);
        return;
      }
      setRow(null);
      setDisconnecting(false);
    } catch (err) {
      setDisconnectError(err instanceof Error ? err.message : "Disconnect failed");
      setDisconnecting(false);
    }
  }, [disconnecting]);

  useEffect(() => {
    if (!tenantId) return;
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from("google_tokens_public")
        .select("google_email, scope, expires_at, updated_at")
        .eq("tenant_id", tenantId)
        .maybeSingle<GoogleTokenRow>();

      if (cancelled) return;
      setRow(data ?? null);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [supabase, tenantId]);

  const banner = useMemo<BannerState | null>(() => {
    const status = searchParams.get("google");
    if (!status) return null;

    if (status === "connected") {
      return { kind: "ok", text: "Google Calendar connected." };
    }

    if (status === "error") {
      return {
        kind: "error",
        text: resolveGoogleBannerMessage(searchParams.get("message")),
      };
    }

    return null;
  }, [searchParams]);

  if (loading) {
    return <GoogleCalendarSkeleton />;
  }

  const hasRow = !!row;
  const needsReconnect = hasRow && !hasCalendarScope(row?.scope);

  const statusText = !hasRow
    ? "Connect a calendar so Operavo can check availability and book slots."
    : needsReconnect
      ? row?.google_email
        ? `Signed in as ${row.google_email} — calendar permission missing.`
        : "Calendar permission missing."
      : row?.google_email
        ? `Connected as ${row.google_email}`
        : "Connected";

  const buttonLabel = !hasRow
    ? "Connect Google Calendar"
    : needsReconnect
      ? "Reconnect Google Calendar"
      : "Change Google account";

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/40">
            <GoogleCalendarMark />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">Google Calendar</p>
            <p className="text-xs text-zinc-400">{statusText}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasRow && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleDisconnect}
              disabled={disconnecting}
            >
              {disconnecting ? "Disconnecting…" : "Disconnect"}
            </Button>
          )}
          <Button
            size="sm"
            variant={needsReconnect ? "secondary" : "primary"}
            onClick={() => {
              window.location.href = "/api/google/authorize";
            }}
            disabled={disconnecting}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>

      {disconnectError && (
        <p className="mt-3 text-[12px] text-rose-300">{disconnectError}</p>
      )}

      {needsReconnect && (
        <p className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[12px] text-amber-200">
          Operavo needs permission to view and edit your calendar events. Click
          &ldquo;Reconnect Google Calendar&rdquo; and make sure the calendar
          checkbox stays checked on the Google consent screen.
        </p>
      )}

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

function WorkspaceProfileSkeleton() {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
      </div>

      <div className="mt-10 space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-6">
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

function GoogleCalendarSkeleton() {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
          <div className="min-w-0">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-3 w-48" />
          </div>
        </div>
        <Skeleton className="h-9 w-44 rounded-full" />
      </div>
    </Card>
  );
}
