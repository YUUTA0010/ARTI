import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry/inquiry-form";

export const metadata: Metadata = {
  title: "About ARTI",
  description: "ARTI is a considered space for independent art and the people behind it.",
};

export default function AboutPage() {
  return (
    <>
      <section className="site-container grid gap-10 py-16 sm:py-24 md:grid-cols-[1fr_1fr] md:gap-16">
        <div>
          <p className="section-kicker">The idea behind ARTI</p>
          <h1 className="display-serif mt-4 text-6xl leading-[0.98] sm:text-7xl">A little more room for <i className="text-blue">art.</i></h1>
        </div>
        <div className="flex flex-col justify-end">
          <p className="text-base leading-8 text-muted">ARTI is being built as a welcoming place to discover independent work, learn about artists, and find new perspectives beyond the familiar.</p>
          <p className="mt-5 text-sm leading-7 text-muted">This preview uses fictional artist profiles and sample artwork. Accounts, publishing, and community features become available when the project owner configures Supabase.</p>
        </div>
      </section>
      <section className="bg-[#efeee9] py-14 sm:py-20">
        <div className="site-container grid gap-8 md:grid-cols-3">
          {[
            ["01", "Discover slowly", "A thoughtful collection designed to make it easier to follow a feeling, not just a trend."],
            ["02", "Meet the makers", "Every work begins with a person and a point of view worth knowing."],
            ["03", "Make room", "Independent artists deserve welcoming spaces to share their practice and be found."],
          ].map(([number, title, copy]) => (
            <article key={number} className="border-t border-line pt-4">
              <p className="text-xs font-bold tracking-[0.14em] text-blue">{number}</p>
              <h2 className="display-serif mt-7 text-3xl">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="contact" className="site-container grid gap-10 py-16 sm:py-20 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="section-kicker">Start a conversation</p>
          <h2 className="display-serif mt-3 text-5xl">We’d love to hear from you.</h2>
          <p className="mt-4 text-sm leading-6 text-muted">Send a question or tell us what you’d like to see on ARTI. The form only stores messages when Supabase is configured.</p>
        </div>
        <InquiryForm />
      </section>
    </>
  );
}
