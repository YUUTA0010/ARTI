import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { collections } from "@/lib/artworks";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore editorial collections of sample artwork, curated around a feeling or idea.",
};

export default function CollectionsPage() {
  return (
    <>
      <section className="site-container py-14 sm:py-20">
        <p className="section-kicker">Curated perspectives</p>
        <h1 className="display-serif mt-3 text-5xl sm:text-7xl">A little more <i className="text-blue">meaning.</i></h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted">Collections bring works together around a mood, a material, or a question. These editorial selections use sample artwork.</p>
      </section>
      <section className="site-container grid gap-5 pb-20 md:grid-cols-2">
        {collections.map((collection, index) => (
          <article id={collection.slug} key={collection.slug} className={index % 2 ? "md:translate-y-12" : ""}>
            <Link href={`/explore?category=${encodeURIComponent(index === 0 ? "Painting" : index === 1 ? "Digital Art" : index === 2 ? "Mixed Media" : "Abstract Art")}`} className="collection-tile">
              <Image src={collection.image} alt={`${collection.title} collection cover`} fill unoptimized sizes="(max-width: 768px) 90vw, 48vw" className="image-zoom object-cover" />
              <span className="collection-shade" />
              <span className="collection-copy">
                <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/80">{collection.label}</span>
                <span className="display-serif mt-2 block text-3xl text-white sm:text-4xl">{collection.title}</span>
                <span className="mt-2 block max-w-sm text-xs leading-5 text-white/80">{collection.description}</span>
                <span className="mt-4 inline-flex items-center gap-2 text-xs text-white">{collection.count} sample works <ArrowUpRight size={14} /></span>
              </span>
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
