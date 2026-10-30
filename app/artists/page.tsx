import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { artists, artworks } from "@/lib/artworks";

export const metadata: Metadata = {
  title: "Artists",
  description: "Meet the independent artists behind ARTI's curated sample collection.",
};

export default function ArtistsPage() {
  return (
    <>
      <section className="site-container py-14 sm:py-20">
        <p className="section-kicker">The people behind the work</p>
        <h1 className="display-serif mt-3 text-5xl sm:text-7xl">Meet the artists<span className="text-blue">.</span></h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted">Each profile is a fictional example created to show how ARTI can introduce independent artists and their practices.</p>
      </section>
      <section className="site-container grid gap-x-6 gap-y-12 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist) => (
          <article key={artist.slug} className="border-t border-line pt-4">
            <Link href={`/artists/${artist.slug}`} className="artist-photo">
              <Image src={artist.image} alt={`${artist.name}, artist profile`} fill unoptimized sizes="(max-width: 640px) 90vw, 30vw" className="object-cover" />
            </Link>
            <div className="flex items-start justify-between gap-4 pt-4">
              <div>
                <Link href={`/artists/${artist.slug}`} className="display-serif text-3xl hover:text-blue">{artist.name}</Link>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted"><MapPin size={13} />{artist.location}</p>
              </div>
              <Link href={`/artists/${artist.slug}`} className="mt-1 flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-blue hover:text-blue" aria-label={`View ${artist.name}'s profile`}><ArrowUpRight size={16} /></Link>
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.1em] text-blue">{artist.medium}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{artist.bio}</p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-muted">{artworks.filter((work) => work.artistSlug === artist.slug).length} sample works</p>
          </article>
        ))}
      </section>
    </>
  );
}
