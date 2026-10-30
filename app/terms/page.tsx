import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <article className="site-container max-w-3xl py-16 sm:py-20">
      <p className="section-kicker">Using this preview</p>
      <h1 className="display-serif mt-3 text-5xl">Terms</h1>
      <p className="mt-4 text-sm text-muted">This preview is provided for evaluation and is not legal advice.</p>
      <div className="mt-10 space-y-7 text-sm leading-7 text-muted">
        <section><h2 className="font-semibold text-ink">Sample content</h2><p className="mt-2">Artwork listings, artist identities, prices, locations, and collection counts shown before real user content is connected are examples. They do not represent actual offers, artists, or sales.</p></section>
        <section><h2 className="font-semibold text-ink">No checkout</h2><p className="mt-2">Purchases and payment processing are not enabled. A displayed sample price is informational only.</p></section>
        <section><h2 className="font-semibold text-ink">Artist content</h2><p className="mt-2">When artist accounts are enabled, account holders are responsible for having the rights and permissions needed to publish their uploaded work.</p></section>
        <section><h2 className="font-semibold text-ink">Production launch</h2><p className="mt-2">The site owner must have these terms reviewed and configured for their jurisdiction before accepting real users or transactions.</p></section>
      </div>
    </article>
  );
}
