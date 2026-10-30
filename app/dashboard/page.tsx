import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, CircleHelp } from "lucide-react";
import { Workspace } from "@/components/dashboard/workspace";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Artist workspace" };

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return (
      <section className="site-container flex min-h-[70vh] items-center justify-center py-16">
        <div className="max-w-xl border border-line bg-card p-7 sm:p-10">
          <CircleHelp className="text-blue" size={24} />
          <p className="section-kicker mt-6">Demo mode</p>
          <h1 className="display-serif mt-2 text-4xl">Your workspace is waiting.</h1>
          <p className="mt-4 text-sm leading-7 text-muted">Profile editing, artwork uploads, and private artist data need a configured Supabase project. No fake account or sample portfolio is created here.</p>
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-xs leading-5 text-muted">
            <li>Copy <code>.env.example</code> to <code>.env.local</code> and add your public Supabase URL and anon key.</li>
            <li>Run the SQL migration in <code>supabase/migrations</code>.</li>
            <li>Create the public <code>artwork-images</code> storage bucket and policies from the migration.</li>
          </ol>
          <Link href="/auth/sign-up" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue">Account setup <ArrowUpRight size={15} /></Link>
        </div>
      </section>
    );
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/auth/sign-in");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("display_name,role,bio,location")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) {
    return <section className="site-container py-20"><h1 className="display-serif text-4xl">Workspace unavailable</h1><p className="mt-3 text-sm text-muted">Could not load your profile. Check the Supabase migration and try again.</p></section>;
  }
  if (profile?.role !== "artist") redirect("/explore");

  return <Workspace userId={user.id} email={user.email ?? ""} initialProfile={profile} />;
}
