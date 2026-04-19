"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { User } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { Button, Input, Label } from "@/components/ui";

type Props = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSaved: () => void;
};

export function ConfigureVapiModal({ open, user, onClose, onSaved }: Props) {
  const [supabase] = useState(() => createClient());
  const [assistantId, setAssistantId] = useState(user?.vapiAssistantId ?? "");
  const [twilioNumber, setTwilioNumber] = useState(user?.twilioPhoneNumber ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !user) return null;

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    const { error: updateError } = await supabase
      .from("tenants")
      .update({
        vapi_assistant_id: assistantId.trim() || null,
        twilio_phone_number: twilioNumber.trim() || null,
      })
      .eq("id", user.tenantId);
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    onSaved();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0b0b] p-6 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Voice agent setup
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">
              {user.company || user.name || user.email}
            </h2>
            <p className="mt-1 text-[12px] text-zinc-500">
              Duplicate your master Vapi assistant, paste the new assistant&rsquo;s ID here, and (optionally) its Twilio number.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={save} className="mt-5 space-y-4">
          <Field
            id="assistant"
            label="Vapi Assistant ID"
            hint="Copy from Vapi dashboard → your client&rsquo;s assistant → Overview."
          >
            <Input
              id="assistant"
              value={assistantId}
              onChange={(e) => setAssistantId(e.target.value)}
              placeholder="asst_..."
              autoComplete="off"
              spellCheck={false}
            />
          </Field>

          <Field
            id="twilio"
            label="Twilio phone number"
            hint="Optional. The number this client answers on."
          >
            <Input
              id="twilio"
              value={twilioNumber}
              onChange={(e) => setTwilioNumber(e.target.value)}
              placeholder="+1 (415) 555-0117"
              autoComplete="off"
            />
          </Field>

          {user.sheetTabName && (
            <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 text-[12px] text-zinc-400">
              <span className="text-zinc-500">Sheet tab: </span>
              <span className="text-zinc-200">{user.sheetTabName}</span>
            </div>
          )}

          {error && (
            <p className="text-[12px] text-rose-300">{error}</p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
        {label}
      </Label>
      {children}
      {hint && <p className="text-[11px] text-zinc-500">{hint}</p>}
    </div>
  );
}
