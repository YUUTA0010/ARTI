"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = z.string().email().safeParse(email);
    if (!parsed.success) {
      toast.error("Enter a valid email address.");
      return;
    }
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      toast.error("Password reset is unavailable", { description: "Configure Supabase to enable account recovery." });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    setBusy(false);
    if (error) {
      toast.error("Could not send reset email", { description: error.message });
      return;
    }
    toast.success("If an account exists for that address, a reset link is on its way.");
  }

  return (
    <section className="site-container flex min-h-[65vh] items-center justify-center py-16">
      <div className="w-full max-w-md border border-line bg-card p-7 sm:p-9">
        <p className="section-kicker">Account recovery</p>
        <h1 className="display-serif mt-3 text-4xl">Reset your password</h1>
        {!isSupabaseConfigured() && <p className="mt-4 border border-blue/20 bg-blue/5 p-3 text-xs leading-5 text-muted">Demo mode: configure Supabase before requesting password recovery.</p>}
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="form-label">Email<input className="form-input" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <Button className="w-full" variant="accent" disabled={busy || !isSupabaseConfigured()}>{busy ? "Sending…" : "Send reset link"}</Button>
        </form>
        <Link className="mt-5 block text-center text-sm text-blue" href="/auth/sign-in">Back to sign in</Link>
      </div>
    </section>
  );
}
