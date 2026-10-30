import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreGrid } from "@/components/artwork/explore-grid";

export const metadata: Metadata = {
  title: "Explore art",
  description: "Search and filter sample artwork from independent artists on ARTI.",
};

export default function ExplorePage() {
  return (
    <>
      <section className="site-container py-12 sm:py-16">
        <p className="section-kicker">A world in the making</p>
        <h1 className="display-serif mt-3 text-5xl sm:text-7xl">Explore art<span className="text-blue">.</span></h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted">Find a new perspective, follow a feeling, or see where a search takes you. Every work here is sample content for the ARTI demo.</p>
      </section>
      <Suspense fallback={<div className="site-container pb-20 text-sm text-muted">Loading the collection…</div>}>
        <ExploreGrid />
      </Suspense>
    </>
  );
}
