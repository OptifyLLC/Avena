"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button, Card } from "@/components/ui";

export default function PendingPage() {
  const router = useRouter();
  const { user, hydrated, logout } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.status === "approved") {
      router.replace(user.role === "admin" ? "/dashboard" : "/dashboard");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) return null;
  if (user.status === "approved") return null;

  const copy = copyFor(user.status);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 py-10">
      <Card className="w-full max-w-md p-7 sm:p-8">
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${copy.dotClass}`} />
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {copy.tagline}
          </p>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          {copy.heading}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          {copy.body}
        </p>

        <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.02] p-4 text-[13px] text-zinc-300">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
            Your request
          </p>
          <p className="mt-2 text-white">{user.name || user.email}</p>
          <p className="text-zinc-500">{user.email}</p>
          {user.company && (
            <p className="mt-1 text-zinc-400">{user.company}</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="text-[13px] text-zinc-400 hover:text-white"
          >
            Back to site
          </Link>
          <Button size="sm" variant="outline" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </Card>
    </div>
  );
}

function copyFor(status: string) {
  if (status === "rejected") {
    return {
      tagline: "Request closed",
      heading: "Your access was not approved",
      body:
        "An administrator has reviewed your request and chose not to approve it. If you think this is a mistake, please reach out to the Optify team.",
      dotClass: "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]",
    };
  }
  if (status === "unapproved") {
    return {
      tagline: "Access paused",
      heading: "Your workspace is paused",
      body:
        "An administrator has temporarily revoked access to your workspace. Please contact the Optify team to restore it.",
      dotClass: "bg-zinc-400",
    };
  }
  return {
    tagline: "Awaiting approval",
    heading: "Your request is in review",
    body:
      "Thanks for signing up. An administrator will review your workspace and approve it shortly. You'll get access as soon as that happens.",
    dotClass: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
  };
}
