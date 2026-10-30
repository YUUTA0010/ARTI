"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = z.string().min(8).max(72).safeParse(password);
    if (!parsed.success) {
      toast.error("Use a password between 8 and 72 characters.");
      return;
    }
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      toast.error("Password updates require Supabase configuration.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data });
    setBusy(false);
    if (error) {
      toast.error("Could not update password", { description: error.message });
      return;
    }
    toast.success("Password updated.");
  }

  return (
    <section className="site-container flex min-h-[65vh] items-center justify-center py-16">
      <div className="w-full max-w-md border border-line bg-card p-7 sm:p-9">
        <p className="section-kicker">Account recovery</p>
        <h1 className="display-serif mt-3 text-4xl">Choose a new password</h1>
        {!isSupabaseConfigured() && <p className="mt-4 text-sm text-muted">Configure Supabase to update account passwords.</p>}
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="form-label">New password<input className="form-input" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <Button className="w-full" variant="accent" disabled={busy || !isSupabaseConfigured()}>{busy ? "Saving…" : "Update password"}</Button>
        </form>
        <Link className="mt-5 block text-center text-sm text-blue" href="/auth/sign-in">Back to sign in</Link>
      </div>
    </section>
  );
}
