import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <article className="site-container max-w-3xl py-16 sm:py-20">
      <p className="section-kicker">The important details</p>
      <h1 className="display-serif mt-3 text-5xl">Privacy</h1>
      <p className="mt-4 text-sm text-muted">This project is a preview and not legal advice.</p>
      <div className="mt-10 space-y-7 text-sm leading-7 text-muted">
        <section><h2 className="font-semibold text-ink">Demo browsing</h2><p className="mt-2">The sample artwork and artist profiles are illustrative. This demo does not intentionally collect analytics or create accounts unless the project owner configures Supabase.</p></section>
        <section><h2 className="font-semibold text-ink">Accounts and uploads</h2><p className="mt-2">When Supabase is configured, account data and artwork uploads are stored in the project’s Supabase database and storage. Public profile fields and published artworks may be visible to visitors. Draft artwork remains owner-only under the provided row-level security policies.</p></section>
        <section><h2 className="font-semibold text-ink">Contact messages</h2><p className="mt-2">Contact messages are stored only when Supabase is configured. Email delivery is not enabled by this project.</p></section>
        <section><h2 className="font-semibold text-ink">Before launch</h2><p className="mt-2">The site owner must publish a reviewed privacy policy, configure appropriate retention and access controls, and add rate limiting or CAPTCHA protection to public forms before accepting real user data.</p></section>
      </div>
    </article>
  );
}
