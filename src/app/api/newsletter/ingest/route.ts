import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function safeCompare(a: string, b: string): boolean {
  const ah = createHash("sha256").update(a).digest();
  const bh = createHash("sha256").update(b).digest();
  return timingSafeEqual(ah, bh);
}

type IngestBody = {
  email?: string;
  source?: string;
  metadata?: Record<string, unknown>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const sharedSecret = process.env.N8N_SHARED_SECRET;
  if (!sharedSecret) {
    return NextResponse.json(
      { ok: false, error: "Server misconfigured: N8N_SHARED_SECRET not set" },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const presented = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
  if (!presented || !safeCompare(presented, sharedSecret)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: IngestBody;
  try {
    body = (await req.json()) as IngestBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Invalid email" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("newsletter_subscribers")
    .upsert(
      {
        email,
        source: body.source ?? "landing_footer",
        metadata: body.metadata ?? {},
      },
      { onConflict: "email", ignoreDuplicates: false }
    )
    .select("id, email, created_at")
    .maybeSingle();

  if (error) {
    console.error("newsletter ingest failed", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, subscriber: data });
}
