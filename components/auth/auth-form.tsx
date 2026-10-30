"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

const schema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  role: z.enum(["artist", "collector"]).default("collector"),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters.").max(72),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "collector", name: "", email: "", password: "" },
  });

  async function submit(values: FormValues) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      toast.error("Authentication is not configured", { description: "Set the Supabase environment variables to enable accounts." });
      return;
    }
    const result = isSignUp
      ? await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: { data: { display_name: values.name, role: values.role }, emailRedirectTo: `${window.location.origin}/auth/callback` },
        })
      : await supabase.auth.signInWithPassword({ email: values.email, password: values.password });

    if (result.error) {
      toast.error("Could not complete sign-in", { description: result.error.message });
      return;
    }
    if (isSignUp && !result.data.session) {
      toast.success("Check your email", { description: "Follow the confirmation link to activate your account." });
      return;
    }
    toast.success(isSignUp ? "Account created" : "Welcome back");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      {!configured && (
        <div className="border border-blue/20 bg-blue/5 p-4 text-sm leading-6 text-ink">
          <strong className="block font-medium">Demo mode — accounts are disabled</strong>
          <span className="mt-1 block text-xs text-muted">Configure Supabase keys to enable real account registration and sign-in. This form will not create a mock account.</span>
        </div>
      )}
      {isSignUp && (
        <>
          <label className="form-label">Your name<input className="form-input" autoComplete="name" {...register("name")} />{errors.name && <span className="form-error">{errors.name.message}</span>}</label>
          <fieldset>
            <legend className="form-label mb-2">I’m here as a</legend>
            <div className="grid grid-cols-2 gap-2">
              <label className="role-choice"><input type="radio" value="artist" {...register("role")} /><span>Artist</span></label>
              <label className="role-choice"><input type="radio" value="collector" {...register("role")} /><span>Art enthusiast</span></label>
            </div>
          </fieldset>
        </>
      )}
      <label className="form-label">Email<input className="form-input" type="email" autoComplete="email" {...register("email")} />{errors.email && <span className="form-error">{errors.email.message}</span>}</label>
      <label className="form-label">Password<input className="form-input" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} {...register("password")} />{errors.password && <span className="form-error">{errors.password.message}</span>}</label>
      {!isSignUp && <Link href="/auth/reset-password" className="block text-right text-xs text-muted underline underline-offset-4 hover:text-blue">Forgot password?</Link>}
      <Button type="submit" variant="accent" className="w-full" disabled={!configured || isSubmitting}>{isSubmitting ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}</Button>
    </form>
  );
}
