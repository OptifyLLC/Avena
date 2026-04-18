"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { Button, Card, Input, Label } from "@/components/ui";

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
  const [business, setBusiness] = useState("Cedar Ridge Realty");
  const [email, setEmail] = useState("team@cedarridge.co");
  const [voiceName, setVoiceName] = useState("Avery");
  const [phone, setPhone] = useState("+1 (415) 555-0117");

  const [saved, setSaved] = useState({
    business: "Cedar Ridge Realty",
    email: "team@cedarridge.co",
    voiceName: "Avery",
    phone: "+1 (415) 555-0117",
  });
  const [savedFlag, setSavedFlag] = useState(false);

  const dirty =
    business !== saved.business ||
    email !== saved.email ||
    voiceName !== saved.voiceName ||
    phone !== saved.phone;

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved({ business, email, voiceName, phone });
    setSavedFlag(true);
    setTimeout(() => setSavedFlag(false), 2000);
  }

  function reset() {
    setBusiness(saved.business);
    setEmail(saved.email);
    setVoiceName(saved.voiceName);
    setPhone(saved.phone);
  }

  const initials = saved.business
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
            <Input id="biz" value={business} onChange={(e) => setBusiness(e.target.value)} />
          </Field>
          <Field id="email" label="Contact email">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field id="voice" label="Agent voice name">
            <Input id="voice" value={voiceName} onChange={(e) => setVoiceName(e.target.value)} />
          </Field>
          <Field id="phone" label="Business phone">
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-5">
          <Button type="button" variant="outline" size="sm" onClick={reset} disabled={!dirty}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={!dirty}>
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
}

function GoogleCalendarCard() {
  const [connected, setConnected] = useState(true);
  const [account, setAccount] = useState("team@cedarridge.co");

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
              {connected ? (
                <>Connected as {account}</>
              ) : (
                "Connect a calendar so Avena can check availability and book slots."
              )}
            </p>
          </div>
        </div>

        {connected ? (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const next = window.prompt("Switch to Google account", account);
                if (next && next.includes("@")) setAccount(next);
              }}
            >
              Change Google account
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConnected(false)}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => setConnected(true)}>
            Connect Google Calendar
          </Button>
        )}
      </div>
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
